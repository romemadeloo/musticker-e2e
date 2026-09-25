import { test } from '../../fixtures/e2e-test.js';
import { cartLineName, stickerSheetProduct, transferStickerProduct, vinylLetteringProduct } from '../../fixtures/storefront-data.js';
import { CartDrawer } from '../../pom/cart-drawer.js';
import { ProductV2Page } from '../../pom/product-page.js';

// Deep configuration + price + cart coverage for three catalog products under ./stickers/ whose
// control patterns don't match the plain die-cut size+quantity flow (see
// sticker-catalog-configurator.spec.ts) and were previously only "render-only smoke" tested via
// catalog-crawl.spec.ts. Verified live against development-3 on 2026-08-13 while authoring this
// suite.
test.describe('storefront v2 catalog: sheet, lettering, and transfer stickers', {
  tag: ['@regression', '@production', '@purchasing']
}, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true
  });

  test('MS-V2-070 custom sheet sticker supports material, sheet size, and quantity selection through to cart', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = stickerSheetProduct;

    await product.goto(data.path, data.heading);
    await product.selectMaterial(data.material);
    await product.selectSheetSize(data.sheetSize);
    await product.selectQuantity(data.quantity);
    await product.expectSheetTemplateControls();
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.expectLineItem({ productName: data.heading, quantity: data.quantity });
  });

  // vinyl-lettering has no design-file upload step: color + live text + quantity fully define the
  // design, so its "다음 단계" button adds straight to cart and opens the cart preview drawer --
  // unlike every other product in this suite, there is no separate "장바구니 담기" confirmation
  // button to click inside an intermediate dialog.
  test('MS-V2-071 lettering sticker supports color, custom text, and quantity selection through to cart', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = vinylLetteringProduct;

    await product.goto(data.path, data.heading);
    await product.selectSwatchColor(data.colorLabel);
    await product.fillVinylLetteringText(data.text);
    await product.selectQuantity(data.quantity);
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
    await product.clickNextStepAndExpectProgression();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.expectLineItem({ productName: data.heading, quantity: data.quantity });
  });

  test('MS-V2-072 full-color lettering (transfer) sticker supports color, size, and quantity selection through to cart', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = transferStickerProduct;

    await product.goto(data.path, data.heading);
    await product.selectSwatchColor(data.colorLabel);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
    await product.addToCart();

    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.expectLineItem({ productName: cartLineName(data), quantity: data.quantity });
  });
});
