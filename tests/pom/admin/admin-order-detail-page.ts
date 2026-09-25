import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { adminCopy } from '../../fixtures/admin-data.js';
import { AdminItemDrawer } from './admin-item-drawer.js';

/**
 * `/orders/<id>` on the admin panel.
 *
 * The forward moves of an order live in the header's single primary action, which changes with the
 * stage -- Move to Production, then Mark as Printing, then Add Tracking Number -- and each asks for
 * confirmation in a modal whose button is "Yes, <action>". The status dropdown next to the order
 * number never moves an order forward; it only offers hold / awaiting reply / cancel.
 *
 * Every confirmation modal is rendered up front and hidden, so role locators (which skip hidden
 * elements) are what keeps a click from landing on a stale copy.
 */
export class AdminOrderDetailPage {
  readonly page: Page;
  readonly title: Locator;
  readonly headerActions: Locator;
  readonly itemRows: Locator;
  readonly trackingCard: Locator;

  constructor(page: Page) {
    this.page = page;
    // Holds the order number and the status label, e.g. "AO-2609250005-dev\n주문 완료".
    this.title = page.locator('[class*="order-header__title"]').first();
    this.headerActions = page.locator('[class*="order-header__actions"]').first();
    this.itemRows = page.locator('.m-dt tbody tr.m-dt-row').filter({ hasText: /Item \d{3}/ });
    this.trackingCard = page.locator('.tracking-card__body').first();
  }

  async goto(orderId: number): Promise<void> {
    await this.page.goto(`/orders/${orderId}`);
    await expect(this.title).toContainText(/AO-/, { timeout: 20_000 });
  }

  async expectOrder(orderNumber: string, statusLabel: string): Promise<void> {
    await expect(this.title).toContainText(orderNumber);
    await expect(this.title).toContainText(statusLabel);
  }

  async expectItemStatus(statusLabel: string, index = 0): Promise<void> {
    await expect(this.itemRows.nth(index)).toContainText(statusLabel, { timeout: 20_000 });
  }

  async openItem(index = 0): Promise<AdminItemDrawer> {
    // The first cell, not the row: the last cell holds the edit/delete icons.
    await this.itemRows.nth(index).locator('td').first().click();
    const drawer = new AdminItemDrawer(this.page);
    await drawer.expectOpen();
    return drawer;
  }

  /** Clicks a header action and confirms it. */
  async runHeaderAction(name: string): Promise<void> {
    await this.headerActions.getByRole('button', { name, exact: true }).click();
    await this.page.getByRole('button', { name: `Yes, ${name}`, exact: true }).click();
    // The header re-renders with the next stage's action once the change lands.
    await expect(this.headerActions.getByRole('button', { name, exact: true })).toBeHidden({ timeout: 20_000 });
  }

  async addTracking(trackingNumber: string): Promise<void> {
    await this.headerActions.getByRole('button', { name: adminCopy.addTrackingNumber, exact: true }).click();

    const dialog = this.page.locator('.add-tracking').filter({ has: this.page.getByRole('button', { name: adminCopy.addTracking }) });
    await expect(dialog).toBeVisible();
    // The courier is preselected from the order's shipping method; the only free-text input is the number.
    await dialog.locator('input[type="text"]').last().fill(trackingNumber);
    await dialog.getByRole('button', { name: adminCopy.addTracking, exact: true }).click();

    await expect(dialog).toContainText(adminCopy.trackingAdded);
    await dialog.getByRole('button', { name: adminCopy.close, exact: true }).click();
    await expect(dialog).toBeHidden();
  }

  /** Emails the customer the tracking number -- the step that moves the item to 배송 중. */
  async sendTracking(): Promise<void> {
    await this.trackingCard.getByRole('button', { name: adminCopy.sendTracking, exact: true }).click();
    await this.page.getByRole('button', { name: adminCopy.confirmSendTracking, exact: true }).click();
    await expect(this.page.getByText(adminCopy.trackingSent)).toBeVisible({ timeout: 20_000 });
  }

  /** Marks the shipment delivered, dated today (the date picker's default). */
  async markDelivered(): Promise<void> {
    await this.trackingCard.getByRole('button', { name: adminCopy.updateTracking, exact: true }).click();
    const confirm = this.page.getByRole('button', { name: adminCopy.updateTrackingStatus, exact: true });
    await confirm.click();
    await expect(confirm).toBeHidden({ timeout: 20_000 });
  }
}
