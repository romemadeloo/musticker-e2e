import { qaTrackingNumber } from '../../../fixtures/admin-data.js';
import { expect, test } from '../../../fixtures/admin-test.js';
import { activeEnvironment } from '../../../fixtures/env.js';
import {
  createMailTmAccount,
  extractOtpCode,
  mailTmBody,
  waitForMailTmMessage,
  waitForNewMailTmMessages
} from '../../../fixtures/mail-tm.js';
import type { MailTmMessage } from '../../../fixtures/mail-tm.js';
import {
  brokenTemplateMarkers,
  customerOrderEmails,
  emailContainsFact
} from '../../../fixtures/order-emails.js';
import type { OrderEmailExpectation, OrderEmailFact, OrderEmailStep } from '../../../fixtures/order-emails.js';
import { guestCheckoutProfile, throwawayAccount, v2Products } from '../../../fixtures/storefront-data.js';
import { recordCreatedAccount } from '../../../fixtures/test-data-ledger.js';
import { CheckoutV2Page } from '../../../pom/storefront/checkout-page.js';
import { OrderConfirmationPage } from '../../../pom/storefront/order-confirmation-page.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';
import { RegisterPage } from '../../../pom/storefront/register-page.js';
import { expectUntouchedPaidOrder, fullLifecycleActivity, orderLifecycleStages } from './order-lifecycle.js';

const canRun =
  process.env.RUN_ADMIN_DESTRUCTIVE_E2E === 'true' && process.env.RUN_PAYMENT_E2E === 'true';
const captureEmails = process.env.ORDER_EMAIL_CAPTURE === 'true';

// How long a step's known emails get to arrive, how long a step whose emails are not yet recorded
// is watched, and how long the inbox is watched after the last step for anything late or extra.
const EXPECTED_EMAIL_TIMEOUT = 90_000;
const UNRECORDED_STEP_WINDOW = 20_000;
const FINAL_QUIET_WINDOW = 30_000;

// Playwright's failure screenshots and traces cover every page in the worker, the admin panel's
// included, so they are off for the whole file -- see adminPage in admin-test.ts, which enforces it.
test.use({ screenshot: 'off', trace: 'off' });

/**
 * The whole customer journey, with every email it sends read and checked: a new member registers
 * with a mail.tm inbox, orders and pays with the KakaoPay sandbox, and staff take that order through
 * the lifecycle in order-lifecycle.ts to delivered. After each step the inbox is read, and the
 * emails that step sent are compared with tests/fixtures/order-emails.ts by subject, sender and the
 * facts they must carry (order number, rejection reason, proof message, tracking number, ...).
 *
 * Needs no seeded order or member: it places its own, so each run leaves one completed dev order
 * and one throwaway member, booked for deletion by the global teardown.
 *
 * Customer emails only. Admin emails go to sales@musticker.com, which the suite cannot read.
 *
 * Gated on RUN_ADMIN_DESTRUCTIVE_E2E and RUN_PAYMENT_E2E, and refuses every environment but dev-1.
 */
