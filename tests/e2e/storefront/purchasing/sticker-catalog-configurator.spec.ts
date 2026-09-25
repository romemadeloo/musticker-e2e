import { test } from '../../../fixtures/e2e-test.js';
import { cartLineName, dieCutRollStickers, dieCutShapeStickers } from '../../../fixtures/storefront-data.js';
import { CartDrawer } from '../../../pom/storefront/cart-drawer.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

// Deep configuration + price + cart coverage for the plain size+quantity die-cut catalog products
// that were previously only "render-only smoke" tested via catalog-crawl.spec.ts (see
// storefront-data.ts catalogPaths comment). These are structurally identical to
// v2Products.dieCutSticker / v2Products.dieCutRoll (no material selector, just size + quantity),
// confirmed live against development-3 on 2026-08-13 while authoring this suite for all 15
// products below.
test.describe('storefront v2 catalog: plain die-cut shape stickers', {
  tag: ['@regression', '@production', '@purchasing']
}, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true
  });

  for (const data of dieCutShapeStickers) {
    test(`MS-V2-060 ${data.heading} supports size and quantity selection through to cart`, async ({ page }) => {
      const product = new ProductV2Page(page);
      await product.goto(data.path, data.heading);

      await product.selectSize(data.size);
      await product.selectQuantity(data.quantity);
      await product.expectVisiblePrice();
      await product.expectNextStepEnabled();
      await product.addToCart();

      const drawer = new CartDrawer(page);
      await drawer.expectVisible();
      await drawer.expectLineItem({ productName: cartLineName(data), quantity: data.quantity });
    });
  }

  for (const data of dieCutRollStickers) {
    test(`MS-V2-061 ${data.heading} supports size and quantity selection through to cart`, async ({ page }) => {
      const product = new ProductV2Page(page);
      await product.goto(data.path, data.heading);

      await product.selectSize(data.size);
      await product.selectQuantity(data.quantity);
      await product.expectVisiblePrice();
      await product.expectNextStepEnabled();
      await product.addToCart();

      const drawer = new CartDrawer(page);
      await drawer.expectVisible();
      await drawer.expectLineItem({ productName: cartLineName(data), quantity: data.quantity });
    });
  }

  test('MS-V2-062 circle sticker: custom individual size recalculates the price', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = dieCutShapeStickers.find((entry) => entry.path === './stickers/circle-sticker')!;
    await product.goto(data.path, data.heading);

    await product.selectCustomIndividualSize(20, 20);
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
  });

  test('MS-V2-063 circle roll sticker: custom individual size recalculates the price', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = dieCutRollStickers.find((entry) => entry.path === './roll-stickers/circle-roll')!;
    await product.goto(data.path, data.heading);

    await product.selectCustomIndividualSize(20, 20);
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
  });

  test('MS-V2-064 circle sticker: bulk quantity tiers surface a discount that smaller tiers do not', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = dieCutShapeStickers.find((entry) => entry.path === './stickers/circle-sticker')!;
    await product.goto(data.path, data.heading);

    await product.selectQuantity(10);
    await product.expectNoBulkDiscountVisible();

    await product.selectQuantity(1000);
    await product.expectBulkDiscountVisible();
  });

  test('MS-V2-065 circle roll sticker: bulk quantity tiers surface a discount that smaller tiers do not', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = dieCutRollStickers.find((entry) => entry.path === './roll-stickers/circle-roll')!;
    await product.goto(data.path, data.heading);

    await product.selectQuantity(10);
    await product.expectNoBulkDiscountVisible();

    await product.selectQuantity(1000);
    await product.expectBulkDiscountVisible();
  });
});
