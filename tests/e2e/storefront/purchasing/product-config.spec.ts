import { test } from '../../fixtures/e2e-test.js';
import { v2Products } from '../../fixtures/storefront-data.js';
import { ProductV2Page } from '../../pom/product-page.js';

test.describe('storefront v2 product configuration', { tag: ['@regression', '@production', '@purchasing'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    // MS-V2-012 opens the custom size and quantity inputs without filling them in, which is the
    // state under test: the storefront tries to re-quote and warns that the configuration is not
    // priceable yet. The tests here that do complete a configuration still assert a visible price,
    // so a product that genuinely cannot be priced is caught by those instead.
    allowIncompletePricingWarnings: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true
  });

  test('MS-V2-009 die-cut sticker supports size and quantity selection', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
    await product.clickNextStepAndExpectProgression();
  });

  test('MS-V2-010 die-cut roll sticker supports size and quantity selection', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutRoll;

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
    await product.clickNextStepAndExpectProgression();
  });

  test('MS-V2-011 die-cut sheet sticker supports material, sheet size, and quantity selection', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSheet;

    await product.goto(data.path, data.heading);
    await product.selectMaterial(data.material);
    await product.selectSheetSize(data.sheetSize);
    await product.selectQuantity(data.quantity);
    await product.expectSheetTemplateControls();
    await product.expectVisiblePrice();
    await product.expectNextStepEnabled();
    await product.clickNextStepAndExpectProgression();
  });

  test('MS-V2-012 custom size and quantity controls are reachable', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;

    await product.goto(data.path, data.heading);
    await product.expectCustomControlsOpen();
  });

  test('MS-V2-013 product trust and delivery promises are visible', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;

    await product.goto(data.path, data.heading);
    await product.expectProductionPromises();
  });

  test('MS-V2-014 product review carousel is usable', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;

    await product.goto(data.path, data.heading);
    await product.expectReviewCarouselUsable();
  });
});

