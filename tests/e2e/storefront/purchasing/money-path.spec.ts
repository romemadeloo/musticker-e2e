import { test, expect } from '../../../fixtures/e2e-test.js';
import { formatWon, parseWon } from '../../../fixtures/money.js';
import { cartCopy, freeShippingThresholdWon, v2Products } from '../../../fixtures/storefront-data.js';
import { CartDrawer } from '../../../pom/storefront/cart-drawer.js';
import { CartV2Page } from '../../../pom/storefront/cart-page.js';
import { CheckoutV2Page } from '../../../pom/storefront/checkout-page.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

// The pricing suite verifies the quotation API to eight decimal places, and the configurator specs
// verify that changing an option moves the price. Neither follows one price all the way to the
// receipt, so a defect anywhere in the hand-offs -- product page to cart, cart to checkout, or the
// summary's own arithmetic -- would go unseen by both. These tests close that gap: they assert the
// figure the shopper was quoted is the figure they are charged, and that the summary adds up.
//
// Verified live against development-1 on 2026-08-27:
//
//   * The 30개 tier of 자유형 조각스티커 at 중형 75x75 quotes 18,700원, and 18,700원 is what the cart
//     drawer line, the cart page total, and the checkout 소계 all then read.
//   * 소계 18,700원 + 배송비 3,000원 - 할인 0원 = 합계 21,700원.
//   * Shipping follows the 5만원 이상 무료배송 promise: 3,000원 at a 32,500원 subtotal, 0원 at 106,000원.
test.describe('storefront v2 money path', { tag: ['@regression', '@production', '@purchasing'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true,
    allowGuestCheckoutBootstrap401: true
  });

  test('MS-V2-097 the quoted price survives product page, cart, and checkout unchanged', async ({ page }) => {
    const data = v2Products.dieCutSticker;
    const product = new ProductV2Page(page);

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);

    // The number every later assertion is measured against.
    const quotedPrice = await product.captureQuantityTierPrice(data.quantity);
    expect(quotedPrice, 'the configurator must quote a non-zero price before adding to cart').toBeGreaterThan(0);

    await product.addToCart();

    // 1. The cart preview drawer, which addToCart() leaves open.
    const drawer = new CartDrawer(page);
    await drawer.expectVisible();
    await drawer.expectLineItem({
      productName: data.heading,
      widthMm: 75,
      heightMm: 75,
      quantity: data.quantity
    });
    expect(parseWon(await drawer.captureTotal()), 'cart drawer total must equal the quoted price').toBe(quotedPrice);

    // 2. The full cart page.
    await drawer.viewCart();
    const cart = new CartV2Page(page);
    await expect(page.getByRole('heading', { name: cartCopy.pageHeading })).toBeVisible();
    await cart.expectRowCount(1);
    await cart.expectDeclaredItemCount(1);
    expect(await cart.captureRowPrices(), 'the single cart line must carry the quoted price').toEqual([quotedPrice]);
    expect(await cart.expectTotalIsSumOfRows(), 'cart total must equal the quoted price').toBe(quotedPrice);

    // 3. Checkout, where shipping and discounts finally apply.
    await cart.proceedToCheckout();
    const checkout = new CheckoutV2Page(page);
    const summary = await checkout.expectSummaryReconciles();

    expect(summary.subtotal, `checkout 소계 must still be the quoted ${formatWon(quotedPrice)}`).toBe(quotedPrice);
    expect(
      summary.total,
      'the amount charged must be the subtotal plus shipping, never less than the subtotal'
    ).toBeGreaterThanOrEqual(summary.subtotal);
  });

  test('MS-V2-098 an order below the free-shipping threshold is charged shipping', async ({ page }) => {
    const data = v2Products.dieCutSticker;
    const product = new ProductV2Page(page);

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);

    const quotedPrice = await product.captureQuantityTierPrice(data.quantity);
    // Guards the test's own premise: if pricing rises past the threshold this fixture stops covering
    // the paid-shipping branch, and that should be a loud failure rather than a silent pass.
    expect(
      quotedPrice,
      `MS-V2-098 needs a subtotal below ${formatWon(freeShippingThresholdWon)} to exercise paid shipping, but the ` +
        `${data.quantity}개 tier now quotes ${formatWon(quotedPrice)}. Lower v2Products.dieCutSticker.quantity.`
    ).toBeLessThan(freeShippingThresholdWon);

    await product.addToCart();

    const checkout = new CheckoutV2Page(page);
    await checkout.goto();
    const summary = await checkout.expectShippingFeeFollowsThreshold();

    expect(summary.subtotal).toBe(quotedPrice);
    expect(summary.total, 'a sub-threshold order must be charged more than its subtotal').toBeGreaterThan(
      summary.subtotal
    );
  });

  test('MS-V2-099 an order at or above the free-shipping threshold ships free', async ({ page }) => {
    const data = v2Products.dieCutSticker;
    const freeShippingQuantity = 1_000;
    const product = new ProductV2Page(page);

    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(freeShippingQuantity);

    const quotedPrice = await product.captureQuantityTierPrice(freeShippingQuantity);
    expect(
      quotedPrice,
      `MS-V2-099 needs a subtotal at or above ${formatWon(freeShippingThresholdWon)} to exercise free shipping, but ` +
        `the ${freeShippingQuantity}개 tier quotes ${formatWon(quotedPrice)}. Raise freeShippingQuantity.`
    ).toBeGreaterThanOrEqual(freeShippingThresholdWon);

    await product.addToCart();

    const checkout = new CheckoutV2Page(page);
    await checkout.goto();
    const summary = await checkout.expectShippingFeeFollowsThreshold();

    expect(summary.subtotal).toBe(quotedPrice);
    expect(summary.shippingFee, 'shipping must be free above the threshold').toBe(0);
    expect(summary.total, 'with free shipping and no discounts the total is the subtotal').toBe(summary.subtotal);
  });
});
