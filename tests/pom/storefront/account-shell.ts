import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../../fixtures/env.js';
import { waitForNuxtHydration } from '../../fixtures/hydration.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import type { AccountMenuSection } from '../../fixtures/storefront-data.js';

/**
 * The member account shell every `/kr/account/*` page renders around its section: the summary strip
 * (name, tier, order / point / coupon counts, total spent) and the six-section menu.
 *
 * Verified live against dev-1 on 2026-11-02. Every piece carries a test id: `account-shell-stat-<name>`
 * for the counts, `account-shell-tab-<key>` for the menu links, and `account-<key>-page` for the
 * section the link opens. The selected link carries `aria-current="page"`.
 */
export class AccountShell {
  readonly page: Page;
  readonly root: Locator;
  readonly user: Locator;
  readonly tabs: Locator;
  readonly ordersStat: Locator;
  readonly pointsStat: Locator;
  readonly couponsStat: Locator;
  readonly totalSpentStat: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByTestId('account-shell');
    this.user = page.getByTestId('account-shell-user');
    this.tabs = page.getByTestId('account-shell-tabs');
    this.ordersStat = page.getByTestId('account-shell-stat-orders');
    this.pointsStat = page.getByTestId('account-shell-stat-points');
    this.couponsStat = page.getByTestId('account-shell-stat-coupons');
    this.totalSpentStat = page.getByTestId('account-shell-stat-total-spent');
  }

  tab(section: AccountMenuSection): Locator {
    return this.page.getByTestId(`account-shell-tab-${section.key}`);
  }

  sectionPage(section: AccountMenuSection): Locator {
    return this.page.getByTestId(`account-${section.key}-page`);
  }

  /**
   * Opens a section directly. Each section fetches its list after the shell renders, so a page that
   * counts rows passes the list request(s) to wait for -- an empty list has no element of its own
   * that could be waited on instead.
   */
  async goto(section: AccountMenuSection, dataRequests: RegExp[] = []): Promise<void> {
    // `response` fires on the headers; the page only has the data once the body has arrived.
    const loaded = dataRequests.map((pattern) =>
      this.page
        .waitForResponse((response) => pattern.test(response.url()), { timeout: 45_000 })
        .then((response) => response.finished())
    );
    await gotoStorefront(this.page, appPath(`./${section.path}`));
    await expect(this.root).toBeVisible();
    await waitForNuxtHydration(this.page);
    await expect(this.sectionPage(section)).toBeVisible();
    await Promise.all(loaded);
    await settleRender(this.page);
  }

  async open(section: AccountMenuSection): Promise<void> {
    await this.tab(section).click();
    await expect(this.page).toHaveURL(new RegExp(`/kr/${section.path}(?:[/?#]|$)`), { timeout: 20_000 });
    await expect(this.sectionPage(section)).toBeVisible({ timeout: 20_000 });
  }

  async expectSelected(section: AccountMenuSection): Promise<void> {
    await expect(this.tab(section)).toHaveAttribute('aria-current', 'page');
    await expect(this.tabs.locator('[aria-current="page"]')).toHaveCount(1);
  }

  /** The number a summary stat shows, with its label and thousands separators stripped. */
  async statValue(stat: Locator): Promise<number> {
    await expect(stat).toHaveText(/\d/);
    return parseCount(await stat.innerText());
  }
}

/** Lets Vue paint what the last response gave it: two animation frames cover the patch and the paint. */
export async function settleRender(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

/** Reads the first number in a string, ignoring thousands separators ("98,147,874 포인트" -> 98147874). */
export function parseCount(text: string): number {
  const match = text.replace(/,/g, '').match(/-?\d+/);
  expect(match, `no number in "${text.replace(/\s+/g, ' ')}"`).toBeTruthy();
  return Number(match![0]);
}
