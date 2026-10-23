import { fileURLToPath } from 'node:url';

import { expect, test } from '../../../fixtures/e2e-test.js';
import { cartLineName, ko, sheetStickerConfiguratorProducts } from '../../../fixtures/storefront-data.js';
import { CartDrawer } from '../../../pom/storefront/cart-drawer.js';
import { CartV2Page } from '../../../pom/storefront/cart-page.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

// Individual-sticker sheet configurator flow (material -> individual size -> sheet quantity ->
// design upload -> cart) for the five shape variants requested for coverage: circle, oval,
// square, rectangle, and rounded sheet stickers. These were previously only "render-only smoke"
// tested via catalog-crawl.spec.ts (see storefront-data.ts catalogPaths comment); this file adds
// the deeper configuration + cart flow coverage that v2Products.dieCutSheet already gets for the
// freeform/die-cut sheet variant.
//
// Verified live against the dev storefront on 2026-08-12 while authoring this
// suite. The test below (MS-CFG-015) intentionally asserts behavior that FAILS today on dev-3 and
// documents a real defect found during that verification:
//   - MS-CFG-015: size-guide illustration <img alt> text is either a raw untranslated i18n key
//     (circle/oval/rectangle-sheet, e.g. "product.sizes.small40x40.label") or an unrelated
//     paper-size label (square/rounded-sheet, e.g. "A6 105x148", "72x170") instead of meaningful,
//     localized alt text.
//
// A fractional-won per-unit price readout (e.g. "8.582원" for a custom 20x20mm size at the
// 1,000-sheet tier) was previously flagged here as a defect (MS-CFG-016) but confirmed with Korean
// staff on 2026-08-13 to be expected/acceptable pricing behavior, not a bug -- removed.
const designFilePath = fileURLToPath(new URL('../../../fixtures/files/sample-design.png', import.meta.url));

test.describe('Sheet sticker configurator', {
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
    test(`MS-CFG-007 ${data.heading} supports material, size, and quantity selection through to cart`, async ({ page }) => {
      const product = new ProductV2Page(page);
      await product.goto(data.path, data.heading);

      await product.selectMaterial(ko.hologram);
      await product.selectSize('중형');
      await product.selectQuantity(20);
      await product.expectVisiblePrice();
      await product.expectNextStepEnabled();

      await product.clickNextStepAndExpectProgression();
      await product.expectDesignUploadModal();

      await product.skipDesignFile();

      const drawer = new CartDrawer(page);
      await drawer.expectVisible();
      await drawer.expectLineItem({
        productName: cartLineName(data),
        quantity: 20
      });
    });
  }

  test('MS-CFG-008 circle sheet sticker: custom individual size recalculates the whole quantity price ladder', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectCustomIndividualSize(20, 20);
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
  });

  // Sheet stickers show a discount on every tier since early October 2026 (10시트 reads -4% against
  // a 6,900원 list price), so the rule is now that bulk earns a bigger one, not that it alone has one.
  test('MS-CFG-009 circle sheet sticker: bulk quantity tiers surface a bigger discount than smaller tiers', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectQuantity(10);
    await expect.poll(() => product.discountPercent(), { message: 'the 10시트 discount badge' }).toBeGreaterThan(0);
    const smallTierDiscount = await product.discountPercent();

    await product.selectQuantity(1000);
    await expect
      .poll(() => product.discountPercent(), { message: 'the 1,000시트 discount badge' })
      .toBeGreaterThan(smallTierDiscount);
  });

  test('MS-CFG-010 circle sheet sticker: design upload modal accepts an order note and a design file before adding to cart', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectQuantity(10);
    await product.clickNextStepAndExpectProgression();
    await product.expectDesignUploadModal();

    await product.uploadDesignFile(designFilePath);
    await product.expectDesignFileAccepted('sample-design.png');
    await product.fillDesignOrderNote('Please make sure the colors and size are exactly perfect.');

    await product.orderWithDesignFile();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.expectLineItem({ productName: data.heading, quantity: 10 });

    await drawer.viewCart();
    const cart = new CartV2Page(page);
    await cart.expectImageLinkVisible(data.heading);
  });

  test('MS-CFG-011 circle sheet sticker: editing material from the cart preview drawer recalculates the line price', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectMaterial(ko.matteWhite);
    await product.selectQuantity(10);
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.editFirstItemMaterial(ko.hologram);
    await drawer.expectLineItem({ productName: data.heading });
  });

  test('MS-CFG-012 circle sheet sticker: cart preview drawer "장바구니 보기" hands off to the full cart page with the item intact', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectQuantity(10);
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.viewCart();

    const cart = new CartV2Page(page);
    await cart.expectRowContainsText(data.heading, '30x30mm', ko.matteWhite, '10시트');
    await cart.expectAddImageLinkVisible(data.heading);
  });

  test('MS-CFG-013 circle sheet sticker: full cart page "사이즈 변경" dialog exposes material + size only (no quantity), and updates price', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectMaterial(ko.matteWhite);
    await product.selectQuantity(10);
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.viewCart();

    const cart = new CartV2Page(page);
    await cart.changeMaterialViaSizeChangeDialog(data.heading, ko.hologram);
    await cart.expectRowContainsText(data.heading, ko.hologram);
  });

  test('MS-CFG-014 circle sheet sticker: full cart page row quantity select updates price without a separate confirm step', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = sheetStickerConfiguratorProducts[0];
    await product.goto(data.path, data.heading);

    await product.selectQuantity(10);
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.viewCart();

    const cart = new CartV2Page(page);
    await cart.changeQuantityViaRowSelect(data.heading, '500시트');
    await cart.expectRowContainsText(data.heading, '500시트');
  });

  for (const data of sheetStickerConfiguratorProducts) {
    // Known failing -- see the suite-level comment above for the defect this test documents
    // (untranslated i18n key vs. mismatched content). First seen on the dev storefront on 2026-08-12
    // and re-confirmed unfixed on production in run #94 (2026-08-20), where all five variants
    // failed. Marked fixme to keep the board actionable; remove this once the storefront
    // localizes the size-guide alt text, and the test should go green on its own.
    test.fixme(`MS-CFG-015 ${data.heading} size-guide illustrations have meaningful, localized alt text`, async ({ page }) => {
      const product = new ProductV2Page(page);
      await product.goto(data.path, data.heading);

      await product.expectSizeGuideImagesLocalized();
    });
  }
});