test.describe('Order emails', { tag: ['@admin', '@e2e', '@destructive', '@slow', '@payment'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true,
    // MUS-QA-025: the artwork reminder after payment answers 500, so that email never arrives.
    allowKnownArtworkReminderFailure: true
  });

  test.skip(
    !canRun,
    'Registers a member, pays for a real dev order and completes it. Set RUN_ADMIN_DESTRUCTIVE_E2E=true and ' +
      'RUN_PAYMENT_E2E=true to run it.'
  );
  test.skip(
    activeEnvironment !== 'dev-1',
    `Order-processing changes run on dev-1 only (this run: ${activeEnvironment ?? 'unknown'}).`
  );

  test('MS-ADMO-019 a new member’s order sends the expected customer email at every step to delivered', async ({
    page,
    adminPage,
    adminApi
  }, testInfo) => {
    // The lifecycle alone takes up to 8 minutes; registration, checkout and the email waits add to it.
    test.setTimeout(20 * 60_000);

    const mailbox = await createMailTmAccount();
    const seen = new Set<string>();
    const received: Array<{ step: OrderEmailStep; emails: Array<ReturnType<typeof describeEmail>> }> = [];
    const unrecorded: string[] = [];
    const facts: Partial<Record<OrderEmailFact, string>> = {
      customerName: throwawayAccount.fullName,
      recipientName: guestCheckoutProfile.fullName
    };

    function describeEmail(message: MailTmMessage) {
      const body = mailTmBody(message);
      const content = `${message.subject}\n${body}`;
      return {
        subject: facts.orderNumber ? message.subject.split(facts.orderNumber).join('{orderNumber}') : message.subject,
        from: message.from?.address ?? '',
        facts: (Object.entries(facts) as Array<[OrderEmailFact, string]>)
          .filter(([fact, value]) => emailContainsFact(fact, value, content))
          .map(([fact]) => fact),
        body
      };
    }

    async function checkEmails(step: OrderEmailStep): Promise<void> {
      await test.step(`emails: ${step}`, async () => {
        const expected = customerOrderEmails[step];
        const messages = await waitForNewMailTmMessages(
          mailbox,
          seen,
          expected === undefined
            ? { timeoutMs: UNRECORDED_STEP_WINDOW }
            : { count: expected.length, timeoutMs: expected.length ? EXPECTED_EMAIL_TIMEOUT : 0 }
        );
        const emails = messages.map(describeEmail);
        received.push({ step, emails });

        for (const email of emails) {
          expect.soft(email.body, `"${email.subject}" (${step}) has an empty body`).not.toBe('');
          for (const marker of brokenTemplateMarkers) {
            expect.soft(`${email.subject}\n${email.body}`, `"${email.subject}" (${step}) shows a broken template`).not.toMatch(
              marker
            );
          }
        }

        if (expected === undefined) {
          unrecorded.push(recordedEntry(step, emails));
          return;
        }

        expect(
          emails.map((email) => email.subject),
          `${step} should send exactly these emails, in this order`
        ).toEqual(expected.map((entry) => entry.subject));

        expected.forEach((entry, index) => {
          const email = emails[index];
          expect.soft(email.from, `sender of "${entry.subject}"`).toBe(entry.from);
          for (const fact of entry.facts) {
            expect.soft(email.facts, `"${entry.subject}" (${step}) should contain the ${fact}: ${facts[fact]}`).toContain(fact);
          }
        });
      });
    }

    await test.step('customer: registers as a member with a fresh inbox', async () => {
      const register = new RegisterPage(page);
      await register.goto();
      await register.fillDetails({
        fullName: throwawayAccount.fullName,
        email: mailbox.address,
        password: throwawayAccount.password
      });
      await register.submitAndAwaitVerificationRequest();

      const otpEmail = await waitForMailTmMessage(mailbox, (message) => /인증/.test(message.subject));
      seen.add(otpEmail.id);

      const response = await register.submitVerificationCode(extractOtpCode(otpEmail));
      expect(response.status()).toBe(201);
      recordCreatedAccount({ email: mailbox.address, createdBy: 'MS-ADMO-019' });
      await expect(page).toHaveURL(/\/kr\/auth\/profile\/?$/);
    });

    await checkEmails('registration');

    const orderNumber = await test.step('customer: orders and pays with the KakaoPay sandbox', async () => {
      const product = new ProductV2Page(page);
      const data = v2Products.dieCutSticker;
      await product.goto(data.path, data.heading);
      await product.selectSize(data.size);
      await product.selectQuantity(data.quantity);
      await product.addToCart();

      const checkout = new CheckoutV2Page(page);
      await checkout.goto();
      await checkout.expectMemberCheckout();
      await checkout.fillShippingDetails(guestCheckoutProfile);
      await checkout.selectKakaoPay();
      await checkout.completePayAppMockCardPayment(await checkout.submitPaymentAndAwaitPayAppPopup());

      const confirmation = new OrderConfirmationPage(page);
      const confirmed = await confirmation.expectOrderConfirmed();
      await confirmation.expectLineItem(data.heading, `${data.quantity}개`);
      return confirmed.orderNumber;
    });

    const { orderId, cartItemId } = await test.step('the new order is the member’s, paid, and untouched', () =>
      expectUntouchedPaidOrder(adminApi, orderNumber, mailbox.address)
    );

    const [item] = await adminApi.items(orderId);
    const journey = {
      orderNumber,
      rejectionFeedback: `QA automation ${Date.now()}: resolution too low, please upload a higher-resolution file.`,
      proofMessage: `QA automation proof for ${orderNumber}.`,
      trackingNumber: qaTrackingNumber()
    };
    Object.assign(facts, journey, { productName: item.product.translated });

    await checkEmails('checkout');

    for (const stage of orderLifecycleStages({ page, adminPage, adminApi, orderId, facts: journey })) {
      await test.step(stage.title, stage.run);

      await checkEmails(stage.key);
    }

    await test.step('the activity log holds the whole lifecycle, in order', async () => {
      const codes = (await adminApi.activity(cartItemId)).map((entry) => entry.item_status.code).reverse();
      expect(codes).toEqual(fullLifecycleActivity);
    });

    await test.step('emails: nothing else arrives after delivery', async () => {
      const late = await waitForNewMailTmMessages(mailbox, seen, { timeoutMs: FINAL_QUIET_WINDOW });
      expect(late.map((message) => message.subject), 'emails no step accounts for').toEqual([]);
    });

    // Only test data: the throwaway member, the QA profile and a dev order.
    await testInfo.attach('customer-emails.json', {
      body: JSON.stringify({ orderNumber, mailbox: mailbox.address, received }, null, 2),
      contentType: 'application/json'
    });

    if (unrecorded.length) {
      const snippet = unrecorded.join('\n');
      console.log(`\nCustomer emails for steps not yet in tests/fixtures/order-emails.ts:\n${snippet}\n`);
      if (!captureEmails) {
        throw new Error(
          `${unrecorded.length} step(s) of customerOrderEmails are not recorded yet. Check what arrived and paste it ` +
            `into tests/fixtures/order-emails.ts (or rerun with ORDER_EMAIL_CAPTURE=true to record without failing):\n${snippet}`
        );
      }
      testInfo.annotations.push({ type: 'unrecorded-emails', description: snippet });
    }
  });
});

/** A customerOrderEmails entry for what a step actually sent, in the file's own style. */
function recordedEntry(step: OrderEmailStep, emails: ReadonlyArray<OrderEmailExpectation>): string {
  const quote = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (!emails.length) {
    return `  ${step}: [],`;
  }

  const entries = emails.map(
    (email) =>
      `    { subject: ${quote(email.subject)}, from: ${quote(email.from)}, facts: [${email.facts.map(quote).join(', ')}] }`
  );
  return `  ${step}: [\n${entries.join(',\n')}\n  ],`;
}
