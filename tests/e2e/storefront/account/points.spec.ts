import { test, expect } from '../../../fixtures/e2e-test.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
import { accountCopy } from '../../../fixtures/storefront-data.js';
import { AccountPointsPage } from '../../../pom/storefront/account-points-page.js';

const copy = accountCopy.points;

// /kr/account/points, verified live against dev-1 on 2026-11-02: a member with 37 ledger rows (14
// credits, 21 debits, 2 quest rewards) and 4 of 7 challenges complete. Read-only.
test.describe('Points', { tag: ['@regression', '@production', '@auth', '@credentialed'] }, () => {
  test.use({
    asMember: true,
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true
  });

  test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);

  test('MS-ACC-015 the points page shows the tier, the balance and a dated, signed ledger', async ({ page }) => {
    const points = new AccountPointsPage(page);
    await points.goto();

    await expect(points.hero.getByRole('heading').first()).not.toBeEmpty();
    await expect(points.root.getByRole('heading', { name: copy.historyHeading, exact: true })).toBeVisible();

    const rows = await points.logRows().count();
    test.skip(rows === 0, 'MS-ACC-015 needs a member with at least one points ledger entry.');

    for (let index = 0; index < Math.min(rows, 10); index += 1) {
      const row = points.logRows().nth(index);
      await expect(row.getByRole('heading'), `ledger row ${index} has no description`).not.toBeEmpty();
      await expect(row, `ledger row ${index} has no date`).toContainText(accountCopy.koreanDatePattern);
    }
    const amounts = await points.captureAmounts();
    expect(amounts.filter(Boolean).length, 'at least one ledger row must carry a signed point amount').toBeGreaterThan(0);
  });

  test('MS-ACC-016 the 적립 and 차감 filters show only credits and only debits', async ({ page }) => {
    const points = new AccountPointsPage(page);
    await points.goto();

    const all = await points.captureAmounts();
    const credits = all.filter((amount) => amount?.startsWith('+')).length;
    const debits = all.filter((amount) => amount?.startsWith('-')).length;
    test.skip(credits === 0 || debits === 0, 'MS-ACC-016 needs a ledger holding both a credit and a debit.');

    // Credits and debits counted per sign, so a filter that drops the wrong rows or keeps extra ones fails.
    const signCounts = async () => {
      const amounts = await points.captureAmounts();
      return {
        credits: amounts.filter((amount) => amount?.startsWith('+')).length,
        debits: amounts.filter((amount) => amount?.startsWith('-')).length
      };
    };

    await points.filterBy('earned');
    await expect.poll(signCounts, { message: '적립 must list every credit and no debit' }).toEqual({ credits, debits: 0 });

    await points.filterBy('spent');
    await expect.poll(signCounts, { message: '차감 must list every debit and no credit' }).toEqual({ credits: 0, debits });

    await points.filterBy('all');
    await expect.poll(signCounts, { message: '전체 must bring the whole ledger back' }).toEqual({ credits, debits });
  });

  test('MS-ACC-017 전체 보기 opens the quest list with the same progress as the 챌린지 card', async ({ page }) => {
    const points = new AccountPointsPage(page);
    await points.goto();

    const progress = await points.challengeProgress();
    expect(progress.done).toBeLessThanOrEqual(progress.total);

    await points.openQuestDialog();
    await expect(points.questDialog).toContainText(`${progress.done}/${progress.total}`);
    // One card per quest, each a button with its own heading.
    await expect(points.questDialog.getByRole('heading', { level: 6 })).toHaveCount(progress.total);

    await points.closeQuestDialog();
  });
});
