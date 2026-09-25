import { test, expect } from '../../fixtures/e2e-test.js';
import { env } from '../../fixtures/env.js';
import { hasMemberCredentials, seedMemberStorageState } from '../../fixtures/member-auth.js';
import { guestOrderLookupCopy, unregisteredLogin } from '../../fixtures/storefront-data.js';
import { LoginPage } from '../../pom/login-page.js';

// MS-V2-096 established that the 비회원 mode swaps the password field for email + order number. It
// stopped there -- nothing actually looked an order up, so the whole guest-lookup path was untested.
//
// Verified live against development-1 on 2026-08-27:
//
//   * An unknown order is refused with 존재하지 않는 주문입니다. on the order-number field, reported in
//     the body of an HTTP 200 POST /sys/kr/auth/login/guest/verification.
//   * A blank submit marks both fields 필수 입력 항목입니다. and never reaches the endpoint.
//
// Read-only and safe on production: no order is created and no email is sent for an order that does
// not exist. A never-registered address (example.com, reserved by RFC 2606) is used for the negative
// cases so nothing can collide with a real customer.
const bogusOrderNumber = 'AO-000000-E2E-NOPE';

test.describe('storefront guest order lookup', { tag: ['@auth', '@production', '@validation'] }, () => {
  test.use({ allowGuestUserMe401: true, allowExpectedAuthFailures: true, allowKnownNuxtPayloadFailures: true });

  test('MS-V2-112 an unknown order number is refused without signing anyone in', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.switchToNonMemberMode();
    await login.submitGuestOrderLookup(unregisteredLogin.email, bogusOrderNumber);

    await expect(login.nonMemberOrderNumberError).toHaveText(guestOrderLookupCopy.unknownOrder);

    // A refused lookup must leave the visitor exactly where they were: still anonymous, still on the
    // login route, with no order surfaced.
    await expect(page).toHaveURL(/\/kr\/auth\/login\/?$/);
    await expect(page.getByTestId('app-header-account-dropdown-member')).toHaveCount(0);
  });

  test('MS-V2-113 blank guest lookup is blocked before the endpoint is called @validation', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.switchToNonMemberMode();
    await login.expectBlankGuestOrderLookupRejected();

    await expect(page).toHaveURL(/\/kr\/auth\/login\/?$/);
  });

  test(
    'MS-V2-114 the refusal does not reveal whether the email belongs to an account @credentialed',
    async ({ page }) => {
      test.skip(
        !hasMemberCredentials(),
        'MS-V2-114 compares a registered address against an unregistered one, so it needs AUTH_TEST_EMAIL.'
      );

      // Proves the test's premise before testing anything: AUTH_TEST_EMAIL has to be a real member on
      // *this* environment for the comparison below to mean anything. Pointed at a server where the
      // address is not registered, both halves would be "unregistered", the messages would match, and
      // the test would pass while proving nothing. This turns that into a loud failure -- it throws
      // naming the environment if the credentials do not authenticate here.
      await seedMemberStorageState();

      const login = new LoginPage(page);

      // The same non-existent order number, once against an address that definitely has an account
      // and once against an address that definitely does not.
      await login.goto();
      await login.switchToNonMemberMode();
      await login.submitGuestOrderLookup(env.AUTH_TEST_EMAIL!, bogusOrderNumber);
      const refusalForRegistered = await login.captureGuestOrderLookupRefusal();

      await login.goto();
      await login.switchToNonMemberMode();
      await login.submitGuestOrderLookup(unregisteredLogin.email, bogusOrderNumber);
      const refusalForUnregistered = await login.captureGuestOrderLookupRefusal();

      // Differing messages would turn this form into an account-existence oracle for anyone with a
      // list of email addresses -- the same leak MS-V2-030 guards against on the member form.
      expect(
        refusalForRegistered,
        'guest lookup must refuse a registered and an unregistered address identically, or it leaks which addresses have accounts'
      ).toBe(refusalForUnregistered);
      expect(refusalForRegistered).toBe(guestOrderLookupCopy.unknownOrder);
    }
  );
});
