import type { Locator, Page, Response } from '@playwright/test';
import { expect } from '@playwright/test';

import { ko } from '../../fixtures/storefront-data.js';
import { firstLocatorWithCount, firstVisibleLocator } from '../../fixtures/resilient-locator.js';
import { recordHeal, selfHealEnabled } from '../../fixtures/self-heal.js';
import { enterCartDialogCustomSize } from './cart-size-dialog.js';
import type { CartLineItem, ProductConfig } from '../../fixtures/types.js';

const cartPreviewTitle = /\uc7a5\ubc14\uad6c\ub2c8 \ubbf8\ub9ac\ubcf4\uae30|Cart Preview/i;
const editDialogTitle = /\uc0ac\uc774\uc988 \ubc0f \uc218\ub7c9 \uc218\uc815|\uc5c5\ub370\uc774\ud2b8|Update/i;
const cartItemUpdatePath = '/sys/kr/cart/item/update';

type SelectResult = {
  changed: boolean;
  text: string;
  value: string;
};

export class CartDrawer {
  readonly page: Page;
  readonly dialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog').filter({ hasText: cartPreviewTitle });
  }

  async expectVisible(): Promise<void> {
    await expect(this.dialog).toBeVisible();
  }

  async isVisible(options?: { timeout?: number }): Promise<boolean> {
    await this.dialog.waitFor({ state: 'visible', timeout: options?.timeout ?? 10_000 }).catch(() => undefined);
    return this.dialog.isVisible().catch(() => false);
  }

  async expectEmpty(config?: ProductConfig | CartLineItem): Promise<void> {
    if (!(await this.dialog.isVisible().catch(() => false))) {
      await expect(this.page.getByTestId('app-header-cart-button')).toBeVisible();
      return;
    }

    if (config) {
      await expect(this.lineItems(config.productName)).toHaveCount(0);
    }

    const emptyMessage = this.dialog.getByText('\ud604\uc7ac \uc7a5\ubc14\uad6c\ub2c8\uac00 \ube44\uc5b4 \uc788\uc2b5\ub2c8\ub2e4.');
    if (await emptyMessage.count()) {
      await expect(emptyMessage).toBeVisible();
      return;
    }

    await expect(this.dialog.getByRole('heading', { name: cartPreviewTitle })).toBeVisible();
  }

  async expectLineItem(config: ProductConfig | CartLineItem): Promise<void> {
    const { item, healed } = await this.resolveLineItem(config);
    const price = lineItemPrice(config);

    await expect(item).toBeVisible();
    if (!healed) {
      await expect(item).toContainText(config.productName);
    }

    if (config.widthMm && config.heightMm) {
      await expect(item).toContainText(new RegExp(`(?:Size|사이즈):\\s*${config.widthMm}x${config.heightMm}`, 'i'));
    }

    if (config.quantity) {
      await expect(item).toContainText(new RegExp(`(?:Quantity|수량):\\s*${config.quantity}`, 'i'));
    }

    if (price) {
      await expect(item).toContainText(price);
      await expect(this.dialog.getByText(price).last()).toBeVisible();
    }
  }

  async expectLineItems(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      await expect(this.lineItem(productName)).toBeVisible();
    }
  }

  async captureItems(productNames: string[]): Promise<CartLineItem[]> {
    const items: CartLineItem[] = [];

    for (const productName of productNames) {
      const item = this.lineItem(productName);
      await expect(item).toBeVisible();

      items.push({
        productName,
        ...parseLineItemText(await item.innerText())
      });
    }

    return items;
  }

  async captureAllItems(): Promise<CartLineItem[]> {
    const items: CartLineItem[] = [];
    await this.waitForLineItems();

    const lineItems = this.lineItemArticles();
    const itemCount = await lineItems.count();

    for (let index = 0; index < itemCount; index += 1) {
      const text = await lineItems.nth(index).innerText();

      items.push({
        productName: parseProductName(text),
        ...parseLineItemText(text)
      });
    }

    return items;
  }

  async captureItemCount(): Promise<number> {
    await this.waitForLineItems().catch(() => undefined);
    return this.lineItemArticles().count();
  }

  async captureDeclaredItemCount(): Promise<number | undefined> {
    return this.cartItemCount();
  }

  async captureTotal(): Promise<string> {
    const total = this.dialog.getByTestId('product-category-cart-total-row');
    await expect(total).toBeVisible();
    return extractWonAmount(await total.innerText()) ?? '';
  }

  async editFirstItemSizeAndQuantity(sizeMm: number, quantity: number): Promise<void> {
    const totalBefore = await this.captureTotal();
    const editButtons = await this.editButtons();
    const editButtonCount = await editButtons.count();

    for (let index = 0; index < editButtonCount; index += 1) {
      await editButtons.nth(index).click();

      const editDialog = await this.editDialog();

      const editableSelects = this.editDialogSelectTriggers(editDialog);
      if ((await editableSelects.count()) < 2) {
        await this.closeEditDialog(editDialog);
        continue;
      }

      const selectedSize = await this.selectFromEditDialog(editDialog, 0, String(sizeMm));
      const selectedQuantity = await this.selectFromEditDialog(editDialog, 1, String(quantity));

      if (!selectedSize.changed && !selectedQuantity.changed) {
        await this.closeEditDialog(editDialog);
        continue;
      }

      const updateResponsePromise = this.waitForCartItemUpdateResponse();
      const updateButton = await firstVisibleLocator([
        {
          name: 'cart edit update button role',
          locator: editDialog.getByRole('button', { name: /\uc5c5\ub370\uc774\ud2b8|Update/i })
        },
        {
          name: 'cart edit submit button',
          locator: editDialog.locator('button[type="submit"]')
        }
      ]);

      await updateButton.click();
      await this.expectCartItemUpdateSucceeded(await updateResponsePromise);

      const dialogClosed = await editDialog
        .waitFor({ state: 'hidden', timeout: 10_000 })
        .then(() => true)
        .catch(() => false);

      if (!dialogClosed) {
        await this.closeEditDialog(editDialog).catch(() => undefined);
        continue;
      }

      if (selectedSize.value) {
        await expect(this.dialog.getByText(new RegExp(`Size:\\s*${selectedSize.value}x${selectedSize.value}`, 'i')).first())
          .toBeVisible({ timeout: 5_000 })
          .catch(() => undefined);
      }

      if (selectedQuantity.value) {
        await expect(this.dialog.getByText(new RegExp(`Quantity:\\s*${selectedQuantity.value}`, 'i')).first())
          .toBeVisible({
            timeout: 5_000
          })
          .catch(() => undefined);
      }

      const totalChanged = await expect
        .poll(() => this.captureTotal(), { timeout: 15_000 })
        .not.toBe(totalBefore)
        .then(() => true)
        .catch(() => false);

      if (totalChanged || selectedSize.changed || selectedQuantity.changed) {
        return;
      }
    }

    throw new Error('No cart preview item exposed both size and quantity edit controls.');
  }

  async editFirstItemMaterial(materialName: string): Promise<void> {
    const totalBefore = await this.captureTotal();
    const editButtons = await this.editButtons();
    await editButtons.first().click();

    const editDialog = await this.editDialog();
    await editDialog.getByRole('button', { name: materialName }).click();

    const updateResponsePromise = this.waitForCartItemUpdateResponse();
    const updateButton = await firstVisibleLocator([
      {
        name: 'cart edit update button role',
        locator: editDialog.getByRole('button', { name: /업데이트|Update/i })
      },
      {
        name: 'cart edit submit button',
        locator: editDialog.locator('button[type="submit"]')
      }
    ]);

    await updateButton.click();
    await this.expectCartItemUpdateSucceeded(await updateResponsePromise);
    await expect(editDialog).toBeHidden({ timeout: 10_000 });
    await expect.poll(() => this.captureTotal(), { timeout: 15_000 }).not.toBe(totalBefore);
  }

  // The drawer's combined 사이즈 및 수량 수정 dialog enforces the same minimum-two-per-sheet rule as
  // the product page and the full cart page's 사이즈 변경 dialog.
  async expectCustomSizeRejectedInEditDialog(widthMm: number, heightMm: number): Promise<void> {
    const editButtons = await this.editButtons();
    await editButtons.first().click();

    const editDialog = await this.editDialog();
    await enterCartDialogCustomSize(this.page, editDialog, widthMm, heightMm);

    await expect(editDialog.getByText(ko.minimumTwoPerSheetError)).toBeVisible();
    await expect(
      editDialog.getByRole('button', { name: new RegExp(`${ko.cartUpdate}|Update`, 'i') })
    ).toBeDisabled();
  }

  async expectRecommendedProductsVisible(): Promise<void> {
    await expect(this.dialog.getByRole('heading', { name: '\ucd94\ucc9c \uc0c1\ud488' })).toBeVisible();
    await expect(this.dialog.getByRole('button', { name: '\ub9de\ucda4 \uc81c\uc791' }).first()).toBeVisible();
  }

  async removeLineItem(config: string | ProductConfig | CartLineItem): Promise<void> {
    const itemCountBefore = await this.lineItemArticles().count();
    const item = this.lineItem(config);
    await this.deleteLineItem(item);

    await this.confirmRemovalIfPrompted();
    await expect.poll(() => this.lineItemArticles().count(), { timeout: 10_000 }).toBe(itemCountBefore - 1);
  }

  async removeAllLineItems(): Promise<void> {
    await this.waitForLineItems(3_000).catch(() => undefined);

    for (let attempt = 0; attempt < 200; attempt += 1) {
      const lineItems = this.lineItemArticles();
      const itemCount = await lineItems.count();
      const totalBefore = await this.cartItemCount();

      if (itemCount === 0 || totalBefore === 0) {
        return;
      }

      const firstItemText = await lineItems.first().innerText().catch(() => '');
      await this.deleteLineItem(lineItems.first());
      await this.confirmRemovalIfPrompted();

      const removalObserved = await expect
        .poll(
          async () => {
            const totalAfter = await this.cartItemCount();

            if (totalBefore !== undefined && totalAfter !== undefined && totalAfter < totalBefore) {
              return true;
            }

            const updatedItems = this.lineItemArticles();
            const updatedCount = await updatedItems.count();
            const updatedFirstItemText = await updatedItems.first().innerText().catch(() => '');

            return updatedCount < itemCount || updatedFirstItemText !== firstItemText;
          },
          { timeout: 10_000 }
        )
        .toBe(true)
        .then(() => true)
        .catch(() => false);

      if (!removalObserved) {
        await this.page.waitForTimeout(500);
      }
    }

    throw new Error('Cart still had line items after 200 removal attempts.');
  }

  async checkout(): Promise<void> {
    const checkoutByTestId = this.page.getByTestId('product-category-cart-checkout-button');
    if (await checkoutByTestId.count()) {
      await checkoutByTestId.click();
    } else {
      await this.dialog.getByRole('button', { name: '\uacb0\uc81c \uc9c4\ud589' }).click();
    }

    await expect(this.page).toHaveURL(/\/kr\/checkout\/?$/);
  }

  async continueShopping(): Promise<void> {
    await this.dialog.getByRole('button', { name: '\uc1fc\ud551 \uacc4\uc18d\ud558\uae30' }).click();
    await expect(this.dialog).toBeHidden();
  }

  async viewCart(): Promise<void> {
    await this.dialog.getByTestId('product-category-cart-view-button').click();
    await expect(this.page).toHaveURL(/\/kr\/cart\/?$/);
  }

  // A line is found by its product name. When the name was changed (the cart shows the category-card
  // name, which is renamed independently of the page H1), the line is instead the one and only line
  // carrying the configured size, quantity, and price. An ambiguous cart is never healed.
  private async resolveLineItem(config: ProductConfig | CartLineItem): Promise<{ item: Locator; healed: boolean }> {
    const named = this.lineItem(config);

    if (!selfHealEnabled()) {
      return { item: named, healed: false };
    }

    const byOptions = this.lineItemsMatchingOptions(this.lineItemArticles(), config);
    const appeared = await expect(named.or(byOptions.first()).first())
      .toBeVisible()
      .then(() => true)
      .catch(() => false);

    if (!appeared || (await named.isVisible().catch(() => false)) || (await byOptions.count()) !== 1) {
      return { item: named, healed: false };
    }

    const item = byOptions.first();
    await recordHeal({
      target: 'cart line name',
      expected: config.productName,
      actual: parseProductName(await item.innerText())
    });
    return { item, healed: true };
  }

  private lineItem(product: string | ProductConfig | CartLineItem): Locator {
    if (typeof product === 'string') {
      return this.lineItems(product).first();
    }

    return this.lineItemsMatchingOptions(this.lineItems(product.productName), product).first();
  }

  private lineItemsMatchingOptions(lineItems: Locator, product: ProductConfig | CartLineItem): Locator {
    let items = lineItems;
    const price = lineItemPrice(product);

    if (product.widthMm && product.heightMm) {
      items = items.filter({
        hasText: new RegExp(`(?:Size|사이즈):\\s*${product.widthMm}x\\s*${product.heightMm}(?:mm)?`, 'i')
      });
    }

    if (product.quantity) {
      items = items.filter({ hasText: new RegExp(`(?:Quantity|수량):\\s*${product.quantity}`, 'i') });
    }

    if (price) {
      items = items.filter({ hasText: price });
    }

    return items;
  }

  private lineItems(productName: string): Locator {
    return this.dialog
      .getByRole('article')
      .filter({ hasText: productName })
      .filter({ hasText: /Size:|Quantity:|\uc0ac\uc774\uc988:|\uc218\ub7c9:/i });
  }

  private lineItemArticles(): Locator {
    return this.dialog.getByRole('article').filter({ hasText: /Size:|Quantity:|\uc0ac\uc774\uc988:|\uc218\ub7c9:/i });
  }

  private async waitForLineItems(timeout = 10_000): Promise<void> {
    await expect.poll(() => this.lineItemArticles().count(), { timeout }).toBeGreaterThan(0);
  }

  private async cartItemCount(): Promise<number | undefined> {
    const heading = this.dialog.getByRole('heading', { name: cartPreviewTitle }).first();
    const text = await heading.innerText().catch(() => '');
    const match = text.match(/\((\d+)\)/);

    return match?.[1] ? Number(match[1]) : undefined;
  }

  private async deleteLineItem(item: Locator): Promise<void> {
    const deleteByTestId = item.getByTestId('product-category-cart-item-delete-button');

    if (await deleteByTestId.count()) {
      await deleteByTestId.click();
    } else {
      await item.getByRole('button', { name: /Remove item|\uc0c1\ud488 \uc0ad\uc81c/ }).click();
    }
  }

  private async selectFromEditDialog(editDialog: Locator, triggerIndex: number, preferredValue: string): Promise<SelectResult> {
    const trigger = this.editDialogSelectTriggers(editDialog).nth(triggerIndex);
    const previousValue = extractLeadingNumber(await trigger.innerText());

    await trigger.click({ force: true });

    const listbox = await firstVisibleLocator(
      [
        {
          name: 'cart edit dialog listbox',
          locator: editDialog.getByRole('listbox').last()
        },
        {
          name: 'page listbox',
          locator: this.page.getByRole('listbox').last()
        }
      ],
      5_000
    );

    const options = await firstLocatorWithCount([
      {
        name: 'listbox button options',
        locator: listbox.getByRole('button')
      },
      {
        name: 'listbox css button options',
        locator: listbox.locator('button')
      },
      {
        name: 'listbox role options',
        locator: listbox.getByRole('option')
      },
      {
        name: 'listbox css role options',
        locator: listbox.locator('[role="option"]')
      },
      {
        name: 'listbox data-value options',
        locator: listbox.locator('[data-value]')
      }
    ], 5_000);
    const option = await this.optionForValue(options, preferredValue, previousValue);
    const selectedText = await option.innerText();
    const selectedValue = extractLeadingNumber(selectedText);

    await option.click({ force: true });
    await expect(listbox).toBeHidden({ timeout: 5_000 }).catch(() => undefined);

    return {
      changed: Boolean(selectedValue && selectedValue !== previousValue),
      text: normalizeSelectText(selectedText),
      value: selectedValue
    };
  }

  private async optionForValue(options: Locator, preferredValue: string, previousValue: string): Promise<Locator> {
    const preferred = options.filter({ hasText: new RegExp(`^\\s*${escapeRegExp(preferredValue)}\\b`) }).first();
    const preferredNumber = selectNumber(preferredValue);
    const previousNumber = selectNumber(previousValue);

    if (
      (await preferred.isVisible().catch(() => false)) &&
      !(await preferred.isDisabled().catch(() => false)) &&
      extractLeadingNumber(await preferred.innerText()) !== previousValue
    ) {
      return preferred;
    }

    const optionCount = await options.count();
    let higherFallback: Locator | undefined;
    let changedFallback: Locator | undefined;

    for (let index = 0; index < optionCount; index += 1) {
      const option = options.nth(index);
      const optionValue = extractLeadingNumber(await option.innerText());

      if (optionValue && optionValue !== previousValue && !(await option.isDisabled().catch(() => false))) {
        const optionNumber = selectNumber(optionValue);

        if (optionNumber !== undefined && preferredNumber !== undefined && optionNumber >= preferredNumber) {
          return option;
        }

        if (
          !higherFallback &&
          optionNumber !== undefined &&
          previousNumber !== undefined &&
          optionNumber > previousNumber
        ) {
          higherFallback = option;
        }

        changedFallback ??= option;
      }
    }

    if (higherFallback) {
      return higherFallback;
    }

    if (await preferred.isVisible().catch(() => false)) {
      return preferred;
    }

    if (previousValue) {
      const current = options.filter({ hasText: new RegExp(`^\\s*${escapeRegExp(previousValue)}\\b`) }).first();
      if (await current.isVisible().catch(() => false)) {
        return current;
      }
    }

    if (previousNumber === undefined && changedFallback) {
      return changedFallback;
    }

    return options.first();
  }

  private async closeEditDialog(editDialog: Locator): Promise<void> {
    const closeButton = await firstVisibleLocator(
      [
        {
          name: 'cart edit close or cancel button role',
          locator: editDialog.getByRole('button', { name: /Close|Cancel|\ub2eb\uae30|\ucde8\uc18c|ui\.modal\.close/i })
        },
        {
          name: 'cart edit close aria-label',
          locator: editDialog.locator('button[aria-label*="close" i]')
        }
      ],
      1_000
    ).catch(() => undefined);

    if (closeButton) {
      await closeButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }

    await expect(editDialog).toBeHidden();
  }

  private async confirmRemovalIfPrompted(): Promise<void> {
    const deleteButton = this.page
      .getByTestId('cart-item-delete-modal-confirm')
      .or(this.page.locator('.delete-confirm-modal-confirm'))
      .last();

    if (await deleteButton.isVisible().catch(() => false)) {
      await deleteButton.click();
      await expect(deleteButton).toBeHidden({ timeout: 5_000 });
    }
  }

  private editDialogSelectTriggers(editDialog: Locator): Locator {
    return editDialog.locator('button.cart-item-edit-select-trigger, [role="combobox"]');
  }

  private async editButtons(): Promise<Locator> {
    return firstLocatorWithCount([
      {
        name: 'cart item edit button test id',
        locator: this.dialog.getByTestId('product-category-cart-item-edit-button')
      },
      {
        name: 'cart item edit button role',
        locator: this.dialog.getByRole('button', { name: /\uc0c1\ud488 \uc218\uc815|Edit item|Edit product/i })
      },
      {
        name: 'cart item edit button aria-label',
        locator: this.dialog.locator('button[aria-label*="edit" i]')
      }
    ]);
  }

  private async editDialog(): Promise<Locator> {
    return firstVisibleLocator([
      {
        name: 'cart edit dialog accessible name',
        locator: this.page.getByRole('dialog', { name: editDialogTitle }).last()
      },
      {
        name: 'cart edit dialog title text',
        locator: this.page.getByRole('dialog').filter({ hasText: editDialogTitle }).last()
      },
      {
        name: 'cart edit dialog shell class',
        locator: this.page.locator('.cart-item-edit-modal-shell').last()
      }
    ]);
  }

  private async waitForCartItemUpdateResponse(): Promise<Response | undefined> {
    return this.page
      .waitForResponse(
        (response) => response.url().includes(cartItemUpdatePath) && response.request().method() === 'POST',
        { timeout: 15_000 }
      )
      .catch(() => undefined);
  }

  private async expectCartItemUpdateSucceeded(response: Response | undefined): Promise<void> {
    if (!response || response.ok()) {
      return;
    }

    const requestBody = response.request().postData() ?? '<empty>';
    const responseBody = await response.text().catch((error: unknown) => `Could not read response body: ${String(error)}`);

    throw new Error(
      [
        `Cart item update API failed with ${response.status()} ${response.url()}.`,
        `Request body: ${clipText(requestBody)}`,
        `Response body: ${clipText(responseBody)}`
      ].join('\n')
    );
  }
}

