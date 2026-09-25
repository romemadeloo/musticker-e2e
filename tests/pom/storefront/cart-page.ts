import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../fixtures/env.js';
import { parseLastWon, parseWon } from '../fixtures/money.js';
import { gotoStorefront } from '../fixtures/navigation.js';
import { cartCopy, ko } from '../fixtures/storefront-data.js';
import { enterCartDialogCustomSize } from './cart-size-dialog.js';

const sizeChangeDialogTitle = /사이즈 변경/;

export class CartV2Page {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await gotoStorefront(this.page, appPath('./cart'));
    await expect(this.page.getByRole('heading', { name: cartCopy.pageHeading })).toBeVisible();
  }

  row(productName: string): Locator {
    return this.page.getByTestId('cart-page-row').filter({ hasText: productName }).first();
  }

  rows(): Locator {
    return this.page.getByTestId('cart-page-row');
  }

  async rowCount(): Promise<number> {
    return this.rows().count();
  }

  async expectRowCount(expected: number): Promise<void> {
    await expect(this.rows()).toHaveCount(expected, { timeout: 15_000 });
  }

  /** Line prices in render order, as numbers. */
  async captureRowPrices(): Promise<number[]> {
    const rows = this.rows();
    const rowCount = await rows.count();
    const prices: number[] = [];

    for (let index = 0; index < rowCount; index += 1) {
      // A row reads `<name> | <size> | 이미지 추가 | 사이즈 변경 | <qty>개 | <price>원 | 상품 삭제`, so
      // the line price is the last won amount in it.
      prices.push(parseLastWon(await rows.nth(index).innerText()));
    }

    return prices;
  }

  async captureTotalWon(): Promise<number> {
    return parseWon(await this.captureTotal());
  }

  /**
   * The cart total has to be the sum of its lines. Shipping and discounts are explicitly deferred to
   * checkout here ("배송비 및 할인은 결제 시 적용됩니다."), so on this page the identity is exact.
   */
  async expectTotalIsSumOfRows(): Promise<number> {
    const prices = await this.captureRowPrices();
    const expectedTotal = prices.reduce((sum, price) => sum + price, 0);

    await expect
      .poll(() => this.captureTotalWon(), {
        timeout: 15_000,
        message: `Cart total must equal the sum of its ${prices.length} line(s): ${prices.join(' + ')}`
      })
      .toBe(expectedTotal);

    return expectedTotal;
  }

  /** The 주문하기 (N) button carries the line count, so it is a second, independent read of it. */
  async expectDeclaredItemCount(expected: number): Promise<void> {
    await expect(this.page.getByTestId('cart-page-summary')).toContainText(
      new RegExp(`${escapeRegExp(cartCopy.checkoutFromCart)}\\s*\\(${expected}\\)`)
    );
  }

  async expectEmpty(): Promise<void> {
    await expect(this.page.getByTestId('cart-page-empty-state')).toBeVisible({ timeout: 15_000 });
    await expect(this.rows()).toHaveCount(0);
    await expect(this.page.getByTestId('cart-page-summary')).toHaveCount(0);
  }

  /**
   * Removes a row through the confirm modal the page insists on, and waits for the row to actually
   * go. Removal is asynchronous -- the summary re-renders after the cart round-trip lands.
   */
  async removeRow(productName: string): Promise<void> {
    const countBefore = await this.rowCount();
    await this.row(productName).locator('.cart-delete-btn').click();

    const confirm = this.page.getByTestId('cart-item-delete-modal-confirm');
    await expect(confirm).toBeVisible();
    await confirm.click();

    await expect(this.rows()).toHaveCount(countBefore - 1, { timeout: 20_000 });
  }

  /** Cancelling the confirm modal must leave the row exactly where it was. */
  async cancelRemoveRow(productName: string): Promise<void> {
    const countBefore = await this.rowCount();
    await this.row(productName).locator('.cart-delete-btn').click();

    const modal = this.page.getByTestId('cart-item-delete-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(cartCopy.removeConfirmHeading);
    await this.page.getByTestId('cart-item-delete-modal-cancel').click();

    await expect(modal).toBeHidden();
    await expect(this.rows()).toHaveCount(countBefore);
    await expect(this.row(productName)).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.page
      .getByTestId('cart-page-summary')
      .getByRole('button', { name: new RegExp(escapeRegExp(cartCopy.checkoutFromCart)) })
      .click();
    await expect(this.page).toHaveURL(/\/kr\/checkout\/?$/);
  }

  async expectRowContainsText(productName: string, ...patterns: Array<string | RegExp>): Promise<void> {
    const row = this.row(productName);
    await expect(row).toBeVisible();

    for (const pattern of patterns) {
      await expect(row).toContainText(pattern);
    }
  }

  async expectImageLinkVisible(productName: string): Promise<void> {
    await expect(this.row(productName).getByText(/이미지 추가|이미지 변경/)).toBeVisible();
  }

  async expectAddImageLinkVisible(productName: string): Promise<void> {
    await expect(this.row(productName).getByText('이미지 추가')).toBeVisible();
  }

  async expectChangeImageLinkVisible(productName: string): Promise<void> {
    await expect(this.row(productName).getByText('이미지 변경')).toBeVisible();
  }

  async changeMaterialViaSizeChangeDialog(productName: string, materialName: string): Promise<void> {
    const totalBefore = await this.captureTotal();
    await this.row(productName).getByText('사이즈 변경').click();

    const dialog = this.page.getByRole('dialog').filter({ hasText: sizeChangeDialogTitle }).last();
    await expect(dialog).toBeVisible();
    // The full cart page's edit dialog intentionally exposes material + individual size only;
    // quantity lives in the row-level select (see changeQuantityViaRowSelect), unlike the cart
    // preview drawer's combined "사이즈 및 수량 수정" dialog.
    await expect(dialog.getByText('수량', { exact: true })).toHaveCount(0);

    await dialog.getByRole('button', { name: materialName }).click();
    await dialog.getByRole('button', { name: /업데이트|Update/i }).click();
    await expect(dialog).toBeHidden({ timeout: 10_000 });
    await expect.poll(() => this.captureTotal(), { timeout: 15_000 }).not.toBe(totalBefore);
  }

  async changeQuantityViaRowSelect(productName: string, quantityLabel: string): Promise<void> {
    const totalBefore = await this.captureTotal();
    await this.row(productName).locator('button.cart-qty-select-trigger').click();

    const listbox = this.page.getByRole('listbox').last();
    await expect(listbox).toBeVisible();
    await listbox.getByText(new RegExp(`^${escapeRegExp(quantityLabel)}`)).first().click();

    await expect.poll(() => this.captureTotal(), { timeout: 15_000 }).not.toBe(totalBefore);
  }

  // The full cart page's 사이즈 변경 dialog enforces the same minimum-two-per-sheet rule as the
  // product page, but through a ui-select listbox (`맞춤 사이즈`) rather than a visible pill, and it
  // gates 업데이트 instead of 다음 단계.
  async expectCustomSizeRejectedInSizeChangeDialog(
    productName: string,
    widthMm: number,
    heightMm: number
  ): Promise<void> {
    await this.row(productName).getByText(ko.sizeChangeAction).click();

    const dialog = this.page.getByRole('dialog').filter({ hasText: sizeChangeDialogTitle }).last();
    await expect(dialog).toBeVisible();
    await enterCartDialogCustomSize(this.page, dialog, widthMm, heightMm);

    await expect(dialog.getByText(ko.minimumTwoPerSheetError)).toBeVisible();
    await expect(dialog.getByRole('button', { name: new RegExp(`${ko.cartUpdate}|Update`, 'i') })).toBeDisabled();
  }

  async captureTotal(): Promise<string> {
    const summary = this.page.getByTestId('cart-page-summary');
    await expect(summary).toBeVisible();
    return extractWonAmount(await summary.innerText()) ?? '';
  }
}

function extractWonAmount(value: string): string | undefined {
  return [...value.matchAll(/[\d,]+원/g)].at(-1)?.[0];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
