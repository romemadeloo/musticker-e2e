import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class SearchDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly input: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: '상품 검색' });
    this.input = page.getByTestId('app-header-search-input');
  }

  async expectVisible(): Promise<void> {
    await expect(this.dialog).toBeVisible();
    await expect(this.input).toBeFocused();
  }

  async isVisible(options?: { timeout?: number }): Promise<boolean> {
    await this.dialog.waitFor({ state: 'visible', timeout: options?.timeout ?? 10_000 }).catch(() => undefined);
    return this.dialog.isVisible().catch(() => false);
  }

  async expectEmptyRecentState(): Promise<void> {
    await expect(this.dialog.getByText('최근 검색 내역이 없습니다')).toBeVisible();
  }

  async searchFor(query: string): Promise<void> {
    await this.input.fill(query);
    await this.input.press('Enter');
  }

  async expectDieCutStickerResults(): Promise<void> {
    await expect(this.dieCutStickerResult()).toBeVisible();
  }

  async expectNoResults(): Promise<void> {
    await expect(this.page.getByTestId('app-header-search-empty-result')).toBeVisible();
    await expect(this.dialog.getByText(/\uac80\uc0c9 \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4|No results/i)).toBeVisible();
    await expect(this.searchResults()).toHaveCount(0);
  }

  async chooseDieCutSticker(): Promise<void> {
    await this.dieCutStickerResult().click();

    await expect(this.page).toHaveURL(/\/kr\/stickers\/die-cut-sticker\/?$/);
  }

  async closeWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(this.dialog).toBeHidden();
  }

  async closeWithButton(): Promise<void> {
    await this.dialog.getByRole('button', { name: '닫기' }).click();
    await expect(this.dialog).toBeHidden();
  }

  private dieCutStickerResult(): Locator {
    return this.page
      .getByTestId('app-header-search-result-stickers:die-cut-sticker-button')
      .or(this.dialog.getByRole('button', { name: /다이컷 스티커|자유형 (조각)?스티커/ }).first())
      .first();
  }

  private searchResults(): Locator {
    return this.dialog.locator('[data-testid^="app-header-search-result-"]');
  }
}
