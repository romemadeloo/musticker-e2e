import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { adminCopy } from '../../fixtures/admin-data.js';

/**
 * The item drawer that slides in from the right when an ordered item is clicked
 * (`[role=dialog].artwork-modal`). It is where the artwork is reviewed and the final proof sent;
 * which footer button shows depends on the item's stage:
 *
 * - 디자인 파일 제출 완료 → Make Evaluation (clicking it alone moves the item to 검토 중)
 * - 검토 반려 → Re-Evaluate
 * - 검토 승인 → Send Final Proof, after a transparent .png and a message are provided
 * - 승인 대기 → Approve Proof (on the customer's behalf) -- not used here; the customer approves
 */
export class AdminItemDrawer {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator('[role="dialog"].artwork-modal');
  }

  async expectOpen(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.root).toContainText(/Item \d{3}/);
  }

  async expectStatus(statusLabel: string): Promise<void> {
    await expect(this.root).toContainText(statusLabel, { timeout: 20_000 });
  }

  async expectArtworkFile(fileName: string): Promise<void> {
    await expect(this.root).toContainText(fileName);
  }

  /**
   * Opens the evaluation panel and submits a result. The toggle starts on Failed, so a pass has to
   * be selected explicitly -- clicking Submit straight away rejects the customer's file.
   */
  async evaluate(result: { passed: true } | { passed: false; feedback: string }): Promise<void> {
    await this.root
      .getByRole('button', { name: new RegExp(`^(${adminCopy.makeEvaluation}|${adminCopy.reEvaluate})$`) })
      .click();
    await expect(this.root.getByText(adminCopy.submitEvaluation, { exact: true })).toBeVisible();

    await this.root.getByText(result.passed ? adminCopy.evaluationPassed : adminCopy.evaluationFailed, { exact: true }).click();

    if (!result.passed) {
      await this.root.getByPlaceholder(adminCopy.evaluationFeedbackPlaceholder).fill(result.feedback);
    }

    await this.root.getByRole('button', { name: adminCopy.submitEvaluation, exact: true }).click();
    await expect(this.root.getByText(adminCopy.evaluationSaved)).toBeVisible({ timeout: 20_000 });
  }

  /** Uploads the proof thumbnail (.png with a transparent background only) and sends it. */
  async sendFinalProof(pngPath: string, message: string): Promise<void> {
    await this.root.locator('.artwork-final input[type="file"]').setInputFiles(pngPath);
    await this.root.getByPlaceholder(adminCopy.finalProofMessagePlaceholder).fill(message);
    await this.root.getByRole('button', { name: adminCopy.sendFinalProof, exact: true }).click();
    await expect(this.root.getByText(adminCopy.finalProofSent)).toBeVisible({ timeout: 20_000 });
  }
}
