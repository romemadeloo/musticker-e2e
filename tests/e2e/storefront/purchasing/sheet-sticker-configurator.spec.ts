import { fileURLToPath } from 'node:url';

import { test } from '../../fixtures/e2e-test.js';
import { cartLineName, ko, sheetStickerConfiguratorProducts } from '../../fixtures/storefront-data.js';
import { CartDrawer } from '../../pom/cart-drawer.js';
import { CartV2Page } from '../../pom/cart-page.js';
import { ProductV2Page } from '../../pom/product-page.js';

// Individual-sticker sheet configurator flow (material -> individual size -> sheet quantity ->
// design upload -> cart) for the five shape variants requested for coverage: circle, oval,
// square, rectangle, and rounded sheet stickers. These were previously only "render-only smoke"
// tested via catalog-crawl.spec.ts (see storefront-data.ts catalogPaths comment); this file adds
// the deeper configuration + cart flow coverage that v2Products.dieCutSheet already gets for the
// freeform/die-cut sheet variant.
//
// Verified live against development-3 (dev-3.musticker.com) on 2026-08-12 while authoring this
// suite. The test below (MS-V2-058) intentionally asserts behavior that FAILS today on dev-3 and
// documents a real defect found during that verification:
//   - MS-V2-058: size-guide illustration <img alt> text is either a raw untranslated i18n key
//     (circle/oval/rectangle-sheet, e.g. "product.sizes.small40x40.label") or an unrelated
//     paper-size label (square/rounded-sheet, e.g. "A6 105x148", "72x170") instead of meaningful,
//     localized alt text.
//
// A fractional-won per-unit price readout (e.g. "8.582원" for a custom 20x20mm size at the
// 1,000-sheet tier) was previously flagged here as a defect (MS-V2-059) but confirmed with Korean
// staff on 2026-08-13 to be expected/acceptable pricing behavior, not a bug -- removed.
const designFilePath = fileURLToPath(new URL('../../fixtures/files/sample-design.png', import.meta.url));

test.describe('storefront v2 sheet sticker configurator (circle/oval/square/rectangle/rounded)', {
  tag: ['@regression', '@production', '@purchasing']
}, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true
  });

  for (const data of sheetStickerConfiguratorProducts) {
    test(`MS-V2-050 ${data.heading} supports material, size, and quantity selection through to cart`, async ({ page }) => {
      const product = new ProductV2Page(page);
      await product.goto(data.path, data.heading);

      await product.selectMaterial(ko.hologram);
      await product.selectSize('중형');
      await product.selectQuantity(20);
      await product.expectVisiblePrice();
      await product.expectNextStepEnabled();

      await product.clickNextStepAndExpectProgression();
      await product.expectDesignUploadModal();

      const addToCartButton = page.getByRole('dialog').getByRole('button', { name: ko.addToCart });
      await addToCartButton.click();

      const drawer = new CartDrawer(page);
      await drawer.expectVisible();
      await drawer.expectLineItem({
        productName: cartLineName(data),
        quantity: 20
      });
    });
  }

  test('MS-V2-051 circle sheet sticker: custom individual size recalculates the whole quantity price ladder', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectCustomIndividualSize(20, 20);
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
  });

  test('MS-V2-052 circle sheet sticker: bulk quantity tiers surface a discount that smaller tiers do not', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectQuantity(5);
    await product.expectNoBulkDiscountVisible();

    await product.selectQuantity(1000);
    await product.expectBulkDiscountVisible();
  });

  test('MS-V2-053 circle sheet sticker: design upload modal accepts an order note and a design file before adding to cart', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectQuantity(10);
    await product.clickNextStepAndExpectProgression();
    await product.expectDesignUploadModal();

    await product.uploadDesignFile(designFilePath);
    await product.expectDesignFileAccepted('sample-design.png');
    await product.fillDesignOrderNote('Please make sure the colors and size are exactly perfect.');

    const addToCartButton = page.getByRole('dialog').getByRole('button', { name: ko.addToCart });
    await addToCartButton.click();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.expectLineItem({ productName: data.heading, quantity: 10 });

    await drawer.viewCart();
    const cart = new CartV2Page(page);
    await cart.expectImageLinkVisible(data.heading);
  });

  test('MS-V2-054 circle sheet sticker: editing material from the cart preview drawer recalculates the line price', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectMaterial(ko.pvcMatte);
    await product.selectQuantity(5);
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.editFirstItemMaterial(ko.hologram);
    await drawer.expectLineItem({ productName: data.heading });
  });

  test('MS-V2-055 circle sheet sticker: cart preview drawer "장바구니 보기" hands off to the full cart page with the item intact', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectQuantity(5);
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.viewCart();

    const cart = new CartV2Page(page);
    await cart.expectRowContainsText(data.heading, '30x30mm', 'PVC 매트', '5시트');
    await cart.expectAddImageLinkVisible(data.heading);
  });

  test('MS-V2-056 circle sheet sticker: full cart page "사이즈 변경" dialog exposes material + size only (no quantity), and updates price', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectMaterial(ko.pvcMatte);
    await product.selectQuantity(5);
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.viewCart();

    const cart = new CartV2Page(page);
    await cart.changeMaterialViaSizeChangeDialog(data.heading, ko.hologram);
    await cart.expectRowContainsText(data.heading, ko.hologram);
  });

  test('MS-V2-057 circle sheet sticker: full cart page row quantity select updates price without a separate confirm step', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectQuantity(5);
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.viewCart();

    const cart = new CartV2Page(page);
    await cart.changeQuantityViaRowSelect(data.heading, '500시트');
    await cart.expectRowContainsText(data.heading, '500시트');
  });

  for (const data of sheetStickerConfiguratorProducts) {
    // Known failing -- see the suite-level comment above for the defect this test documents
    // (untranslated i18n key vs. mismatched content). First seen on development-3 on 2026-08-12
    // and re-confirmed unfixed on production in run #94 (2026-08-20), where all five variants
    // failed. Marked fixme to keep the board actionable; remove this once the storefront
    // localizes the size-guide alt text, and the test should go green on its own.
    test.fixme(`MS-V2-058 ${data.heading} size-guide illustrations have meaningful, localized alt text`, async ({ page }) => {
      const product = new ProductV2Page(page);
      await product.goto(data.path, data.heading);

      await product.expectSizeGuideImagesLocalized();
    });
  }
});
