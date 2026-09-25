import { test } from '../../fixtures/e2e-test.js';
import { categoryProducts, ko } from '../../fixtures/storefront-data.js';
import { CategoryV2Page } from '../../pom/category-page.js';

test.describe('storefront v2 category discovery', { tag: ['@regression', '@production', '@discovery'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-V2-006 sticker category lists expected product links', async ({ page }) => {
    const category = new CategoryV2Page(page);

    await category.goto('./stickers', ko.stickers);
    await category.expectProductLinks(categoryProducts.stickers);
    await category.openProduct(categoryProducts.stickers[0]);
  });

  test('MS-V2-007 roll sticker category lists expected product links', async ({ page }) => {
    const category = new CategoryV2Page(page);

    await category.goto('./roll-stickers', ko.rollStickers);
    await category.expectProductLinks(categoryProducts.rollStickers);
    await category.openProduct(categoryProducts.rollStickers[0]);
  });

  test('MS-V2-008 sheet sticker category lists expected product links', async ({ page }) => {
    const category = new CategoryV2Page(page);

    await category.goto('./sheet-stickers', ko.sheetStickers);
    await category.expectProductLinks(categoryProducts.sheetStickers);
    await category.openProduct(categoryProducts.sheetStickers[0]);
  });
});
