import path from 'node:path';

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { orderStatus, itemStatus, adminCopy } from '../../../fixtures/admin-data.js';
import type { AdminApi } from '../../../fixtures/admin-api.js';
import type { OrderEmailStep } from '../../../fixtures/order-emails.js';
import { AccountOrderDetail } from '../../../pom/storefront/account-order-detail.js';
import { AdminOrderDetailPage } from '../../../pom/admin/admin-order-detail-page.js';
import { AdminOrdersPage } from '../../../pom/admin/admin-orders-page.js';

export const designFile = path.resolve('tests/fixtures/files/sample-design.png');
export const proofFile = path.resolve('tests/fixtures/files/qa-proof.png');

/** What a run of the lifecycle writes into the order, so the emails it sends can be checked for it. */
export type OrderJourneyFacts = {
  orderNumber: string;
  rejectionFeedback: string;
  proofMessage: string;
  trackingNumber: string;
};

export type OrderLifecycleContext = {
  page: Page;
  adminPage: Page;
  adminApi: AdminApi;
  orderId: number;
  facts: OrderJourneyFacts;
};

export type OrderLifecycleStage = {
  /** Also the step's key in customerOrderEmails. */
  key: Exclude<OrderEmailStep, 'registration' | 'checkout'>;
  title: string;
  run: () => Promise<void>;
};

/**
 * One single-item order, end to end across both apps: the customer sends artwork from the
 * storefront, staff reject it, the customer resubmits, staff pass it and send a proof, the customer
 * approves the proof, and staff take the order through printing and shipping to delivered.
 *
 * Shared by MS-ADMO-001 (the seeded member's order) and MS-ADMO-019 (a new member's order, with every
 * email checked). Returned as separate stages, one action each, so a caller can check what each one
 * sent before the next runs. `page` must be signed in as the order's customer, the order must be
 * paid, at 제작 전, with its one item at 디자인 파일 미제출.
 *
 * Walked by hand on dev-1 on 2026-09-25 (AO-2609240008-dev, AO-2609250005-dev), and re-run on
 * 2026-10-14 (AO-2609180003-dev, AO-2609090017-dev) after the product changes noted below. Every
 * stage is asserted three ways where it can be: the admin UI, the customer's UI, and the admin API's
 * activity log.
 */
