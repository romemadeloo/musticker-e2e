import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { accountCopy, accountMenuSections, orderHistoryCopy } from '../../fixtures/storefront-data.js';
import { AccountShell, parseCount, settleRender } from './account-shell.js';

const copy = accountCopy.reviews;

/**
 * `/kr/account/reviews` (menu label 내 리뷰, page heading 후기).
 *
 * Verified live against dev-1 on 2026-11-02. Three stat cards: reviews written in the last month,
 * average rating, and the number of order lines still waiting for a review, whose switch flips the list
 * between 작성 가능한 후기 (`GET review/queue`) and the completed reviews (`GET review/completed`). The
 * list pages 8 at a time through the shared `mu-pagination` control. Each waiting line is an `<article>`
 * with its order number, 주문일 and a 후기 작성 button that opens the review form in a dialog.
 *
 * The switch's checkbox is `hidden`; its `<label>` is what takes the click.
 */
export class AccountReviewsPage {
  readonly page: Page;
  readonly shell: AccountShell;
  readonly root: Locator;
  readonly title: Locator;
  readonly stats: Locator;
  readonly listToggle: Locator;
  readonly listToggleInput: Locator;
  readonly pagination: Locator;
  readonly writeDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shell = new AccountShell(page);
    this.root = page.getByTestId('account-reviews-page');
    this.title = page.getByTestId('account-reviews-title');
    this.stats = page.getByTestId('account-reviews-stats');
    this.listToggle = this.stats.locator('.mu-switch-label');
    this.listToggleInput = this.stats.locator('.mu-switch input[type="checkbox"]');
    this.pagination = this.root.getByTestId('mu-pagination');
    this.writeDialog = page.getByRole('dialog').filter({ hasText: copy.writeDialogTitle });
  }

  async goto(): Promise<void> {
    await this.shell.goto(accountMenuSections.find((section) => section.key === 'reviews')!, [
      /\/sys\/kr\/review\/stats/,
      /\/sys\/kr\/review\/queue/
    ]);
    await expect(this.title).toHaveText(copy.heading);
  }

  /** The waiting-for-review count on the last stat card, next to the switch. */
  async pendingCount(): Promise<number> {
    const figure = this.stats.locator('.stats__card.last .card__figure h3');
    await expect(figure).toHaveText(/\d/);
    return parseCount(await figure.innerText());
  }

  items(): Locator {
    return this.root.locator('article');
  }

  /** Waits out the list's loading state, then returns how many items the page shows. */
  async waitForList(): Promise<number> {
    await expect(this.root.locator('[aria-busy="true"]')).toHaveCount(0);
    await settleRender(this.page);
    return this.items().count();
  }

  async showCompleted(): Promise<void> {
    const completed = this.page.waitForResponse((response) => response.url().includes('/sys/kr/review/completed'));
    await this.listToggle.click();
    await completed;
    await expect(this.listToggleInput).not.toBeChecked();
  }

  /** Switching back reuses the queue the page already fetched, so there is no request to wait for. */
  async showPending(): Promise<void> {
    await this.listToggle.click();
    await expect(this.listToggleInput).toBeChecked();
  }

  /**
   * Reads every page of the list: each card's order number, and how many order lines it holds. A card
   * bundles an order's lines behind an "n 중 1" pager (seen on dev-1: one card of 2 lines, one of 3),
   * and the waiting count on the stat card counts lines, not cards.
   */
  async collectAllCards(): Promise<Array<{ orderNumber: string; lines: number }>> {
    const cards: Array<{ orderNumber: string; lines: number }> = [];
    const pageCount = await this.pagination.locator('[data-testid^="mu-pagination-page-"]').count();

    for (let pageNumber = 1; pageNumber <= Math.max(pageCount, 1); pageNumber += 1) {
      if (pageNumber > 1) {
        const queue = this.page.waitForResponse((response) => response.url().includes('/sys/kr/review/queue'));
        await this.pagination.getByTestId(`mu-pagination-page-${pageNumber}`).click();
        await (await queue).finished();
      }
      await this.waitForList();
      const orderNumbers = await this.captureOrderNumbers();
      const texts = await this.items().allInnerTexts();
      cards.push(
        ...orderNumbers.map((orderNumber, index) => ({
          orderNumber,
          lines: Number(texts[index]?.match(copy.linePagerPattern)?.[1] ?? 1)
        }))
      );
    }

    return cards;
  }

  async captureOrderNumbers(): Promise<string[]> {
    const texts = await this.items().allInnerTexts();
    return texts.map((text, index) => {
      const number = text.match(orderHistoryCopy.orderNumberPattern)?.[0];
      expect(number, `review item ${index} carries no order number: "${text.replace(/\n+/g, ' | ')}"`).toBeTruthy();
      return number!;
    });
  }

  async openWriteDialog(item: Locator): Promise<void> {
    await item.getByRole('button', { name: copy.writeButton, exact: true }).click();
    await expect(this.writeDialog).toBeVisible();
  }

  async closeWriteDialog(): Promise<void> {
    await this.writeDialog.getByRole('button', { name: 'Close' }).click();
    await expect(this.writeDialog).toBeHidden();
  }
}
