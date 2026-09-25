import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../fixtures/env.js';
import { parseWon } from '../fixtures/money.js';
import { gotoStorefront } from '../fixtures/navigation.js';
import { expectHeadingOrHeal } from '../fixtures/self-heal.js';
import { ko } from '../fixtures/storefront-data.js';

const wonAmountPattern = /[\d,]+\uc6d0/u;

export class ProductV2Page {
  readonly page: Page;
  readonly optionsPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.optionsPanel = page
      .getByTestId('product-category-options')
      .or(page.getByRole('complementary').filter({ hasText: /\uc0ac\uc774\uc988|\uc218\ub7c9|Size|Quantity/i }))
      .first();
  }

  /** Returns the heading the page actually shows, which differs from `heading` only after a heal. */
  async goto(path: string, heading: string): Promise<string> {
    await gotoStorefront(this.page, appPath(path));
    const shownHeading = await expectHeadingOrHeal(this.page, heading, `product heading ${path}`);
    // Also what keeps a healed heading honest: whatever the H1 says, this must be a product page.
    await expect(this.optionsPanel).toBeVisible();
    return shownHeading;
  }

  async expectCatalogEntryRenders(path: string): Promise<void> {
    await gotoStorefront(this.page, appPath(path));
    await expect(this.page).toHaveURL(new RegExp(`${escapeRegExp(path.replace(/^\.\//, ''))}/?$`));
    await expect(this.page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(this.optionsPanel).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.nextStepButton().click();

    const dialog = this.page.getByRole('dialog').first();
    await expect(dialog).toBeVisible();

    const addToCartButton = dialog.getByRole('button', { name: ko.addToCart });
    if (await addToCartButton.isVisible().catch(() => false)) {
      await addToCartButton.click();
      return;
    }

    const sendFileLaterButton = dialog.getByRole('button', { name: ko.sendFileLater });
    await expect(sendFileLaterButton).toBeVisible();
    await sendFileLaterButton.click();
  }

  async selectSize(sizeName: string): Promise<void> {
    await this.optionsPanel.getByRole('button', { name: new RegExp(escapeRegExp(sizeName)) }).first().click();
  }

  async selectMaterial(materialName: string): Promise<void> {
    await this.optionsPanel.getByRole('button', { name: materialName }).click();
  }

  // vinyl-lettering and transfer-sticker expose color choices as `.color-swatch` buttons whose
  // accessible name (aria-label) is the English color name (e.g. "Black"); the Korean label used
  // elsewhere in this suite only exists in a child `.color-swatch-tooltip` span, so this can't use
  // the getByRole name-matching that selectMaterial relies on.
  async selectSwatchColor(koreanColorLabel: string): Promise<void> {
    await this.optionsPanel.locator('.color-swatch').filter({ hasText: koreanColorLabel }).first().click();
  }

  async selectSheetSize(sizeName: string): Promise<void> {
    await this.optionsPanel.getByRole('button', { name: new RegExp(`^${escapeRegExp(sizeName)}`) }).first().click();
  }

  async selectQuantity(quantity: number): Promise<void> {
    const quantityLabel = new RegExp(`^${quantity.toLocaleString('en-US')}\\s*(?:\\S+)?\\s*${wonAmountPattern.source}`, 'u');
    await this.optionsPanel.getByRole('button', { name: quantityLabel }).first().click();
  }

  // The two custom-size fields, addressed by class and reading order rather than by placeholder.
  //
  // Production and development-1 label them differently: development-1 puts the axis in the
  // placeholder (가로 / 세로) with no visible caption, while production moved the axis out to a
  // visible 너비 / 높이 caption beside the field and gives *both* inputs the same "예: 30"
  // placeholder. So getByPlaceholder('가로') matches nothing on production, and matching the
  // production placeholder would be ambiguous. `.custom-size-input` carries across both, and both
  // render width before height, so order is what actually distinguishes them. The placeholder
  // union is kept first so the locator still reads as width/height on development-1.
  private customSizeInput(axis: 'width' | 'height'): Locator {
    const inputs = this.optionsPanel.locator('.custom-size-input');

    return axis === 'width'
      ? this.optionsPanel.getByPlaceholder('가로').or(inputs.first()).first()
      : this.optionsPanel.getByPlaceholder('세로').or(inputs.nth(1)).first();
  }

  async selectCustomIndividualSize(widthMm: number, heightMm: number): Promise<void> {
    const widthInput = this.customSizeInput('width');
    const heightInput = this.customSizeInput('height');

    // Clicking the custom-size pill before Vue has hydrated silently does nothing (and a blind
    // retry can toggle a row that mounted late straight back off). A priced quantity tier is the
    // signal that the page's own bootstrap pricing round-trip has rendered -- it lands seconds
    // after the options panel first becomes visible -- so gate on that, then re-check visibility
    // before every click rather than clicking blind.
    await this.optionsPanel
      .locator('.qty-pill-price')
      .filter({ hasNotText: /^0원$/ })
      .first()
      .waitFor({ state: 'visible', timeout: 20_000 })
      .catch(() => undefined);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      if (await widthInput.isVisible().catch(() => false)) {
        break;
      }

      // The pill replaces itself with the size row, so once it is gone the row is already on its
      // way in and there is nothing left to click. Re-clicking here is what turned a missed input
      // into a hang: `click()` inherits the *test* timeout, so waiting for a control that will
      // never come back burned the whole remaining budget instead of failing this step.
      const pill = this.optionsPanel.getByRole('button', { name: ko.customSize }).first();

      if (await pill.isVisible().catch(() => false)) {
        await pill.click({ timeout: 5_000 }).catch(() => undefined);
      }

      await widthInput.waitFor({ state: 'visible', timeout: 4_000 }).catch(() => undefined);
    }

    await expect(widthInput, 'custom individual size inputs never mounted').toBeVisible();

    await widthInput.fill(String(widthMm));
    await heightInput.fill(String(heightMm));
    await heightInput.blur();
  }

  // vinyl-lettering's design surface is a contenteditable canvas, not an input/textarea, and
  // pricing stays at 0원 with the next-step button disabled until text is entered.
  async fillVinylLetteringText(text: string): Promise<void> {
    const canvas = this.page.getByTestId('product-category-vinyl-designer-textarea');
    await canvas.click();
    await this.page.keyboard.type(text);
  }

  /**
   * The price the chosen quantity tier advertises, as a number.
   *
   * This is the figure the shopper is quoted and the one that must survive into the cart and the
   * checkout summary unchanged -- it is already the discounted price, not the struck-through one
   * (verified on development-1: the 30개 tier reads 18,700원 against a 19,800원 list price, and
   * 18,700원 is what the cart line and the checkout 소계 then show).
   *
   * Waits out the bootstrap pricing round-trip, during which every tier reads 0원.
   */
  async captureQuantityTierPrice(quantity: number): Promise<number> {
    const price = this.quantityTier(quantity).locator('.qty-pill-price');

    await expect(price).toBeVisible({ timeout: 20_000 });
    await expect(price, 'quantity tier is still unpriced -- the pricing call has not landed').not.toHaveText('0원', {
      timeout: 20_000
    });

    return parseWon(await price.innerText());
  }

  private quantityTier(quantity: number): Locator {
    const quantityLabel = new RegExp(
      `^${quantity.toLocaleString('en-US')}\\s*(?:\\S+)?\\s*${wonAmountPattern.source}`,
      'u'
    );

    return this.optionsPanel.getByRole('button', { name: quantityLabel }).first();
  }

  async expectVisiblePrice(): Promise<void> {
    await expect(this.optionsPanel.getByText(wonAmountPattern).last()).toBeVisible();
  }

  async expectBulkDiscountVisible(): Promise<void> {
    await expect(this.optionsPanel.getByText(/^-\d+%$/).first()).toBeVisible();
  }

  async expectNoBulkDiscountVisible(): Promise<void> {
    await expect(this.optionsPanel.getByText(/^-\d+%$/)).toHaveCount(0);
  }

  async expectSizeGuideImagesLocalized(): Promise<void> {
    const images = this.page.locator('.mini-feature-image');
    const count = await images.count();
    expect(count, 'Expected size-guide illustration images to be present').toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const alt = (await images.nth(index).getAttribute('alt')) ?? '';
      expect(alt, `Size guide image ${index} alt text is a raw, untranslated i18n key: "${alt}"`).not.toMatch(
        /^product\.sizes\./
      );
      expect(
        alt,
        `Size guide image ${index} alt text looks like an unrelated sheet/paper size label: "${alt}"`
      ).not.toMatch(/^A\d+\s|^\d+\s*x\s*\d+$/i);
    }
  }

  async expectDesignUploadModal(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    await expect(dialog.getByTestId('product-category-upload-dropzone')).toContainText(
      '.eps, .ai, .psd, .pdf, .tif, .png'
    );
    await expect(dialog.getByTestId('product-category-upload-select-files-button')).toBeVisible();
  }

  async fillDesignOrderNote(note: string): Promise<void> {
    await this.page.getByTestId('product-category-upload-special-instructions').locator('textarea').fill(note);
  }

  async uploadDesignFile(filePath: string): Promise<void> {
    await this.page.getByRole('dialog').locator('input[type="file"]').setInputFiles(filePath);
  }

  async expectDesignFileAccepted(fileName: string): Promise<void> {
    await expect(this.page.getByRole('dialog').getByTestId('product-category-upload-dropzone')).toContainText(
      fileName
    );
  }

  // --- individual-sticker sheet size rules (see sheet-sticker-size-rules.spec.ts) ---

  // `1시트 = 스티커 N개`. Polled rather than read once: both count readouts repaint asynchronously
  // when the pricing round-trip lands, so an immediate read catches the previous size's numbers or
  // an empty node mid-render. Asserts the rendered readout rather than recomputing the packing --
  // the point is that what the shopper is shown matches what the pricing engine actually packs.
  async expectStickersPerSheet(expected: number): Promise<void> {
    await expect
      .poll(() => this.readCount(/1시트 = 스티커 ([\d,]+)개/), {
        timeout: 15_000,
        message: `Expected the sheet to report ${expected} stickers per sheet`
      })
      .toBe(expected);
  }

  // `총 스티커 수량 : N개`
  async expectTotalStickers(expected: number): Promise<void> {
    await expect
      .poll(() => this.readCount(/총 스티커 수량\s*:\s*([\d,]+)개/), {
        timeout: 15_000,
        message: `Expected a total of ${expected} stickers`
      })
      .toBe(expected);
  }

  async expectSizePresets(presets: ReadonlyArray<{ label: string; dimensions: string }>): Promise<void> {
    const grid = this.sizeGrid();
    await expect(grid).toBeVisible();

    for (const [index, preset] of presets.entries()) {
      const pill = grid.locator('.option-pill').nth(index);
      await expect(pill.locator('.size-pill-name'), `size preset ${index} label`).toHaveText(preset.label);
      await expect(pill.locator('.size-pill-dim'), `size preset ${index} dimensions`).toHaveText(preset.dimensions);
    }

    // The custom-size pill trails the presets, so the count is presets + 1.
    await expect(grid.locator('.option-pill')).toHaveCount(presets.length + 1);
  }

  async selectSizePreset(label: string): Promise<void> {
    await this.sizeGrid().locator('.option-pill').filter({ hasText: label }).first().click();
  }

  async expectMinimumTwoPerSheetError(): Promise<void> {
    await expect(this.optionsPanel.getByText(ko.minimumTwoPerSheetError)).toBeVisible();
  }

  async expectNoMinimumTwoPerSheetError(): Promise<void> {
    await expect(this.optionsPanel.getByText(ko.minimumTwoPerSheetError)).toHaveCount(0);
  }

  // A rejected size shows only the minimum-two-per-sheet message -- an oversized entry does not get
  // a separate "가로 138mm × 세로 200mm 이내로 작업해 주세요." line. Confirmed intended on
  // development-1 (2026-08-26), so this asserts the absence rather than treating it as a gap.
  async expectNoMaxWorkAreaMessage(): Promise<void> {
    await expect(this.optionsPanel.getByText(/가로 \d+mm × 세로 \d+mm 이내로 작업해 주세요\./)).toHaveCount(0);
  }

  // Every sheet-quantity tier zeroes out while the chosen size is rejected, not just the selected
  // one, so a shopper cannot switch tiers to find a priced combination.
  async expectAllQuantityTiersZeroPriced(): Promise<void> {
    const prices = this.quantityGrid().locator('.qty-pill-price');
    const count = await prices.count();
    expect(count, 'Expected sheet-quantity tiers to be present').toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      await expect(prices.nth(index), `quantity tier ${index} price`).toHaveText('0원');
    }
  }

  async expectNextStepDisabled(): Promise<void> {
    await expect(this.nextStepButton()).toBeDisabled();
  }

  async openSizeGuide(): Promise<Locator> {
    await this.optionsPanel.getByText(ko.sizeGuideOpen).first().click();
    const dialog = this.page.getByRole('dialog').first();
    await expect(dialog).toBeVisible();

    return dialog;
  }

  // The size-guide modal's inputs are `#sheet-width`/`#sheet-height` and carry no `type` attribute,
  // so an `input[type=...]` selector finds nothing here.
  async enterSizeGuideCustomSize(dialog: Locator, widthMm: number, heightMm: number): Promise<void> {
    await dialog.getByText(ko.sizeGuideCustomSize).first().click({ force: true });

    const width = dialog.locator('#sheet-width');
    await expect(width).toBeVisible();
    await width.fill(String(widthMm));

    const height = dialog.locator('#sheet-height');
    await height.fill(String(heightMm));
    await height.blur();
  }

  async expectNextStepEnabled(): Promise<void> {
    await expect(this.nextStepButton()).toBeEnabled();
  }

  async clickNextStepAndExpectProgression(): Promise<void> {
    await this.nextStepButton().click();
    await expect(
      this.page
        .getByRole('dialog')
        .or(this.page.getByText(/\uc5c5\ub85c\ub4dc|\ub514\uc790\uc778|\uc7a5\ubc14\uad6c\ub2c8|Upload|Cart/i))
        .first()
    ).toBeVisible();
  }

  async expectProductionPromises(): Promise<void> {
    await expect(this.page.locator('body')).toContainText('5\ub9cc\uc6d0 \uc774\uc0c1 \ubb34\ub8cc\ubc30\uc1a1');
    await expect(this.page.locator('body')).toContainText('12\uc2dc \uc774\uc804 \uc2dc\uc548 \ud655\uc815 \uc2dc \ub2f9\uc77c\ubc30\uc1a1');
    await expect(this.page.locator('body')).toContainText(/\ub3c4\ucc29 \uc608\uc815\uc77c|CJ \ub300\ud55c\ud1b5\uc6b4/);
    await expect(this.page.locator('body')).toContainText('\uc624\ub298\uc81c\uc791, \ub0b4\uc77c\ubc1c\uc1a1');
    await expect(this.page.locator('body')).toContainText('\ube60\ub978 \uc2dc\uc548 \ud53c\ub4dc\ubc31');
    await expect(this.page.locator('body')).toContainText('\ub6f0\uc5b4\ub09c \ub0b4\uad6c\uc131\uacfc \ub0b4\uc218\uc131');
  }

  async expectReviewCarouselUsable(): Promise<void> {
    const body = this.page.locator('body');
    await expect(body).toContainText(ko.reviews225);

    const nextButton = this.page.getByRole('button', { name: /\ub2e4\uc74c \ub9ac\ubdf0/ }).first();
    const previousButton = this.page.getByRole('button', { name: /\uc774\uc804 \ub9ac\ubdf0/ }).first();

    await expect(nextButton).toBeVisible();
    await nextButton.click();
    await expect(previousButton).toBeVisible();
    await previousButton.click();
    await expect(body).toContainText(ko.reviews225);
  }

  async expectCustomControlsOpen(): Promise<void> {
    // The option panel is server-rendered, so it is visible well before the storefront has finished
    // with it: after hydration the app applies a default size and then a default quantity, each of
    // which re-renders the grids. A click that lands in that window is either swallowed or has the
    // input it just opened torn down by the re-render, so wait for the defaults to settle -- the
    // next-step button enables only once both have been applied -- before reaching for the controls.
    await expect(this.nextStepButton()).toBeEnabled();

    const customSizeButton = this.optionsPanel.getByRole('button', { name: ko.customSize }).first();
    await expect(customSizeButton).toBeVisible();
    await customSizeButton.click();
    await expect(this.page.getByRole('dialog').or(this.optionsPanel.getByRole('spinbutton')).first()).toBeVisible();
    await this.closeTransientDialog();

    const customQuantityButton = this.optionsPanel.getByRole('button', { name: ko.customQuantity }).first();
    await expect(customQuantityButton).toBeVisible();
    await customQuantityButton.click();
    await expect(this.page.getByRole('dialog').or(this.optionsPanel.getByRole('spinbutton')).first()).toBeVisible();
    await this.closeTransientDialog();
  }

  async expectSheetTemplateControls(): Promise<void> {
    await expect(this.page.locator('body')).toContainText(/\uc2dc\ud2b8 \uc2a4\ud2f0\ucee4 \ud15c\ud50c\ub9bf \ub2e4\uc6b4\ub85c\ub4dc/);
    await expect(this.page.locator('body')).toContainText(/\ubc30\uce58 \uac00\uc774\ub4dc \ubcf4\uae30/);
  }

  private sizeGrid(): Locator {
    return this.optionsPanel.locator('.option-grid.option-grid-size').first();
  }

  // The size grid and the quantity grid are both `.option-grid`; only the size grid carries the
  // `option-grid-size` modifier, so the quantity grid is the one without it.
  private quantityGrid(): Locator {
    return this.optionsPanel.locator('.option-grid:not(.option-grid-size)').last();
  }

  private async readCount(pattern: RegExp): Promise<number | undefined> {
    const match = (await this.optionsPanel.innerText()).match(pattern);

    return match?.[1] ? Number(match[1].replace(/,/g, '')) : undefined;
  }

  private nextStepButton(): Locator {
    return this.optionsPanel.getByRole('button', { name: ko.nextStep });
  }

  private async closeTransientDialog(): Promise<void> {
    const cancelButton = this.page.getByRole('button', { name: ko.cancel }).last();
    if (await cancelButton.isVisible().catch(() => false)) {
      await cancelButton.click();
      return;
    }

    await this.page.keyboard.press('Escape').catch(() => undefined);
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

