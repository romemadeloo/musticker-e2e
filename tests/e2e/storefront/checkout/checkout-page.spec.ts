import type { Page } from '@playwright/test';

import { checkoutCopy, checkoutInfoTips, checkoutPaymentMethods, checkoutShippingFeeTip } from '../../../fixtures/checkout-data.js';
import { expect, test } from '../../../fixtures/e2e-test.js';
import { appPath } from '../../../fixtures/env.js';
import { currentPath, gotoStorefront } from '../../../fixtures/navigation.js';
import { guestCheckoutProfile, v2Products } from '../../../fixtures/storefront-data.js';
import { CheckoutV2Page } from '../../../pom/storefront/checkout-page.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

test.describe('Checkout page', { tag: ['@regression', '@production'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true,
    allowGuestCheckoutBootstrap401: true
  });

  test('MS-CHK-002 checkout page renders shipping, payment, and order summary without submitting', async ({ page }) => {
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

  test('MS-CHK-003 checkout blocks payment submission when required fields are blank', async ({ page }) => {
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

  // MS-CHK-007 onward cover the checkout redesign, explored read-only on production on 2026-10-30
  // with a guest cart; dev-1 matched apart from two payment labels (see checkout-data.ts). Nothing is
  // submitted: every case stops short of 결제하기.
  test.describe('redesigned checkout', () => {
    async function openCheckoutWithItem(page: Page): Promise<CheckoutV2Page> {
      const product = new ProductV2Page(page);
      const data = v2Products.dieCutSticker;
      await product.goto(data.path, data.heading);
      await product.selectSize(data.size);
      await product.selectQuantity(data.quantity);
      await product.addToCart();

      const checkout = new CheckoutV2Page(page);
      await checkout.goto();
      return checkout;
    }

    test('MS-CHK-007 payment options are a single choice that starts on Npay', async ({ page }) => {
      const checkout = await openCheckoutWithItem(page);
      await checkout.expectPaymentOptions();
      await checkout.expectOnlySelectedPaymentMethod(checkoutCopy.defaultPaymentMethod);

      for (const method of checkoutPaymentMethods.slice(1)) {
        await checkout.selectPaymentMethod(method.name);
      }
      await checkout.selectPaymentMethod(checkoutCopy.defaultPaymentMethod);
    });

    test('MS-CHK-008 무통장 입금 asks for the depositor name only while it is selected', async ({ page }) => {
      const checkout = await openCheckoutWithItem(page);
      await expect(checkout.depositorField()).toHaveCount(0);

      await checkout.selectPaymentMethod('무통장 입금');
      await checkout.expectDepositorDetails();

      await checkout.selectPaymentMethod('신용카드');
      await expect(checkout.depositorField()).toHaveCount(0);
    });

    test('MS-CHK-009 the address search fills the postal code and road address, which stay read-only', async ({ page }) => {
      const checkout = await openCheckoutWithItem(page);
      await checkout.expectAddressFieldsReadOnly();

      await checkout.searchAddress(guestCheckoutProfile);
      await checkout.expectAddressFieldsReadOnly();
    });

    test('MS-CHK-010 일반 배송 promises a delivery window after today and charges the fee the summary shows', async ({ page }) => {
      const checkout = await openCheckoutWithItem(page);
      await expect(page.getByText(checkoutCopy.shippingMethodNote)).toBeVisible();

      const delivery = await checkout.readEstimatedDelivery();
      const summary = await checkout.captureOrderSummary();
      const today = seoulToday();

      expect(delivery.from.getTime(), 'delivery cannot start on the day of the order').toBeGreaterThan(today.getTime());
      expect(delivery.to.getTime()).toBeGreaterThanOrEqual(delivery.from.getTime());
      expect((delivery.to.getTime() - today.getTime()) / DAY_MS, 'window within a week of today').toBeLessThanOrEqual(7);
      expect(delivery.fee, 'the 일반 배송 fee is the summary 배송비').toBe(summary.shippingFee);
    });

    test('MS-CHK-011 위탁배송 adds a sender name and company block that unticking removes', async ({ page }) => {
      const checkout = await openCheckoutWithItem(page);
      await checkout.expectConsignmentSender(false);

      await checkout.toggleConsignment();
      await checkout.expectConsignmentSender(true);

      await checkout.toggleConsignment();
      await checkout.expectConsignmentSender(false);
    });

    test('MS-CHK-012 checkout info tips explain email, address, 위탁배송 and the shipping fee', async ({ page }) => {
      const checkout = await openCheckoutWithItem(page);

      for (const [index, tip] of checkoutInfoTips.entries()) {
        const text = await checkout.openInfoTip(index);
        expect(text, `${tip.about} tip`).toContain(tip.title);
        expect(text, `${tip.about} tip`).toContain(tip.text);
      }

      const fee = await checkout.openInfoTip('shippingFee');
      expect(fee).toContain(checkoutShippingFeeTip.text);
      expect(fee).toContain(checkoutShippingFeeTip.note);
    });

    test('MS-CHK-013 로그인 opens sign-in over the checkout, and 주문 요약 수정 returns to the cart', async ({ page }) => {
      const checkout = await openCheckoutWithItem(page);

      const login = await checkout.openLogin();
      await expect(login.getByText(checkoutCopy.loginMemberTab, { exact: true })).toBeVisible();
      await expect(login.getByText(checkoutCopy.loginGuestTab, { exact: true })).toBeVisible();
      await expect.poll(() => currentPath(page)).toBe(appPath('./checkout'));

      await gotoStorefront(page, appPath('./checkout'));
      await checkout.editOrderSummary();
    });

    test('MS-CHK-014 checkout info icons have accessible names', async ({ page }) => {
      // MUS-QA-027, found 2026-10-30 on production and dev-1: the email, road address and 위탁배송
      // info icons are bare buttons with no name (only 배송비 정보 보기 has one). When this starts
      // passing, the icons have been named -- remove this line.
      test.fail(true, 'DEFECT MUS-QA-027: three checkout info icons have no accessible name');

      const checkout = await openCheckoutWithItem(page);
      const triggers = checkout.infoTipTriggers();
      await expect(triggers).toHaveCount(checkoutInfoTips.length + 1);
      for (const trigger of await triggers.all()) {
        await expect(trigger, 'every info icon needs a name').toHaveAccessibleName(/\S/, { timeout: 2_000 });
      }
    });
  });
});

const DAY_MS = 24 * 60 * 60 * 1000;

/** Today's date in Seoul, as UTC midnight -- the same shape readEstimatedDelivery() returns. */
function seoulToday(): Date {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date()).split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
