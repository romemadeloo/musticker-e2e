import type { Locator, Page, Request } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../../fixtures/env.js';
import { waitForNuxtHydration } from '../../fixtures/hydration.js';
import { parseWon } from '../../fixtures/money.js';
import { checkoutCopy, checkoutPaymentMethods } from '../../fixtures/checkout-data.js';
import type { CheckoutPaymentMethod } from '../../fixtures/checkout-data.js';
import { currentPath, gotoStorefront } from '../../fixtures/navigation.js';
import { locateOrHeal } from '../../fixtures/self-heal.js';
import { checkoutSummaryLabels, checkoutValidationCopy, freeShippingThresholdWon, ko } from '../../fixtures/storefront-data.js';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
   * the dev storefront on 2026-08-27: 소계 18,700원 + 배송비 3,000원 = 합계 21,700원.
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
    await expect(this.page.getByRole('textbox', { name: ko.checkoutPostalCodeLabel, exact: true })).toBeDisabled();
    await expect(this.page.getByRole('button', { name: ko.checkoutAddressSearch, exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: '카카오페이' }).first()).toBeVisible();
    await expect(this.page.getByRole('button', { name: '신용카드' }).first()).toBeVisible();
    await expect(body).toContainText(ko.coupon);
    await expect(this.payButton).toBeVisible();
  }

  // No coupon-code input was found on the anonymous checkout page as of 2026-08-11 (only a
  // static "coupon discount" summary line). This asserts the safer, verified behavior instead:
  // submitting with required shipping/contact fields blank must not create an order or advance
  // past the payment step. Require visible native/ARIA validation or the checkout's actual
  // required-email message; hidden error nodes and an unchanged URL alone cannot prove rejection.
  async expectBlankSubmissionBlocked(): Promise<void> {
    const orderMutationRequests: string[] = [];
    const trackMutation = (request: Request) => {
      if (request.method() !== 'GET' && /\/sys\/kr\/(?:order|payment|checkout)\//i.test(request.url())) {
        orderMutationRequests.push(`${request.method()} ${request.url()}`);
      }
    };
    this.page.on('request', trackMutation);
    try {
      await waitForNuxtHydration(this.page);
      await this.payButton.click();
      const validation = this.page.locator('input:user-invalid:visible, [aria-invalid="true"]:visible')
        .or(this.page.getByText(checkoutValidationCopy.requiredEmail, { exact: true }).filter({ visible: true }));
      await expect(validation.first(), 'Blank checkout must expose visible validation').toBeVisible();
      await expect(this.page).toHaveURL(/\/kr\/checkout\/?$/);
      await expect(this.payButton).toBeVisible();
      expect(orderMutationRequests, 'blank submission should not create an order or payment').toEqual([]);
    } finally {
      this.page.off('request', trackMutation);
    }
  }

  // Filling the guest email immediately fires a verification-email send and opens a full-page
  // `.auth-verification-modal` overlay that blocks every other checkout control (including the
  // payment-method tiles and pay button) until the OTP is entered. Verified live on
  // the dev storefront on 2026-08-13.
  //
  // No longer true since the checkout redesign (dev-1, 2026-10-30): blurring the email only calls
  // /auth/checkout/guest/email-check, and verification moved behind 결제하기, into a Cloudflare
  // Turnstile check (.checkout-verification-modal-shell) that never clears in automation. Kept
  // until the step after Turnstile can be observed; see MS-CHK-001.
  async fillGuestEmailAndAwaitOtpModal(email: string): Promise<void> {
    // `input[type="email"]` alone can match a second, hidden email input elsewhere on the page
    // (e.g. an inquiry dialog) depending on hydration timing, so scope to the visible checkout
    // field the same way expectCheckoutFormRenders does.
    const emailInput = this.page.getByPlaceholder(ko.checkoutEmailPlaceholder).first();

    await waitForNuxtHydration(this.page);
    await emailInput.fill(email);
    await emailInput.blur();
    await expect(this.page.locator('.auth-verification-modal')).toBeVisible({ timeout: 20_000 });
    await expect(emailInput).toHaveValue(email);
  }

  // A signed-in member checks out under their account's address: the page has no email field and no
  // verification modal at all, and the shipping section notes the address will be saved for next
  // time. Verified live on dev-1 on 2026-10-28 with a freshly registered member (MS-ADMO-019).
  async expectMemberCheckout(): Promise<void> {
    await waitForNuxtHydration(this.page);
    await expect(this.page.getByPlaceholder(ko.checkoutNamePlaceholder)).toBeVisible({ timeout: 20_000 });
    await expect(this.page.getByText(ko.checkoutAddressSavedNote)).toBeVisible();
    await expect(this.page.getByPlaceholder(ko.checkoutEmailPlaceholder)).toHaveCount(0);
    await expect(this.page.locator('.auth-verification-modal')).toHaveCount(0);
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
    phone: readonly [string, string, string];
    addressQuery: string;
    roadAddress: string;
    postalCode: string;
    detailAddress: string;
  }): Promise<void> {
    await this.page.getByPlaceholder(ko.checkoutNamePlaceholder).fill(details.fullName);
    await this.page.locator('input[name="phone-1"]').fill(details.phone[0]);
    await this.page.locator('input[name="phone-2"]').fill(details.phone[1]);
    await this.page.locator('input[name="phone-3"]').fill(details.phone[2]);
    await this.searchAddress(details);
    await this.page.getByPlaceholder(ko.checkoutDetailAddressPlaceholder).fill(details.detailAddress);
  }

  // The postal code and road address can only be set through the Kakao postcode search, which
  // opens in `.kakao-postcode-modal` as an iframe nested inside a blank wrapper iframe. Picking a
  // result closes the modal and fills both read-only fields (verified on dev-1, 2026-10-30).
  async searchAddress(details: { addressQuery: string; roadAddress: string; postalCode: string }): Promise<void> {
    const modal = this.page.locator('.kakao-postcode-modal');
    await this.page.getByRole('button', { name: ko.checkoutAddressSearch, exact: true }).click();
    await expect(modal).toBeVisible();

    const search = modal.frameLocator('iframe').first().frameLocator('iframe').first();
    const query = search.getByRole('textbox').first();
    await query.fill(details.addressQuery);
    await query.press('Enter');
    await search.getByRole('button', { name: details.roadAddress }).first().click();

    await expect(modal).toBeHidden();
    await expect(this.page.getByRole('textbox', { name: ko.checkoutPostalCodeLabel, exact: true })).toHaveValue(details.postalCode);
    await expect(this.page.getByRole('textbox', { name: checkoutCopy.roadAddressLabel, exact: true })).toHaveValue(
      new RegExp(`^${escapeRegExp(details.roadAddress)}`)
    );
  }

  /** Both address fields stay read-only: the search is the only way to set them. */
  async expectAddressFieldsReadOnly(): Promise<void> {
    await expect(this.page.getByRole('textbox', { name: ko.checkoutPostalCodeLabel, exact: true })).toBeDisabled();
    await expect(this.page.getByRole('textbox', { name: checkoutCopy.roadAddressLabel, exact: true })).toBeDisabled();
    await expect(this.page.getByPlaceholder(ko.checkoutDetailAddressPlaceholder)).toBeEditable();
  }

  private paymentSection(): Locator {
    return this.page.getByRole('heading', { name: checkoutCopy.paymentHeading }).locator('..');
  }

  /**
   * One payment option. dev-1 still labels two options the old way, so this falls back to the
   * option's position (the same on both) and records the drift instead of failing on copy.
   */
  async paymentOption(name: CheckoutPaymentMethod): Promise<Locator> {
    const index = checkoutPaymentMethods.findIndex((method) => method.name === name);

    return locateOrHeal({
      preferred: this.paymentSection().getByRole('button', { name: new RegExp(`^${escapeRegExp(name)} `) }),
      stable: this.paymentSection().getByRole('button').nth(index),
      target: `checkout payment option #${index + 1}`,
      expected: name,
      describeActual: (option) => option.innerText()
    });
  }

  async expectPaymentOptions(): Promise<void> {
    await waitForNuxtHydration(this.page);
    await expect(this.paymentSection().getByRole('button')).toHaveCount(checkoutPaymentMethods.length);
    for (const method of checkoutPaymentMethods) {
      await expect(await this.paymentOption(method.name)).toBeVisible();
    }
  }

  /** Selects an option and checks it is the only one pressed: the options behave as a single choice. */
  async selectPaymentMethod(name: CheckoutPaymentMethod): Promise<void> {
    await waitForNuxtHydration(this.page);
    const option = await this.paymentOption(name);
    await option.click();
    await this.expectOnlySelectedPaymentMethod(name);
  }

  async expectOnlySelectedPaymentMethod(name: CheckoutPaymentMethod): Promise<void> {
    await expect(await this.paymentOption(name)).toHaveAttribute('aria-pressed', 'true');
    await expect(this.paymentSection().getByRole('button', { pressed: true })).toHaveCount(1);
  }

  depositorField(): Locator {
    return this.paymentSection().getByRole('textbox', { name: checkoutCopy.depositorLabel });
  }

  async expectDepositorDetails(): Promise<void> {
    await expect(this.depositorField()).toBeVisible();
    await expect(this.paymentSection().getByText(checkoutCopy.depositorNote)).toBeVisible();
    await expect(this.paymentSection().getByRole('img', { name: checkoutCopy.depositBank })).toBeVisible();
  }

  shippingOption(): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^${checkoutCopy.shippingMethod} `) });
  }

  /**
   * The estimated delivery window on the 일반 배송 option, as Seoul calendar dates. The option has no
   * pressed state for assistive technology; it is marked selected only by its is-active class.
   */
  async readEstimatedDelivery(): Promise<{ from: Date; to: Date; fee: number }> {
    const text = await this.shippingOption().innerText();
    const match = text.match(checkoutCopy.estimatedDelivery);
    expect(match, `estimated delivery date in "${text}"`).not.toBeNull();
    const [, year, month, day, endMonth, endDay] = match!.map(Number);
    const from = new Date(Date.UTC(year, month - 1, day));
    let to = new Date(Date.UTC(year, (endMonth || month) - 1, endDay));
    // A window that crosses New Year prints only the start year.
    if (to < from) {
      to = new Date(Date.UTC(year + 1, (endMonth || month) - 1, endDay));
    }

    return { from, to, fee: parseWon(text.split('\n').at(-1) ?? '') };
  }

  consignmentCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: checkoutCopy.consignment });
  }

  // The checkbox input itself is visually hidden behind its styled label, so the label is clicked.
  async toggleConsignment(): Promise<void> {
    await waitForNuxtHydration(this.page);
    const checkbox = this.consignmentCheckbox();
    const wasChecked = await checkbox.isChecked();
    await checkbox.locator('..').click();
    await expect(checkbox).toBeChecked({ checked: !wasChecked });
  }

  /**
   * With 위탁배송 on, a second 성함 / 회사명 block appears for the sender. It reuses the recipient
   * fields' labels, so the two are told apart only by order (MUS-QA-027).
   */
  async expectConsignmentSender(shown: boolean): Promise<void> {
    const shipping = this.page.getByRole('heading', { name: checkoutCopy.shippingHeading }).locator('..');
    await expect(shipping.getByRole('textbox', { name: checkoutCopy.nameLabel, exact: true })).toHaveCount(shown ? 2 : 1);
    await expect(shipping.getByRole('textbox', { name: checkoutCopy.companyLabel, exact: true })).toHaveCount(shown ? 2 : 1);
    await expect(shipping.getByText(checkoutCopy.consignmentMemberNote).filter({ visible: true })).toHaveCount(shown ? 1 : 0);
  }

  /**
   * Opens one of the checkout's info tips and returns its text. The email, road address and 위탁배송
   * icons have no accessible name or test id (MUS-QA-027), so they are found by class and position;
   * the 배송비 icon has a name and is found by it.
   */
  async openInfoTip(which: number | 'shippingFee'): Promise<string> {
    await waitForNuxtHydration(this.page);
    const trigger =
      which === 'shippingFee'
        ? this.page.getByRole('button', { name: checkoutCopy.shippingFeeInfo })
        : this.page.getByRole('main').locator('.ui-tooltip-icon-trigger').nth(which);
    await trigger.click();
    const tip = this.page.locator('.ui-tooltip-content').filter({ visible: true });
    await expect(tip).toHaveCount(1);
    const text = await tip.innerText();
    // Dismiss it so the next tip opens on its own.
    await this.page.getByRole('heading', { name: checkoutCopy.contactHeading }).click();
    await expect(tip).toHaveCount(0);
    return text;
  }

  infoTipTriggers(): Locator {
    return this.page.getByRole('main').locator('.ui-tooltip-icon-trigger, .checkout-summary-tooltip-trigger');
  }

  /** The contact section's 로그인 opens sign-in over the checkout instead of leaving it. */
  async openLogin(): Promise<Locator> {
    await waitForNuxtHydration(this.page);
    const contact = this.page.getByRole('heading', { name: checkoutCopy.contactHeading }).locator('..');
    await contact.getByRole('button', { name: checkoutCopy.login, exact: true }).click();
    const dialog = this.page.getByRole('dialog').filter({ hasText: checkoutCopy.loginPromo });
    await expect(dialog).toBeVisible();
    return dialog;
  }

  async editOrderSummary(): Promise<void> {
    await waitForNuxtHydration(this.page);
    await this.page.getByRole('button', { name: checkoutCopy.editSummary }).click();
    await expect.poll(() => currentPath(this.page)).toBe(appPath('./cart'));
  }

  async selectKakaoPay(): Promise<void> {
    await this.page.getByText(ko.kakaoPay, { exact: false }).first().click();
  }

  // The pay button opens the KakaoPay gateway (a real "PayApp — Local Mock" sandbox page on dev
  // environments) in a popup window.
  //
  // For a signed-in member the first popup is a throwaway: a blank window that closes at once, and
  // the PayApp page opens in a second popup once POST /orders/checkout answers (seen on dev-1,
  // 2026-10-28). So this waits for the popup that leaves about:blank, not the first one to open.
  async submitPaymentAndAwaitPayAppPopup(): Promise<Page> {
    // The pay button carries a real `disabled` attribute, and the order-summary shipping-fee/total
    // rows render as `.ui-skeleton` placeholders, until an async shipping-cost recalculation
    // (triggered by the address fields) finishes. Clicking while that's in flight is a silent
    // no-op (no popup, no error) rather than a rejected click, so wait for both signals to clear
    // first instead of relying on click()'s own actionability retry.
    await expect(this.page.locator('.checkout-summary-line .ui-skeleton')).toHaveCount(0, { timeout: 30_000 });
    await expect(this.payButton).toBeEnabled({ timeout: 30_000 });

    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', {
        timeout: 30_000,
        predicate: async (candidate) => {
          await Promise.race([
            candidate.waitForURL((url) => url.href !== 'about:blank', { timeout: 15_000 }),
            candidate.waitForEvent('close', { timeout: 15_000 })
          ]).catch(() => undefined);
          return !candidate.isClosed() && candidate.url() !== 'about:blank';
        }
      }),
      this.payButton.click()
    ]);
    return popup;
  }

  // Clicking the mock's "Complete card payment" button closes the popup itself and fires the
  // payment webhook that redirects the original checkout tab to the order-confirmation page.
  //
  // Bounded, and reports what the popup showed instead: left to the test timeout, a mock that never
  // offers the button (seen once on dev-1, 2026-10-28) used up all 20 minutes of MS-ADMO-019.
  async completePayAppMockCardPayment(popup: Page): Promise<void> {
    try {
      await popup.getByRole('button', { name: 'Complete card payment' }).click({ timeout: 30_000 });
    } catch (error) {
      const windows = popup.context().pages().map((open) => open.url());
      const text = popup.isClosed() ? '(popup closed)' : (await popup.locator('body').innerText().catch(() => '')).slice(0, 500);
      throw new Error(
        `The PayApp popup never offered "Complete card payment".\nPopup: ${popup.url()}\nPopup text: ${text}\n` +
          `Open windows: ${windows.join(', ')}`,
        { cause: error }
      );
    }
    await popup.waitForEvent('close', { timeout: 15_000 }).catch(() => undefined);
  }
}
