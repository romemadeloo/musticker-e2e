import { test, expect } from '../../../fixtures/e2e-test.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
import { accountCopy } from '../../../fixtures/storefront-data.js';
import { AccountCouponsPage } from '../../../pom/storefront/account-coupons-page.js';

const copy = accountCopy.coupons;

// A code that cannot exist: the claim endpoint refuses it, so trying it changes nothing.
const UNKNOWN_COUPON_CODE = 'QA-NO-SUCH-COUPON-0000';

// /kr/account/coupons, verified live against dev-1 on 2026-11-02 with a member holding 4 coupons.
// Only refused claims are attempted, so the member's coupons never change.
test.describe('Coupons', { tag: ['@regression', '@production', '@auth', '@credentialed'] }, () => {
  test.use({
    asMember: true,
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true
  });

  test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);

  test('MS-ACC-018 each coupon shows a distinct code and how often it can be used', async ({ page }) => {
    const coupons = new AccountCouponsPage(page);
    await coupons.goto();

    const count = await coupons.couponRows().count();
    test.skip(count === 0, 'MS-ACC-018 needs a member holding at least one coupon.');

    const codes = await coupons.captureCodes();
    expect(codes.every(Boolean), 'every coupon must show its code').toBe(true);
    expect(new Set(codes).size, 'each coupon must show a distinct code').toBe(codes.length);

    for (let index = 0; index < count; index += 1) {
      await expect(coupons.couponRows().nth(index), `coupon ${codes[index]} has no usage badge`).toContainText(copy.usageBadge);
    }
  });

  test('MS-ACC-019 쿠폰 등록 refuses a blank and an unknown code and leaves the coupons unchanged', async ({ page }) => {
    const coupons = new AccountCouponsPage(page);
    await coupons.goto();
    const before = await coupons.captureCodes();

    await coupons.claim('');
    await expect(coupons.alert).toContainText(copy.blankCode);

    await coupons.claim(UNKNOWN_COUPON_CODE);
    await expect(coupons.alert).toContainText(copy.invalidCode);

    await expect.poll(() => coupons.captureCodes()).toEqual(before);
  });
});
