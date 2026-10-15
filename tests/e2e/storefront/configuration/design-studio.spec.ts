import { fileURLToPath } from 'node:url';

import { expect, test } from '../../../fixtures/e2e-test.js';
import { v2Products } from '../../../fixtures/storefront-data.js';
import { studioPrice } from '../../../pom/storefront/design-studio.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

// 200x200: about 57dpi at 75mm, which the studio refuses to print.
const lowResolutionDesign = fileURLToPath(new URL('../../../fixtures/files/qa-proof.png', import.meta.url));
// 1,200x1,200 with a transparent background: about 400dpi at 75mm.
const printQualityDesign = fileURLToPath(new URL('../../../fixtures/files/studio-design.png', import.meta.url));

/**
 * The order chooser and the web design studio that 다음 단계 has opened since early October 2026
 * (see tests/pom/storefront/design-studio.ts). Nothing here adds to the cart: attaching a design in
 * the studio stays in the browser, so these run on production.
 */
test.describe('Design studio', { tag: ['@regression', '@production', '@purchasing'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true,
    allowStudioModelLoadNoise: true
  });

  const data = v2Products.dieCutSticker;

  test('MS-CFG-026 다음 단계 offers three ways to order: with a file, in the studio, or file later', async ({ page }) => {
    const product = new ProductV2Page(page);
    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);

    await product.clickNextStepAndExpectProgression();
    await product.expectDesignUploadModal();
  });

  test('MS-CFG-027 the studio keeps the configured size and quantity and prices every tier 5% below the configurator', async ({
    page
  }) => {
    // The studio loads its editor and image model before it shows anything.
    test.setTimeout(120_000);
    const product = new ProductV2Page(page);
    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);

    const configuratorPrices = {
      10: await product.captureQuantityTierPrice(10),
      1000: await product.captureQuantityTierPrice(1000),
      [data.quantity]: await product.captureQuantityTierPrice(data.quantity)
    };
    await product.selectQuantity(data.quantity);

    const studio = await product.openStudio();
    await studio.expectSize(75, 75);
    await studio.expectQuantity(data.quantity);
    expect(await studio.currentPrice(), 'studio price for the configured quantity').toBe(
      studioPrice(configuratorPrices[data.quantity])
    );

    for (const quantity of [10, 1000] as const) {
      expect(await studio.tierPrice(quantity), `studio ${quantity}개 tier`).toBe(studioPrice(configuratorPrices[quantity]));
    }
  });

  test('MS-CFG-028 the studio refuses a low-resolution design and accepts a print-quality one', async ({ page }) => {
    test.setTimeout(150_000);
    const product = new ProductV2Page(page);

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    let studio = await product.openStudio();
    await expect(studio.addToCartButton, 'nothing attached yet').toBeDisabled();
    await studio.attachDesign(lowResolutionDesign);
    await studio.expectLowResolutionRefused();

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    studio = await product.openStudio();
    await studio.attachDesign(printQualityDesign);
    await studio.expectReadyForCart();
  });
});
