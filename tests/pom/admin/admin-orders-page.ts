import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { adminCopy } from '../../fixtures/admin-data.js';

/**
 * `/orders` on the admin panel -- Manage Orders. Tabs by order status, a search box, and a table
 * with one clickable `tr.m-dt-row` per order. Nothing on the panel carries a test id (0 on the
 * page, checked 2026-09-25), so locators are role/placeholder/text based.
 *
 * Opening an order goes through the search, never through a row position: on a shared environment
 * the list order changes under the test, and on production the rows are other customers' orders.
 */
export class AdminOrdersPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder(adminCopy.searchPlaceholder);
    this.rows = page.locator('.m-dt tbody tr.m-dt-row');
  }

  async goto(): Promise<void> {
    await this.page.goto('/orders');
    await expect(this.page).toHaveURL(/\/orders\?tab=/);
    await expect(this.searchInput).toBeVisible();
  }

  /** Searches, clicks the one matching row, and returns the order id from the detail URL. */
  async openOrder(orderNumber: string): Promise<number> {
    // Search applies on Enter, and only within the selected tab -- the default 제작 전 tab, which is
    // where an order under test starts.
    await this.searchInput.fill(orderNumber);
    await this.searchInput.press('Enter');

    const row = this.rows.filter({ hasText: orderNumber });
    await expect(row).toHaveCount(1, { timeout: 20_000 });
    await row.getByText(orderNumber, { exact: true }).click();

    await expect(this.page).toHaveURL(/\/orders\/\d+$/, { timeout: 20_000 });
    return Number(new URL(this.page.url()).pathname.split('/').pop());
  }
}
