import type { Locator, Page, Request } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../../fixtures/env.js';
import { isMustickerHost } from '../../fixtures/hosts.js';
import { waitForNuxtHydration } from '../../fixtures/hydration.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { partnerInquiryCopy, type PartnerInquiryPage } from '../../fixtures/partner-inquiry-data.js';

/**
 * A B2B landing page (기업 견적, 학교·공공기관, 제휴) and its #contact quote form.
 *
 * These pages run on production, where a sent form becomes a real lead for the sales team. So
 * `goto` first blocks every non-GET request to a Musticker host and records it: a test that reaches
 * the network fails on `expectNothingSent` rather than filing an inquiry. Third-party analytics
 * (Google's form_start/form_submit beacons) are left alone.
 */
export class PartnerInquiryV2Page {
  readonly page: Page;
  readonly data: PartnerInquiryPage;
  readonly form: Locator;
  readonly submitButton: Locator;
  private readonly blockedRequests: string[] = [];

  constructor(page: Page, data: PartnerInquiryPage) {
    this.page = page;
    this.data = data;
    this.form = page.getByTestId(`partner-inquiry-form-${data.kind}`);
    this.submitButton = this.form.getByRole('button', { name: data.submit, exact: true });
  }

  async goto(): Promise<void> {
    await this.page.route(
      (url) => isMustickerHost(url.hostname),
      async (route) => {
        const request = route.request();

        if (request.method() === 'GET') {
          await route.fallback();
          return;
        }

        this.blockedRequests.push(describeRequest(request));
        await route.abort('blockedbyclient');
      }
    );

    await gotoStorefront(this.page, appPath(this.data.path));
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(this.data.heading);
    // Before hydration the form is a plain <form> without an action, and a click would reload the
    // page with the fields in the query string instead of validating them.
    await waitForNuxtHydration(this.page);
  }

  async openFormFromHero(): Promise<void> {
    await this.page.getByRole('link', { name: this.data.heroCta, exact: true }).first().click();
    await expect(this.page).toHaveURL(/#contact$/);
    // The form, not its submit button: the partnership form is taller than a laptop viewport.
    await expect(this.form).toBeInViewport();
  }

  select(label: string): Locator {
    return this.form.getByRole('combobox', { name: label, exact: true });
  }

  /**
   * Opens a custom select and waits until it reports itself open. The menu closes on any scroll, and
   * lazy sections above the form keep shifting it for a second or so after hydration (seen on
   * production 2026-11-13), which can close a menu the click has just opened. So retry until it
   * stays open.
   */
  async openSelect(label: string): Promise<Locator> {
    const select = this.select(label);

    await expect(async () => {
      if ((await select.getAttribute('aria-expanded')) !== 'true') {
        await select.click();
      }

      await expect(select).toHaveAttribute('aria-expanded', 'true', { timeout: 1_000 });
      await expect(this.page.getByRole('listbox')).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 15_000 });

    return this.page.getByRole('listbox');
  }

  field(key: string): Locator {
    return this.form.getByTestId(`partner-inquiry-field-${key}`);
  }

  /**
   * A field's validation message. CSS because the message is a bare <p> that the control does not
   * reference (no aria-describedby), so no role or label reaches it.
   */
  fieldError(key: string): Locator {
    return this.field(key).locator('p');
  }

  phonePart(index: 0 | 1 | 2): Locator {
    return this.form.getByLabel(partnerInquiryCopy.phoneParts[index], { exact: true });
  }

  async fill(label: string, value: string): Promise<void> {
    await this.form.getByLabel(label, { exact: true }).fill(value);
  }

  async fillPhone(first: string, middle: string, last: string): Promise<void> {
    await this.phonePart(0).fill(first);
    await this.phonePart(1).fill(middle);
    await this.phonePart(2).fill(last);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectRequiredErrors(): Promise<void> {
    for (const { key, label } of this.data.requiredFields) {
      await expect(this.field(key), `${label} is flagged as required`).toContainText(partnerInquiryCopy.required);

      if (key !== 'phone') {
        await expect(this.form.getByLabel(label, { exact: true })).toHaveAttribute('aria-invalid', 'true');
      }
    }

    await expect(this.form.getByText(partnerInquiryCopy.required, { exact: true })).toHaveCount(
      this.data.requiredFields.length
    );
  }

  async expectNoRequiredErrors(): Promise<void> {
    await expect(this.form.getByText(partnerInquiryCopy.required, { exact: true })).toHaveCount(0);
  }

  /** Asserts that no form data left the browser for a Musticker host. */
  expectNothingSent(): void {
    expect(this.blockedRequests, 'the form must not be sent on a read-only run').toEqual([]);
  }
}

function describeRequest(request: Request): string {
  const url = new URL(request.url());

  return `${request.method()} ${url.host}${url.pathname}`;
}