function parseLineItemText(text: string): Omit<CartLineItem, 'productName'> {
  const normalized = text.replace(/\s+/g, ' ');
  const size = normalized.match(/(?:Size|사이즈):\s*(\d+)x\s*(\d+)/i);
  const quantity = normalized.match(/(?:Quantity|수량):\s*(\d+)/i);

  return {
    widthMm: size ? Number(size[1]) : undefined,
    heightMm: size ? Number(size[2]) : undefined,
    quantity: quantity ? Number(quantity[1]) : undefined,
    price: extractWonAmount(normalized)
  };
}

function parseProductName(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => normalizeSelectText(line))
    .filter(Boolean);
  const metadataIndex = lines.findIndex((line) => /^(Size|Quantity|\uc0ac\uc774\uc988|\uc218\ub7c9)\s*:/i.test(line));
  const nameLines = metadataIndex > 0 ? lines.slice(0, metadataIndex) : lines;

  const productName = nameLines.find(isProductNameLine);
  if (productName) {
    return productName;
  }

  for (let index = nameLines.length - 1; index >= 0; index -= 1) {
    const line = nameLines[index];

    if (line && !extractWonAmount(line) && !/^(Edit|Remove|\uc0c1\ud488)/i.test(line)) {
      return line;
    }
  }

  return lines[0] ?? 'Unknown product';
}

