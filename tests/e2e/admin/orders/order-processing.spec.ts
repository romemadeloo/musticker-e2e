import path from 'node:path';

import { orderStatus, itemStatus, adminCopy, qaTrackingNumber } from '../../../fixtures/admin-data.js';
import { expect, test } from '../../../fixtures/admin-test.js';
import { activeEnvironment, env } from '../../../fixtures/env.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
import { AccountOrderDetail } from '../../../pom/storefront/account-order-detail.js';
import { AdminOrderDetailPage } from '../../../pom/admin/admin-order-detail-page.js';
import { AdminOrdersPage } from '../../../pom/admin/admin-orders-page.js';

const canRun = process.env.RUN_ADMIN_DESTRUCTIVE_E2E === 'true';
const seedOrderNumber = process.env.ADMIN_E2E_ORDER_NO?.trim();

// Playwright's failure screenshots and traces cover every page in the worker, the admin panel's
// included, so they are off for the whole file -- see adminPage in admin-test.ts, which enforces it.
// The customer's side still gets its failure video and error context.
test.use({ screenshot: 'off', trace: 'off' });

const designFile = path.resolve('tests/fixtures/files/sample-design.png');
const proofFile = path.resolve('tests/fixtures/files/qa-proof.png');

/**
 * One order, end to end across both apps: the customer sends artwork from the storefront, staff
 * reject it, the customer resubmits, staff pass it and send a proof, the customer approves the
 * proof, and staff take the order through printing and shipping to delivered.
 *
 * Walked by hand on dev-1 on 2026-09-25 (AO-2609240008-dev, AO-2609250005-dev) before
 * this was written, and re-run on 2026-10-14 (AO-2609180003-dev, AO-2609090017-dev) after the
 * product changes noted below. Every stage is asserted three ways where it can be: the admin UI, the customer's
 * UI, and the admin API's activity log.
 *
 * ADMIN_E2E_ORDER_NO names a paid order the seeded member already placed, with exactly one
 * item awaiting its design file. Each run consumes one, taking it all the way to order completion.
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
    const rejectionFeedback = `QA automation ${Date.now()}: resolution too low, please upload a higher-resolution file.`;
    const proofMessage = `QA automation proof for ${orderNumber}.`;
    const trackingNumber = qaTrackingNumber();

    const customer = new AccountOrderDetail(page);
    const adminOrders = new AdminOrdersPage(adminPage);
    const adminOrder = new AdminOrderDetailPage(adminPage);

    const { orderId, cartItemId } = await test.step('the seed order is the member’s, paid, and untouched', async () => {
      const order = await adminApi.findOrder(orderNumber);
      expect(order.customer_details.email, 'seed order belongs to another customer').toBe(env.AUTH_TEST_EMAIL);
      expect(order.order_status.code, 'seed order has already moved past 제작 전').toBe(orderStatus.beforeProduction.code);
      expect(order.payment_status.code, 'seed order is not fully paid').toBe('PD');
      expect(order.items_count, 'this spec handles single-item orders only').toBe(1);

      const [item] = await adminApi.items(order.id);
      expect(item.status.id, `seed item is at ${item.status.translated ?? item.status.name}, not 디자인 파일 미제출`).toBe(
        itemStatus.lackingArtwork.id
      );

      return { orderId: order.id, cartItemId: item.cart_item_id };
    });

    await test.step('customer: the order detail matches what the admin panel holds', async () => {
      const [item] = await adminApi.items(orderId);
      await customer.open(orderNumber);
      await customer.expectOrderStatus(orderStatus.beforeProduction.label);
      await customer.expectItemStatus(itemStatus.lackingArtwork.label);
      await expect(customer.pane).toContainText(item.product.translated);
      await expect(customer.pane).toContainText(`${Number(item.size.width)}x${Number(item.size.height)}mm`);
      await expect(customer.pane).toContainText(`${item.quantity}개`);
      await expect(customer.pane).toContainText(`${item.cost.toLocaleString('ko-KR')}원`);
    });

    await test.step('customer: sends the design file', async () => {
      await customer.uploadDesign(designFile);
      await customer.expectItemStatus(itemStatus.artworkSubmitted.label);

      const entry = await adminApi.expectItemStatus(orderId, itemStatus.artworkSubmitted.code);
      expect(entry.user?.is_admin, 'the upload was attributed to staff').toBe(false);
      expect(entry.file_name).toBe(path.basename(designFile));
    });

    await test.step('admin: finds the order and rejects the file with feedback', async () => {
      await adminOrders.goto();
      expect(await adminOrders.openOrder(orderNumber)).toBe(orderId);
      await adminOrder.expectOrder(orderNumber, orderStatus.beforeProduction.label);
      await adminOrder.expectItemStatus(itemStatus.artworkSubmitted.label);

      const drawer = await adminOrder.openItem();
      await drawer.expectArtworkFile(path.basename(designFile));
      await drawer.evaluate({ passed: false, feedback: rejectionFeedback });
      await drawer.expectStatus(itemStatus.evaluationFailed.label);

      const entry = await adminApi.expectItemStatus(orderId, itemStatus.evaluationFailed.code);
      expect(entry.message?.content).toBe(rejectionFeedback);
    });

    await test.step('customer: sees the rejection and its reason, and resubmits', async () => {
      await customer.open(orderNumber);
      await customer.expectItemStatus(itemStatus.evaluationFailed.label);
      await customer.uploadDesign(designFile, { resubmit: true, expectFeedback: rejectionFeedback });
      await customer.expectItemStatus(itemStatus.artworkSubmitted.label);

      const entry = await adminApi.expectItemStatus(orderId, itemStatus.artworkSubmitted.code);
      expect(entry.event).toBe('artwork-updated');
    });

    await test.step('admin: passes the resubmitted file and sends the final proof', async () => {
      await adminOrder.goto(orderId);
      let drawer = await adminOrder.openItem();
      await drawer.evaluate({ passed: true });
      await drawer.expectStatus(itemStatus.evaluationPassed.label);
      await adminApi.expectItemStatus(orderId, itemStatus.evaluationPassed.code);

      // Reopened so the drawer renders the proof form the passed stage brings.
      await adminOrder.goto(orderId);
      drawer = await adminOrder.openItem();
      await drawer.sendFinalProof(proofFile, proofMessage);
      await drawer.expectStatus(itemStatus.needsApproval.label);
      await adminApi.expectItemStatus(orderId, itemStatus.needsApproval.code);
    });

    await test.step('customer: approves the proof', async () => {
      await customer.open(orderNumber);
      await customer.expectItemStatus(itemStatus.needsApproval.label);
      await customer.approveProof(path.basename(proofFile));
      await customer.expectItemStatus(itemStatus.approvedAwaitingProduction.label);

      const entry = await adminApi.expectItemStatus(orderId, itemStatus.approvedAwaitingProduction.code);
      expect(entry.user?.is_admin, 'the approval was attributed to staff').toBe(false);
      // The confirm dialog now says approval moves the order to 제작 대기 (it promised '제작 진행' until
      // MUS-QA-004 was fixed), and production waits for staff: the order itself stays at 제작 전.
      await adminApi.expectOrderStatus(orderId, orderStatus.beforeProduction.code);
      await customer.expectOrderStatus(orderStatus.beforeProduction.label);
    });

    // From here on the activity log attributes every staff action to the customer (is_admin=false),
    // reported 2026-09-25 -- so attribution is only asserted on the customer's own steps above.
    // Move to Production was dropped by 2026-10-14: Mark as Printing is now the first staff action after
    // approval and takes the order to 제작 진행 중 and the item straight to 인쇄 진행 중 (no 주문 준비 중).
    await test.step('admin: sends the approved order to print', async () => {
      await adminOrder.goto(orderId);
      await adminOrder.runHeaderAction(adminCopy.markAsPrinting);
      await adminApi.expectOrderStatus(orderId, orderStatus.forProduction.code);
      await adminApi.expectItemStatus(orderId, itemStatus.printing.code);
      await adminOrder.expectItemStatus(itemStatus.printing.label);
    });

    await test.step('admin: ships with a tracking number and marks it delivered', async () => {
      await adminOrder.addTracking(trackingNumber);
      await adminApi.expectOrderStatus(orderId, orderStatus.shipping.code);
      await adminApi.expectItemStatus(orderId, itemStatus.readyToShip.code);

      await adminOrder.sendTracking();
      await adminApi.expectItemStatus(orderId, itemStatus.onDelivery.code);

      await adminOrder.markDelivered();
      await adminApi.expectOrderStatus(orderId, orderStatus.completed.code);
      await adminApi.expectItemStatus(orderId, itemStatus.delivered.code);

      const [tracking] = await adminApi.tracking(orderId);
      expect(tracking.tracking_number).toBe(trackingNumber);
      expect(tracking.tracking_status).toBe('completed');
    });

    await test.step('customer: sees the order delivered, with the tracking number', async () => {
      await customer.open(orderNumber);
      await customer.expectOrderStatus(orderStatus.completed.label);
      await customer.expectItemStatus(itemStatus.delivered.label);
      await customer.expectTrackingNumber(trackingNumber);
    });

    await test.step('the activity log holds the whole lifecycle, in order', async () => {
      const codes = (await adminApi.activity(cartItemId)).map((entry) => entry.item_status.code).reverse();
      expect(codes).toEqual([
        itemStatus.artworkSubmitted.code,
        itemStatus.checkingArtwork.code,
        itemStatus.evaluationFailed.code,
        itemStatus.artworkSubmitted.code,
        itemStatus.checkingArtwork.code,
        itemStatus.evaluationPassed.code,
        itemStatus.needsApproval.code,
        itemStatus.approvedAwaitingProduction.code,
        itemStatus.printing.code,
        itemStatus.readyToShip.code,
        itemStatus.onDelivery.code,
        itemStatus.delivered.code
      ]);
    });
  });
});
