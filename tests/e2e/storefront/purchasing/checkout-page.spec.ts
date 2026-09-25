import { test } from '../../fixtures/e2e-test.js';
import { v2Products } from '../../fixtures/storefront-data.js';
import { CheckoutV2Page } from '../../pom/checkout-page.js';
import { ProductV2Page } from '../../pom/product-page.js';

test.describe('storefront v2 checkout page', { tag: ['@regression', '@production'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true,
    allowGuestCheckoutBootstrap401: true
  });

  test('MS-V2-041 checkout page renders shipping, payment, and order summary without submitting', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    await product.addToCart();

    const checkout = new CheckoutV2Page(page);
    await checkout.goto();
    await checkout.expectCheckoutFormRenders();
  });

  test('MS-V2-042 checkout blocks payment submission when required fields are blank', async ({ page }) => {
    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    await product.addToCart();

    const checkout = new CheckoutV2Page(page);
    await checkout.goto();
    await checkout.expectBlankSubmissionBlocked();
  });
});
