import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ko } from '../fixtures/storefront-data.js';

export class OrderConfirmationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectOrderConfirmed(): Promise<{ orderNumber: string }> {
    await expect(this.page).toHaveURL(/\/checkout\/confirmation(?:\?|$)/, { timeout: 30_000 });
    await expect(this.page.getByText(ko.orderCompletedHeading)).toBeVisible();

    const orderNumberText = await this.page.getByText(/AO-[\w-]+/).first().innerText();
    const orderNumber = orderNumberText.match(/AO-[\w-]+/)?.[0];
    expect(orderNumber, `Expected an order number on the confirmation page, got "${orderNumberText}"`).toBeTruthy();

    return { orderNumber: orderNumber! };
  }

  async expectLineItem(productName: string, quantityLabel: string): Promise<void> {
    const body = this.page.locator('body');
    await expect(body).toContainText(productName);
    await expect(body).toContainText(quantityLabel);
  }
}