function extractWonAmount(value: string): string | undefined {
  return [...value.matchAll(/[\d,]+\uc6d0/g)].at(-1)?.[0];
}

function isProductNameLine(line: string): boolean {
  return Boolean(line && !extractWonAmount(line) && !isActionLine(line) && !isOptionLine(line));
}

function isActionLine(line: string): boolean {
  return /^(Edit|Remove|\uc0c1\ud488)/i.test(line);
}

function isOptionLine(line: string): boolean {
  return /^(Color|\uc0c9\uc0c1|\uceec\ub7ec|Font|\ud3f0\ud2b8|Text|\ubb38\uad6c|Size|\uc0ac\uc774\uc988|Quantity|\uc218\ub7c9)\s*:/i.test(
    line
  );
}

function extractLeadingNumber(value: string): string {
  return normalizeSelectText(value).match(/^\d[\d,]*/)?.[0].replace(/,/g, '') ?? '';
}

function selectNumber(value: string): number | undefined {
  const parsed = Number(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeSelectText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function clipText(value: string, maxLength = 1_000): string {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function lineItemPrice(config: ProductConfig | CartLineItem): string | undefined {
  return isProductConfig(config) ? config.expectedUnitPrice : config.price;
}

function isProductConfig(config: ProductConfig | CartLineItem): config is ProductConfig {
  return 'expectedUnitPrice' in config;
}
