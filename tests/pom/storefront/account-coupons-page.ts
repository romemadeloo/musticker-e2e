import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { accountCopy, accountMenuSections } from '../../fixtures/storefront-data.js';
import { AccountShell } from './account-shell.js';

const copy = accountCopy.coupons;

/**
 * `/kr/account/coupons` -- the member's coupons and the 쿠폰 등록 (claim a code) box.
 *
 * Verified live against dev-1 on 2026-11-02. Only the page and its content wrapper carry test ids;
 * the coupon rows are `.item` under `.main__card .list`, each with its name, an `h6.item__code`
 * heading, an expiry date and a 1회 사용 / 다회 사용 badge. A coupon that can no longer be used is
 * still listed, greyed out with `.disabled`.
 *
 * 쿠폰 등록 always calls `POST /sys/kr/coupon/claim`, which answers HTTP 200 with the refusal in the
 * body for a blank or unknown code; the page shows it as an alert above the list. A refused claim
 * changes nothing, which is what makes the negative case safe to run on production.
 */
export class AccountCouponsPage {
  readonly page: Page;
  readonly shell: AccountShell;
  readonly root: Locator;
  readonly codeInput: Locator;
  readonly registerButton: Locator;
  readonly alert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shell = new AccountShell(page);
    this.root = page.getByTestId('account-coupons-page');
    this.codeInput = this.root.getByPlaceholder(copy.codeInputPlaceholder);
    this.registerButton = this.root.getByRole('button', { name: copy.registerButton, exact: true });
    this.alert = this.root.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.shell.goto(accountMenuSections.find((section) => section.key === 'coupons')!, [/\/sys\/kr\/coupon(?:\?|$)/]);
    // Not the 쿠폰 heading: dev-1 renders one, production (2026-11-02) does not.
    await expect(this.registerButton).toBeVisible();
  }

  couponRows(): Locator {
    return this.root.locator('.main__card .list .item');
  }

  async captureCodes(): Promise<string[]> {
    const codes = await this.couponRows().locator('.item__code').allInnerTexts();
    return codes.map((code) => code.trim());
  }

  async claim(code: string): Promise<void> {
    const claim = this.page.waitForResponse((response) => response.url().includes('/sys/kr/coupon/claim'), {
      timeout: 30_000
    });
    await this.codeInput.fill(code);
    await this.registerButton.click();
    await claim;
  }
}