export function orderLifecycleStages({ page, adminPage, adminApi, orderId, facts }: OrderLifecycleContext): OrderLifecycleStage[] {
  const { orderNumber, rejectionFeedback, proofMessage, trackingNumber } = facts;
  const customer = new AccountOrderDetail(page);
  const adminOrders = new AdminOrdersPage(adminPage);
  const adminOrder = new AdminOrderDetailPage(adminPage);

  return [
    {
      key: 'customerReviewsOrder',
      title: 'customer: the order detail matches what the admin panel holds',
      run: async () => {
        const [item] = await adminApi.items(orderId);
        await customer.open(orderNumber);
        await customer.expectOrderStatus(orderStatus.beforeProduction.label);
        await customer.expectItemStatus(itemStatus.lackingArtwork.label);
        await expect(customer.pane).toContainText(item.product.translated);
        await expect(customer.pane).toContainText(`${Number(item.size.width)}x${Number(item.size.height)}mm`);
        await expect(customer.pane).toContainText(`${item.quantity}개`);
        await expect(customer.pane).toContainText(`${item.cost.toLocaleString('ko-KR')}원`);
      }
    },
    {
      key: 'customerSendsDesign',
      title: 'customer: sends the design file',
      run: async () => {
        await customer.uploadDesign(designFile);
        await customer.expectItemStatus(itemStatus.artworkSubmitted.label);

        const entry = await adminApi.expectItemStatus(orderId, itemStatus.artworkSubmitted.code);
        expect(entry.user?.is_admin, 'the upload was attributed to staff').toBe(false);
        expect(entry.file_name).toBe(path.basename(designFile));
      }
    },
    {
      key: 'adminRejectsDesign',
      title: 'admin: finds the order and rejects the file with feedback',
      run: async () => {
        await adminOrders.goto();
        // openOrder() searches and navigates -- an action, not a read, so it must run exactly once.
        expect(await adminOrders.openOrder(orderNumber)).toBe(orderId);
        await adminOrder.expectOrder(orderNumber, orderStatus.beforeProduction.label);
        await adminOrder.expectItemStatus(itemStatus.artworkSubmitted.label);

        const drawer = await adminOrder.openItem();
        await drawer.expectArtworkFile(path.basename(designFile));
        await drawer.evaluate({ passed: false, feedback: rejectionFeedback });
        await drawer.expectStatus(itemStatus.evaluationFailed.label);

        const entry = await adminApi.expectItemStatus(orderId, itemStatus.evaluationFailed.code);
        expect(entry.message?.content).toBe(rejectionFeedback);
      }
    },
    {
      key: 'customerResubmitsDesign',
      title: 'customer: sees the rejection and its reason, and resubmits',
      run: async () => {
        await customer.open(orderNumber);
        await customer.expectItemStatus(itemStatus.evaluationFailed.label);
        await customer.uploadDesign(designFile, { resubmit: true, expectFeedback: rejectionFeedback });
        await customer.expectItemStatus(itemStatus.artworkSubmitted.label);

        const entry = await adminApi.expectItemStatus(orderId, itemStatus.artworkSubmitted.code);
        expect(entry.event).toBe('artwork-updated');
      }
    },
    {
      key: 'adminPassesDesign',
      title: 'admin: passes the resubmitted file',
      run: async () => {
        await adminOrder.goto(orderId);
        const drawer = await adminOrder.openItem();
        await drawer.evaluate({ passed: true });
        await drawer.expectStatus(itemStatus.evaluationPassed.label);
        await adminApi.expectItemStatus(orderId, itemStatus.evaluationPassed.code);
      }
    },
    {
      key: 'adminSendsProof',
      title: 'admin: sends the final proof',
      run: async () => {
        // Reopened so the drawer renders the proof form the passed stage brings.
        await adminOrder.goto(orderId);
        const drawer = await adminOrder.openItem();
        await drawer.sendFinalProof(proofFile, proofMessage);
        await drawer.expectStatus(itemStatus.needsApproval.label);
        await adminApi.expectItemStatus(orderId, itemStatus.needsApproval.code);
      }
    },
    {
      key: 'customerApprovesProof',
      title: 'customer: approves the proof',
      run: async () => {
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
      }
    },
    // From here on the activity log attributes every staff action to the customer (is_admin=false),
    // reported 2026-09-25 -- so attribution is only asserted on the customer's own steps above.
    // Move to Production was dropped by 2026-10-14: Mark as Printing is now the first staff action after
    // approval and takes the order to 제작 진행 중 and the item straight to 인쇄 진행 중 (no 주문 준비 중).
    {
      key: 'adminMarksPrinting',
      title: 'admin: sends the approved order to print',
      run: async () => {
        await adminOrder.goto(orderId);
        await adminOrder.runHeaderAction(adminCopy.markAsPrinting);
        await adminApi.expectOrderStatus(orderId, orderStatus.forProduction.code);
        await adminApi.expectItemStatus(orderId, itemStatus.printing.code);
        await adminOrder.expectItemStatus(itemStatus.printing.label);
      }
    },
    {
      key: 'adminAddsTracking',
      title: 'admin: adds a tracking number',
      run: async () => {
        await adminOrder.addTracking(trackingNumber);
        await adminApi.expectOrderStatus(orderId, orderStatus.shipping.code);
        await adminApi.expectItemStatus(orderId, itemStatus.readyToShip.code);
      }
    },
    {
      key: 'adminSendsTracking',
      title: 'admin: sends the tracking details',
      run: async () => {
        await adminOrder.sendTracking();
        await adminApi.expectItemStatus(orderId, itemStatus.onDelivery.code);
      }
    },
    {
      key: 'adminMarksDelivered',
      title: 'admin: marks the order delivered',
      run: async () => {
        await adminOrder.markDelivered();
        await adminApi.expectOrderStatus(orderId, orderStatus.completed.code);
        await adminApi.expectItemStatus(orderId, itemStatus.delivered.code);

        const [tracking] = await adminApi.tracking(orderId);
        expect(tracking.tracking_number).toBe(trackingNumber);
        expect(tracking.tracking_status).toBe('completed');
      }
    },
    {
      key: 'customerSeesDelivered',
      title: 'customer: sees the order delivered, with the tracking number',
      run: async () => {
        await customer.open(orderNumber);
        await customer.expectOrderStatus(orderStatus.completed.label);
        await customer.expectItemStatus(itemStatus.delivered.label);
        await customer.expectTrackingNumber(trackingNumber);
      }
    }
  ];
}

/** The activity log's item-status codes, oldest first, for a run of every stage above. */
export const fullLifecycleActivity = [
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
];

/**
 * The seed checks both journeys start from: the order is the expected customer's, paid, untouched,
 * and single-item. Returns the ids the stages and the activity log need.
 */
export async function expectUntouchedPaidOrder(
  adminApi: AdminApi,
  orderNumber: string,
  customerEmail: string
): Promise<{ orderId: number; cartItemId: number }> {
  const order = await adminApi.findOrder(orderNumber);
  expect(order.customer_details.email, 'the order belongs to another customer').toBe(customerEmail);
  expect(order.order_status.code, 'the order has already moved past 제작 전').toBe(orderStatus.beforeProduction.code);
  expect(order.payment_status.code, 'the order is not fully paid').toBe('PD');
  expect(order.items_count, 'this journey handles single-item orders only').toBe(1);

  const [item] = await adminApi.items(order.id);
  expect(item.status.id, `the item is at ${item.status.translated ?? item.status.name}, not 디자인 파일 미제출`).toBe(
    itemStatus.lackingArtwork.id
  );

  return { orderId: order.id, cartItemId: item.cart_item_id };
}
