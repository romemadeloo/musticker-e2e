import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { accountCopy, accountMenuSections } from '../../fixtures/storefront-data.js';
import { AccountShell, parseCount } from './account-shell.js';

const copy = accountCopy.points;

export type PointsFilter = 'all' | 'earned' | 'spent';

const filterLabel: Record<PointsFilter, string> = {
  all: copy.filterAll,
  earned: copy.filterEarned,
  spent: copy.filterSpent
};

/**
 * `/kr/account/points` -- tier and balance (`account-points-hero` / `account-points-balance`), the
 * 스티커 퀘스트 challenges, and the 포인트 내역 ledger (`account-points-log-<id>` rows).
 *
 * Verified live against dev-1 on 2026-11-02. A ledger row is an h3 description ("사용된 포인트
 * (주문 # AO-…)"), a date, and a `<strong>` amount ("-5556 P", "+57 P"); a quest reward that is not
 * points shows the reward instead ("15% 할인 쿠폰 (1회 사용)"). The 전체 / 적립 / 차감 filter is
 * applied in the page, without a new request: 적립 left 14 credits and the coupon reward, 차감 the 21
 * debits.
 */
export class AccountPointsPage {
  readonly page: Page;
  readonly shell: AccountShell;
  readonly root: Locator;
  readonly title: Locator;
  readonly hero: Locator;
  readonly balance: Locator;
  readonly logs: Locator;
  readonly showAllChallengesButton: Locator;
  readonly questDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shell = new AccountShell(page);
    this.root = page.getByTestId('account-points-page');
    this.title = page.getByTestId('account-points-title');
    this.hero = page.getByTestId('account-points-hero');
    this.balance = page.getByTestId('account-points-balance');
    this.logs = page.getByTestId('account-points-logs');
    this.showAllChallengesButton = page.getByRole('button', { name: copy.showAllChallenges, exact: true });
    this.questDialog = page.getByRole('dialog').filter({ hasText: copy.questDialogHeading });
  }

  async goto(): Promise<void> {
    await this.shell.goto(accountMenuSections.find((section) => section.key === 'points')!, [
      /\/sys\/kr\/rank\/summary/,
      /\/sys\/kr\/user-point\/logs/,
      /\/sys\/kr\/challenge/
    ]);
    await expect(this.title).toHaveText(copy.heading);
    await expect(this.balance).toHaveText(/\d/);
    // The ledger shows a loading line in place of its rows until it has rendered them; on dev-1 it was
    // still showing after the logs response had arrived.
    await expect(this.logs.getByText(copy.ledgerLoading)).toHaveCount(0, { timeout: 30_000 });
  }

  logRows(): Locator {
    return this.page.locator('[data-testid^="account-points-log-"]');
  }

  async balanceValue(): Promise<number> {
    return parseCount(await this.balance.innerText());
  }

  /** The "n/m" progress next to the 챌린지 heading. */
  async challengeProgress(): Promise<{ done: number; total: number }> {
    const challenges = this.root.getByRole('heading', { name: copy.challengesHeading, exact: true }).locator('xpath=..');
    const match = (await challenges.innerText()).match(copy.questProgressPattern);
    expect(match, 'the 챌린지 block shows no n/m progress').toBeTruthy();
    return { done: Number(match![1]), total: Number(match![2]) };
  }

  async filterBy(filter: PointsFilter): Promise<void> {
    // Exact names keep 전체 apart from the challenges' 전체 보기.
    await this.root.getByRole('button', { name: filterLabel[filter], exact: true }).click();
  }

  /** One render of the ledger: each row's amount text, or `null` for a reward that is not points. */
  async captureAmounts(): Promise<Array<string | null>> {
    const rows = await this.logRows().evaluateAll((elements) =>
      elements.map((element) => element.querySelector('strong')?.textContent?.trim() ?? '')
    );
    return rows.map((amount) => (copy.signedAmountPattern.test(amount) ? amount : null));
  }

  async openQuestDialog(): Promise<void> {
    await this.showAllChallengesButton.click();
    await expect(this.questDialog).toBeVisible();
  }

  async closeQuestDialog(): Promise<void> {
    await this.questDialog.getByRole('button', { name: 'Close' }).click();
    await expect(this.questDialog).toBeHidden();
  }
}
