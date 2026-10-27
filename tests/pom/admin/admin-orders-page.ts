import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { adminCopy } from '../../fixtures/admin-data.js';
import { waitForNuxtHydration } from '../../fixtures/hydration.js';

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

  /**
   * Waits for hydration and for the tab's first list response. Searching any earlier loses the
   * search: the initial unfiltered response lands after it and replaces the filtered rows (seen on
   * dev-1, 2026-10-27, as 1 expected row turning into 5, then 10).
   */
  async goto(): Promise<void> {
    const firstList = this.page.waitForResponse((response) => /\/orders\/admin\/list\?/.test(response.url()));
    await this.page.goto('/orders');
    await expect(this.page).toHaveURL(/\/orders\?tab=/);
    await expect(this.searchInput).toBeVisible();
    await waitForNuxtHydration(this.page);
    await firstList;
  }

  /** A status tab, by its Korean label. Its text is the label followed by the order count. */
  statusTab(label: string): Locator {
    return this.page.locator('main button.m-tab').filter({ hasText: label });
  }

  async tabCount(label: string): Promise<number> {
    const text = await this.statusTab(label).innerText();
    return Number(text.replace(label, '').replace(/[^\d]/g, ''));
  }

  async selectTab(label: string, code: string): Promise<void> {
    await this.statusTab(label).click();
    await expect(this.page).toHaveURL(new RegExp(`[?&]tab=${code}(?:&|$)`));
    await expect(this.statusTab(label)).toHaveClass(/is-selected/);
  }

  /**
   * The rows on screen. The table always holds a hidden "No results found" row, so an unfiltered
   * count is one too many.
   */
  visibleRows(): Locator {
    return this.rows.filter({ visible: true });
  }

  /** Search applies on Enter, and only within the selected tab. Resolves once its results arrive. */
  async search(term: string): Promise<void> {
    const results = this.page.waitForResponse(
      (response) => /\/orders\/admin\/list\?/.test(response.url()) && response.url().includes(encodeURIComponent(term))
    );
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await results;
  }

  /** The priority star. A div, not a button: it has no role and is not keyboard reachable. */
  starIcon(orderNumber: string): Locator {
    return this.visibleRows().filter({ hasText: orderNumber }).locator('.star-icon');
  }

  /** Searches, clicks the one matching row, and returns the order id from the detail URL. */
  async openOrder(orderNumber: string): Promise<number> {
    // Search applies on Enter, and only within the selected tab -- the default 제작 전 tab, which is
    // where an order under test starts.
    await this.search(orderNumber);

    const row = this.rows.filter({ hasText: orderNumber });
    await expect(row).toHaveCount(1, { timeout: 20_000 });
    await row.getByText(orderNumber, { exact: true }).click();

    await expect(this.page).toHaveURL(/\/orders\/\d+$/, { timeout: 20_000 });
    return Number(new URL(this.page.url()).pathname.split('/').pop());
  }
}
