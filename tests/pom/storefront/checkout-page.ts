import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../fixtures/env.js';
import { parseWon } from '../fixtures/money.js';
import { gotoStorefront } from '../fixtures/navigation.js';
import { checkoutSummaryLabels, freeShippingThresholdWon, ko } from '../fixtures/storefront-data.js';

/**
 * The order-summary block, as numbers. Discounts are reported as the positive amount deducted, not
 * as the negative the page renders, so the identity below reads the way the receipt does.
 */
export type OrderSummary = {
  subtotal: number;
  shippingFee: number;
  /** Points + coupon discounts combined, as a positive deduction. */
  discounts: number;
  total: number;
  /** Every row in render order, for failure messages and for spotting a new row appearing. */
  rows: ReadonlyArray<{ label: string; amount: number }>;
};

export class CheckoutV2Page {
  readonly page: Page;
  readonly payButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.payButton = page.getByRole('button', { name: ko.payNow });
  }

  async goto(): Promise<void> {
    await gotoStorefront(this.page, appPath('./checkout'));
    await expect(this.page.locator('body')).toContainText(ko.secureCheckout);
  }

  /**
   * Reads the order summary once the async shipping-cost recalculation has settled.
   *
   * The shipping-fee and total rows render as `.ui-skeleton` placeholders while that call is in
   * flight, so reading immediately yields a partial summary that does not add up. Verified against
   * development-1 on 2026-08-27: 소계 18,700원 + 배송비 3,000원 = 합계 21,700원.
   */
  async captureOrderSummary(): Promise<OrderSummary> {
    const lines = this.page.locator('.checkout-summary-line');

    await expect(lines.first()).toBeVisible();
    await expect(this.page.locator('.checkout-summary-line .ui-skeleton')).toHaveCount(0, { timeout: 30_000 });

    const rows: Array<{ label: string; amount: number }> = [];
    const lineCount = await lines.count();

    for (let index = 0; index < lineCount; index += 1) {
      const line = lines.nth(index);
      // The 배송비 label carries a tooltip trigger button; its accessible name is not part of the
      // label's own text, so innerText is still just the label.
      const label = (await line.locator('.checkout-summary-line-label').innerText()).trim();
      rows.push({ label, amount: parseWon(await line.locator('.checkout-summary-line-value').innerText()) });
    }

    const amountOf = (label: string): number => {
      const row = rows.find((candidate) => candidate.label === label);

      if (!row) {
        throw new Error(
          `Checkout summary has no "${label}" row. Rows present: ${rows.map((r) => r.label).join(', ')}.`
        );
      }

      return row.amount;
    };

    const pointsDiscount = amountOf(checkoutSummaryLabels.pointsDiscount);
    const couponDiscount = amountOf(checkoutSummaryLabels.couponDiscount);

    return {
      subtotal: amountOf(checkoutSummaryLabels.subtotal),
      shippingFee: amountOf(checkoutSummaryLabels.shipping),
      // Rendered negative; reported here as the positive deduction.
      discounts: -(pointsDiscount + couponDiscount),
      total: amountOf(checkoutSummaryLabels.total),
      rows
    };
  }

  /**
   * The receipt has to add up. This is the one assertion that catches a summary which shows plausible
   * individual figures whose total is wrong -- the failure mode no per-row check can see.
   */
  async expectSummaryReconciles(): Promise<OrderSummary> {
    const summary = await this.captureOrderSummary();

    expect(
      summary.subtotal + summary.shippingFee - summary.discounts,
      `Checkout summary must add up. Rows: ${summary.rows.map((row) => `${row.label}=${row.amount}`).join(', ')}`
    ).toBe(summary.total);

    return summary;
  }

  /**
   * Asserts the shipping fee matches the 5만원 이상 무료배송 promise the product pages make: free at or
   * above the threshold, charged below it.
   */
  async expectShippingFeeFollowsThreshold(): Promise<OrderSummary> {
    const summary = await this.expectSummaryReconciles();

    if (summary.subtotal >= freeShippingThresholdWon) {
      expect(
        summary.shippingFee,
        `A ${summary.subtotal}원 order is at or above the ${freeShippingThresholdWon}원 free-shipping threshold and must ship free`
      ).toBe(0);
    } else {
      expect(
        summary.shippingFee,
        `A ${summary.subtotal}원 order is below the ${freeShippingThresholdWon}원 free-shipping threshold and must be charged shipping`
      ).toBeGreaterThan(0);
    }

    return summary;
  }

  async expectCheckoutFormRenders(): Promise<void> {
    const body = this.page.locator('body');

    await expect(this.page.getByPlaceholder(ko.checkoutEmailPlaceholder).first()).toBeVisible();
    await expect(this.page.getByPlaceholder(ko.checkoutNamePlaceholder).first()).toBeVisible();
    await expect(this.page.getByPlaceholder(ko.checkoutPostalCodePlaceholder).first()).toBeVisible();
    await expect(this.page.getByRole('button', { name: '카카오페이' }).first()).toBeVisible();
    await expect(this.page.getByRole('button', { name: '신용카드' }).first()).toBeVisible();
    await expect(body).toContainText(ko.coupon);
    await expect(this.payButton).toBeVisible();
  }

  // No coupon-code input was found on the anonymous checkout page as of 2026-08-11 (only a
  // static "coupon discount" summary line). This asserts the safer, verified behavior instead:
  // submitting with required shipping/contact fields blank must not create an order or advance
  // past the payment step. Confirmed via network capture that no order/payment-mutating request
  // fires on a blank submit attempt, so that absence is the assertion instead of a specific
  // validation-message locator (the page renders 14 `.error-text` nodes at all times, most
  // hidden, which made a "some error text is visible" check unreliable).
  async expectBlankSubmissionBlocked(): Promise<void> {
    const orderMutationRequests: string[] = [];
    this.page.on('request', (request) => {
      if (request.method() !== 'GET' && /\/sys\/kr\/(?:order|payment|checkout)\//i.test(request.url())) {
        orderMutationRequests.push(`${request.method()} ${request.url()}`);
      }
    });

    await this.payButton.click();
    await this.page.waitForTimeout(1_000);

    await expect(this.page).toHaveURL(/\/kr\/checkout\/?$/);
    await expect(this.payButton).toBeVisible();
    expect(orderMutationRequests, 'blank submission should not create an order or payment').toEqual([]);
  }

  // Filling the guest email immediately fires a verification-email send and opens a full-page
  // `.auth-verification-modal` overlay that blocks every other checkout control (including the
  // payment-method tiles and pay button) until the OTP is entered. Verified live on
  // development-3 on 2026-08-13.
  async fillGuestEmailAndAwaitOtpModal(email: string): Promise<void> {
    // `input[type="email"]` alone can match a second, hidden email input elsewhere on the page
    // (e.g. an inquiry dialog) depending on hydration timing, so scope to the visible checkout
    // field the same way expectCheckoutFormRenders does.
    const emailInput = this.page.getByPlaceholder(ko.checkoutEmailPlaceholder).first();

    // A Vue hydration race (or a delayed guest-session restore) can silently wipe a fill some time
    // after it lands, leaving the input empty with no error. Wait past that window and re-check
    // before trusting the value, retrying the whole fill if it got reset.
    await expect(async () => {
      await emailInput.fill(email);
      await emailInput.blur();
      await this.page.waitForTimeout(3_000);
      await expect(emailInput).toHaveValue(email, { timeout: 2_000 });
    }).toPass({ timeout: 30_000 });

    await expect(this.page.locator('.auth-verification-modal')).toBeVisible({ timeout: 20_000 });
  }

  async submitOtpCode(code: string): Promise<void> {
    const modal = this.page.locator('.auth-verification-modal');
    const inputs = modal.locator('input');
    const digits = code.split('');

    for (let index = 0; index < digits.length; index += 1) {
      await inputs.nth(index).fill(digits[index]);
    }

    await modal.getByRole('button', { name: ko.otpConfirm }).click();
    await expect(modal).toBeHidden({ timeout: 10_000 });
  }

  async fillShippingDetails(details: {
    fullName: string;
    postalCode: string;
    phone: readonly [string, string, string];
    province: string;
    city: string;
    streetAddress: string;
    detailAddress: string;
  }): Promise<void> {
    await this.page.getByPlaceholder(ko.checkoutNamePlaceholder).fill(details.fullName);
    await this.page.getByPlaceholder(ko.checkoutPostalCodePlaceholder).fill(details.postalCode);
    await this.page.locator('input[name="phone-1"]').fill(details.phone[0]);
    await this.page.locator('input[name="phone-2"]').fill(details.phone[1]);
    await this.page.locator('input[name="phone-3"]').fill(details.phone[2]);
    await this.page.getByPlaceholder('시/도를 입력하세요').fill(details.province);
    await this.page.getByPlaceholder('시/군/구를 입력하세요').fill(details.city);
    await this.page.getByPlaceholder('주소를 입력해주세요', { exact: true }).fill(details.streetAddress);
    await this.page.getByPlaceholder('상세 주소를 입력해주세요').fill(details.detailAddress);
  }

  async selectKakaoPay(): Promise<void> {
    await this.page.getByText(ko.kakaoPay, { exact: false }).first().click();
  }

  // The pay button opens the KakaoPay gateway (a real "PayApp — Local Mock" sandbox page on dev
  // environments) in a popup window.
  async submitPaymentAndAwaitPayAppPopup(): Promise<Page> {
    // The pay button carries a real `disabled` attribute, and the order-summary shipping-fee/total
    // rows render as `.ui-skeleton` placeholders, until an async shipping-cost recalculation
    // (triggered by the address fields) finishes. Clicking while that's in flight is a silent
    // no-op (no popup, no error) rather than a rejected click, so wait for both signals to clear
    // first instead of relying on click()'s own actionability retry.
    await expect(this.page.locator('.checkout-summary-line .ui-skeleton')).toHaveCount(0, { timeout: 30_000 });
    await expect(this.payButton).toBeEnabled({ timeout: 30_000 });

    const [popup] = await Promise.all([this.page.waitForEvent('popup', { timeout: 30_000 }), this.payButton.click()]);
    return popup;
  }

  // Clicking the mock's "Complete card payment" button closes the popup itself and fires the
  // payment webhook that redirects the original checkout tab to the order-confirmation page.
  async completePayAppMockCardPayment(popup: Page): Promise<void> {
    await popup.getByRole('button', { name: 'Complete card payment' }).click();
    await popup.waitForEvent('close', { timeout: 15_000 }).catch(() => undefined);
  }
}
