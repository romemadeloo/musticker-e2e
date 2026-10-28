import { qaTrackingNumber } from '../../../fixtures/admin-data.js';
import { expect, test } from '../../../fixtures/admin-test.js';
import { activeEnvironment, env } from '../../../fixtures/env.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
import { expectUntouchedPaidOrder, fullLifecycleActivity, orderLifecycleStages } from './order-lifecycle.js';

const canRun = process.env.RUN_ADMIN_DESTRUCTIVE_E2E === 'true';
const seedOrderNumber = process.env.ADMIN_E2E_ORDER_NO?.trim();

// Playwright's failure screenshots and traces cover every page in the worker, the admin panel's
// included, so they are off for the whole file -- see adminPage in admin-test.ts, which enforces it.
// The customer's side still gets its failure video and error context.
test.use({ screenshot: 'off', trace: 'off' });

/**
 * The order lifecycle in order-lifecycle.ts, run on an order the seeded member already placed.
 *
 * ADMIN_E2E_ORDER_NO names a paid order the seeded member already placed, with exactly one
 * item awaiting its design file. Each run consumes one, taking it all the way to order completion.
 * MS-ADMO-019 runs the same lifecycle on an order it places itself, and checks the emails.
 *
 * Changes real (dev) data and emails the seeded member at each notification step, so it is gated on
 * RUN_ADMIN_DESTRUCTIVE_E2E and refuses every environment but dev-1.
 */
test.describe('Order processing', { tag: ['@admin', '@e2e', '@destructive', '@slow', '@credentialed'] }, () => {
  test.use({
    asMember: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientApiCorsFailures: true
  });

  test.skip(!canRun, 'Changes and completes a real dev order. Set RUN_ADMIN_DESTRUCTIVE_E2E=true to run it.');
  test.skip(
    activeEnvironment !== 'dev-1',
    `Order-processing changes run on dev-1 only (this run: ${activeEnvironment ?? 'unknown'}).`
  );
  test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);

  test('MS-ADMO-001 artwork review, customer proof approval, production and delivery', async ({
    page,
    adminPage,
    adminApi
  }) => {
    test.skip(
      !seedOrderNumber,
      'This journey needs a seeded order. Set ADMIN_E2E_ORDER_NO ' +
        'to a paid order of the seeded member with one item at 디자인 파일 미제출.'
    );
    // Eleven hand-offs between two apps, each waiting on a real server round trip.
    test.setTimeout(8 * 60_000);

    const orderNumber = seedOrderNumber!;
    const facts = {
      orderNumber,
      rejectionFeedback: `QA automation ${Date.now()}: resolution too low, please upload a higher-resolution file.`,
      proofMessage: `QA automation proof for ${orderNumber}.`,
      trackingNumber: qaTrackingNumber()
    };

    const { orderId, cartItemId } = await test.step('the seed order is the member’s, paid, and untouched', () =>
      expectUntouchedPaidOrder(adminApi, orderNumber, env.AUTH_TEST_EMAIL!)
    );

    for (const stage of orderLifecycleStages({ page, adminPage, adminApi, orderId, facts })) {
      await test.step(stage.title, stage.run);
    }

    await test.step('the activity log holds the whole lifecycle, in order', async () => {
      const codes = (await adminApi.activity(cartItemId)).map((entry) => entry.item_status.code).reverse();
      expect(codes).toEqual(fullLifecycleActivity);
    });
  });
});
