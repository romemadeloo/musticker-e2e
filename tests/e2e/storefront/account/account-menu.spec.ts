import { test, expect } from '../../../fixtures/e2e-test.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
import { accountMenuSections } from '../../../fixtures/storefront-data.js';
import { AccountShell } from '../../../pom/storefront/account-shell.js';
import { AccountCouponsPage } from '../../../pom/storefront/account-coupons-page.js';
import { AccountPointsPage } from '../../../pom/storefront/account-points-page.js';

// The account shell's six-section menu (프로필 / 주소록 / 주문 내역 / 포인트 / 쿠폰 / 내 리뷰) and the
// summary strip above it. Verified live against dev-1 on 2026-11-02; every piece carries a test id.
// Read-only: nothing is opened beyond the pages themselves.
test.describe('Account menu', { tag: ['@regression', '@production', '@auth', '@credentialed'] }, () => {
  test.use({
    asMember: true,
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true
  });

  test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);

  test('MS-ACC-006 the account menu lists its six sections and each one opens its own page @smoke', async ({ page }) => {
    const shell = new AccountShell(page);
    const [profile] = accountMenuSections;

    await shell.goto(profile);
    await expect(shell.tabs.locator('[data-testid^="account-shell-tab-"]')).toHaveText(
      accountMenuSections.map((section) => section.label)
    );

    // Walk the menu in a loop rather than starting from each URL, so it is the links that are tested.
    for (const section of [...accountMenuSections.slice(1), profile]) {
      await test.step(`${section.label} opens /kr/${section.path}`, async () => {
        await shell.open(section);
        await shell.expectSelected(section);
        await expect(shell.root, 'the summary strip must stay in place on every section').toBeVisible();
      });
    }
  });

  test('MS-ACC-007 the summary strip\'s point and coupon counts match the points and coupons pages', async ({ page }) => {
    const points = new AccountPointsPage(page);
    await points.goto();

    // The strip and the hero read the same balance, so they must agree to the point.
    const pointsStat = await points.shell.statValue(points.shell.pointsStat);
    await expect
      .poll(() => points.balanceValue(), { message: 'the 포인트 balance must equal the summary strip' })
      .toBe(pointsStat);

    const coupons = new AccountCouponsPage(page);
    await coupons.goto();
    const couponsStat = await coupons.shell.statValue(coupons.shell.couponsStat);
    await expect(coupons.couponRows(), 'the coupon list must hold as many coupons as the summary strip counts').toHaveCount(
      couponsStat
    );
  });
});
