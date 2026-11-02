import { test, expect } from '../../../fixtures/e2e-test.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
import { accountCopy } from '../../../fixtures/storefront-data.js';
import { AccountReviewsPage } from '../../../pom/storefront/account-reviews-page.js';

const copy = accountCopy.reviews;

// /kr/account/reviews (menu label 내 리뷰), verified live against dev-1 on 2026-11-02 with a member
// holding 12 order lines waiting for a review (two pages of 8) and none written.
//
// Read-only: the review form is opened and closed, never submitted.
test.describe('Reviews', { tag: ['@regression', '@production', '@auth', '@credentialed'] }, () => {
  test.use({
    asMember: true,
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true
  });

  test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);

  test('MS-ACC-020 the waiting-for-review count matches the order lines listed across every page', async ({ page }) => {
    const reviews = new AccountReviewsPage(page);
    await reviews.goto();
    await expect(reviews.root.getByText(copy.writableHeading, { exact: true })).toBeVisible();

    const firstPage = await reviews.waitForList();
    expect(firstPage, `a page lists at most ${copy.pageSize} items`).toBeLessThanOrEqual(copy.pageSize);
    test.skip(firstPage === 0, 'MS-ACC-020 needs a member with at least one order waiting for a review.');

    const cards = await reviews.collectAllCards();
    const numbers = cards.map((card) => card.orderNumber);
    expect(new Set(numbers).size, 'no order may be listed on two cards').toBe(numbers.length);

    // The count is of order lines, and a card can hold several of them behind its "n 중 1" pager.
    const lines = cards.reduce((total, card) => total + card.lines, 0);
    // Polled: the stat card can paint after the list does, and reads 0 until then.
    await expect
      .poll(() => reviews.pendingCount(), { message: 'the waiting count must equal the order lines listed across every page' })
      .toBe(lines);
  });

  test('MS-ACC-021 the switch flips between reviews to write and reviews already written', async ({ page }) => {
    const reviews = new AccountReviewsPage(page);
    await reviews.goto();
    await expect(reviews.listToggleInput).toBeChecked();
    await reviews.waitForList();
    const pendingFirstPage = await reviews.captureOrderNumbers();

    await reviews.showCompleted();
    await reviews.waitForList();
    // Exact text: the switch's own description mentions 작성 가능한 후기 as well.
    await expect(reviews.root.getByText(copy.writableHeading, { exact: true })).toHaveCount(0);
    // Written reviews can't be written again.
    await expect(reviews.root.getByRole('button', { name: copy.writeButton, exact: true })).toHaveCount(0);
    // Either written reviews, or the empty state saying there are none -- never a blank list.
    await expect(reviews.items().first().or(reviews.root.getByText(copy.noCompletedReviews))).toBeVisible();

    await reviews.showPending();
    await reviews.waitForList();
    await expect.poll(() => reviews.captureOrderNumbers()).toEqual(pendingFirstPage);
  });

  test('MS-ACC-022 후기 작성 opens the review form for that order, with its submit button off until it is filled', async ({ page }) => {
    const reviews = new AccountReviewsPage(page);
    await reviews.goto();
    const count = await reviews.waitForList();
    test.skip(count === 0, 'MS-ACC-022 needs a member with at least one order waiting for a review.');

    const item = reviews.items().first();
    const [orderNumber] = await reviews.captureOrderNumbers();

    await reviews.openWriteDialog(item);
    await expect(reviews.writeDialog).toContainText(orderNumber);
    await expect(reviews.writeDialog.getByRole('button', { name: /out of 5/ })).toHaveCount(5);
    await expect(reviews.writeDialog.getByRole('textbox')).toBeEditable();
    await expect(reviews.writeDialog.getByRole('button', { name: copy.submitButton })).toBeDisabled();

    await reviews.closeWriteDialog();
  });
});
