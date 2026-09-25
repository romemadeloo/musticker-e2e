import { test, expect } from '../../fixtures/e2e-test.js';
import { createMailTmAccount, extractOtpCode, waitForMailTmMessage } from '../../fixtures/mail-tm.js';
import { guestCheckoutProfile, v2Products } from '../../fixtures/storefront-data.js';
import { CheckoutV2Page } from '../../pom/checkout-page.js';
import { OrderConfirmationPage } from '../../pom/order-confirmation-page.js';
import { ProductV2Page } from '../../pom/product-page.js';

const canRunDestructiveCheckout = process.env.RUN_PAYMENT_E2E === 'true';

// Full guest checkout completion, verified live against development-3 on 2026-08-13 while
// authoring this suite. Guest checkout requires an emailed OTP before any payment control becomes
// interactive, and the KakaoPay tile opens a real "PayApp — Local Mock" sandbox popup (not
// production KakaoPay) on dev environments -- clicking its "Complete card payment" button fires
// the actual payment webhook and creates a real (dev) order. mail.tm (https://docs.mail.tm/, free,
// no API key) supplies a disposable inbox that receives both the OTP and the resulting
// order-confirmation email, since this only runs against dev sandboxes and creates real side
// effects there.
test.describe('storefront v2 destructive checkout', { tag: ['@e2e', '@destructive', '@slow', '@payment'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true,
    allowGuestCheckoutBootstrap401: true
  });

  test.skip(
    !canRunDestructiveCheckout,
    'MS-V2-025 is guarded because it creates checkout/order side effects. Set RUN_PAYMENT_E2E=true against a ' +
      'dev sandbox environment (not production -- no sandbox payment exists there yet) to run it.'
  );

  test('MS-V2-025 guest checkout completes via the KakaoPay sandbox and sends an order-confirmation email', async ({
    page
  }) => {
    // Sequential OTP-email polling, a shipping-cost recalculation wait, the PayApp popup round
    // trip, and a second email poll can legitimately add up past the 60s default on a live dev
    // environment.
    test.setTimeout(120_000);

    const mailbox = await createMailTmAccount();

    const product = new ProductV2Page(page);
    const data = v2Products.dieCutSticker;
    await product.goto(data.path, data.heading);
    await product.selectSize(data.size);
    await product.selectQuantity(data.quantity);
    await product.addToCart();

    const checkout = new CheckoutV2Page(page);
    await checkout.goto();
    await checkout.fillGuestEmailAndAwaitOtpModal(mailbox.address);

    const otpEmail = await waitForMailTmMessage(mailbox, (message) => /인증/.test(message.subject));
    await checkout.submitOtpCode(extractOtpCode(otpEmail));

    await checkout.fillShippingDetails(guestCheckoutProfile);
    await checkout.selectKakaoPay();

    const payAppPopup = await checkout.submitPaymentAndAwaitPayAppPopup();
    await checkout.completePayAppMockCardPayment(payAppPopup);

    const confirmation = new OrderConfirmationPage(page);
    const { orderNumber } = await confirmation.expectOrderConfirmed();
    await confirmation.expectLineItem(data.heading, `${data.quantity}개`);

    const confirmationEmail = await waitForMailTmMessage(mailbox, (message) => message.subject.includes('주문 안내'));
    expect(confirmationEmail.subject).toContain(orderNumber);
    expect(confirmationEmail.text ?? '').toContain(orderNumber);
  });
});
