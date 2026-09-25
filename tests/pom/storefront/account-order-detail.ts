import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { storefrontOrderCopy } from '../../fixtures/admin-data.js';
import { AccountOrdersPage } from './account-orders-page.js';

/**
 * The customer's side of order processing, in the `/kr/account/orders/<id>` detail pane: sending
 * the design file after checkout, answering a rejected file, and approving the final proof.
 * Verified live against development-static on 2026-09-25 with the seeded member.
 *
 * Each item row carries one action button whose label follows the stage -- 디자인 파일 업로드
 * (nothing sent yet), 디자인 파일 재접수 (rejected), 디자인 파일 교체 (sent, not yet reviewed),
 * 최종 시안 확인 (proof waiting for approval). Single-item orders only for now: the locators take
 * the first match.
 */
export class AccountOrderDetail {
  readonly page: Page;
  readonly orders: AccountOrdersPage;
  readonly pane: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orders = new AccountOrdersPage(page);
    this.pane = this.orders.detailPane;
  }

  /**
   * Opens an order by searching for it. Completed orders were still listed under 진행 중 on
   * 2026-09-25, so the default segment is searched first; 이전 내역 is only the fallback.
   */
  async open(orderNumber: string): Promise<void> {
    await this.orders.goto();
    await this.orders.waitForListSettled();
    await this.orders.search(orderNumber);

    if ((await this.orders.waitForListSettled()) === 0) {
      await this.orders.switchTo('past');
      await this.orders.search(orderNumber);
      await this.orders.waitForListSettled();
    }

    const shown = await this.orders.selectOrder(0);
    expect(shown, 'the order search opened a different order').toBe(orderNumber);
    await expect(this.pane).toContainText(orderNumber, { timeout: 20_000 });
  }

  async expectItemStatus(statusLabel: string): Promise<void> {
    await expect(this.pane).toContainText(statusLabel, { timeout: 20_000 });
  }

  /**
   * The order status is the chip right after the "주문번호: …" heading. Read positionally from the
   * pane's text because the chip has no role or id of its own, and several labels (배송 중) exist
   * at both order and item level, so a plain contains-text check cannot tell them apart.
   */
  async expectOrderStatus(statusLabel: string): Promise<void> {
    await expect
      .poll(
        async () => {
          const lines = (await this.pane.innerText()).split('\n').map((line) => line.trim()).filter(Boolean);
          return lines[lines.findIndex((line) => line.startsWith('주문번호')) + 1];
        },
        { timeout: 20_000, message: 'the order status chip under the order number' }
      )
      .toBe(statusLabel);
  }

  /**
   * Sends the design file for the item. `resubmit` is the path after the admin rejected the first
   * file: a different button and dialog, which also shows the reviewer's reason -- pass
   * `expectFeedback` to assert the customer is actually shown it.
   */
  async uploadDesign(filePath: string, options: { resubmit?: boolean; expectFeedback?: string } = {}): Promise<void> {
    const opener = options.resubmit ? storefrontOrderCopy.resubmitDesign : storefrontOrderCopy.uploadDesign;
    const submit = options.resubmit ? storefrontOrderCopy.resubmitDesignSubmit : storefrontOrderCopy.uploadDesignSubmit;

    await this.pane.getByRole('button', { name: opener, exact: true }).click();
    const dialog = this.page.getByRole('dialog', { name: new RegExp(`^${opener}`) });
    await expect(dialog).toBeVisible();

    if (options.expectFeedback) {
      await expect(dialog).toContainText(storefrontOrderCopy.reviewerFeedbackLabel);
      // Fetched after the dialog opens, so it arrives a beat later than the rest.
      await expect(dialog).toContainText(options.expectFeedback, { timeout: 15_000 });
    }

    await dialog.locator('input[type="file"]').setInputFiles(filePath);
    await expect(dialog).toContainText(filePath.split(/[\\/]/).pop()!);
    await dialog.getByRole('button', { name: submit, exact: true }).click();
    await expect(dialog).toBeHidden({ timeout: 30_000 });
  }

  /**
   * Opens the proof and approves it. Approval is a two-step confirm, and the second dialog's copy
   * says approving moves the order to '제작 진행' -- it does not (see the spec).
   */
  async approveProof(expectedProofFile: string): Promise<void> {
    await this.pane.getByRole('button', { name: storefrontOrderCopy.viewFinalProof, exact: true }).click();

    const proof = this.page.getByRole('dialog', { name: storefrontOrderCopy.proofModalName });
    await expect(proof).toBeVisible();
    await expect(proof.getByRole('img', { name: expectedProofFile }).first()).toBeVisible();
    await proof.getByRole('button', { name: storefrontOrderCopy.approveProof, exact: true }).click();

    const confirm = this.page.getByRole('dialog').filter({ hasText: storefrontOrderCopy.approveProofConfirmHeading });
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: storefrontOrderCopy.approveAndProduce, exact: true }).click();
    await expect(confirm).toBeHidden({ timeout: 20_000 });
  }

  async expectTrackingNumber(trackingNumber: string): Promise<void> {
    await expect(this.pane).toContainText(storefrontOrderCopy.trackingSection);
    await expect(
      this.pane.getByRole('link', { name: `${storefrontOrderCopy.trackingNumberLabel}: ${trackingNumber}` })
    ).toBeVisible();
  }
}
