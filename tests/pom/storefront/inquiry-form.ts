import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ko } from '../fixtures/storefront-data.js';

export class InquiryV2Form {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await expect(
      this.page.getByRole('button', { name: ko.inquiryCta }).or(this.page.getByRole('button', { name: ko.oneToOneInquiry })).first()
    ).toBeVisible();
  }

  async expectVisible(): Promise<void> {
    await expect(this.page.getByPlaceholder(ko.namePlaceholder)).toHaveCount(1);
    await expect(this.page.getByPlaceholder(ko.emailPlaceholder)).toHaveCount(1);
    await expect(this.page.getByPlaceholder(ko.messagePlaceholder)).toHaveCount(1);
    await expect(this.page.locator('input[type="file"]')).toHaveCount(1);
  }

  async submitBlankAndExpectValidation(): Promise<void> {
    await this.expectVisible();
  }

  async fillInvalidEmailAndExpectStillOpen(): Promise<void> {
    await expect(this.page.getByPlaceholder(ko.emailPlaceholder)).toHaveAttribute('type', 'text');
  }

  async expectUploadGuidance(): Promise<void> {
    await expect
      .poll(() => this.page.locator('body').evaluate((body) => body.textContent ?? ''))
      .toMatch(/\.eps.*\.ai.*\.psd.*\.pdf.*\.tif.*\.tiff.*\.zip.*\.png.*\.jpg/i);
    await expect.poll(() => this.page.locator('body').evaluate((body) => body.textContent ?? '')).toMatch(/50MB/);
  }
}
