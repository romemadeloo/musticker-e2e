import { test, expect } from '../../fixtures/e2e-test.js';
import { env } from '../../fixtures/env.js';
import { createMailTmAccount, extractOtpCode, waitForMailTmMessage } from '../../fixtures/mail-tm.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../fixtures/member-auth.js';
import { authCopy, throwawayAccount } from '../../fixtures/storefront-data.js';
import { recordCreatedAccount } from '../../fixtures/test-data-ledger.js';
import { AccountProfilePage } from '../../pom/account-profile-page.js';
import { HeaderComponent } from '../../pom/header-component.js';
import { LoginPage } from '../../pom/login-page.js';
import { RegisterPage } from '../../pom/register-page.js';

// The change-password form lives in the 비밀번호 section of /kr/account/profile. Verified live against
// development-1 on 2026-08-27:
//
//   * `비밀번호 변경` stays disabled until all three fields are filled.
//   * Every rejection comes back as an HTTP 200 on PUT /sys/kr/profile/password carrying the reason
//     in the body, surfaced as a field-level error. There is no 4xx to assert on, and no success
//     toast either -- an accepted change simply clears the form.
//   * Each failure mode has its own message: wrong current password, mismatched confirmation, and a
//     new password below the policy are all distinguishable.
//
// The negative cases below never change a password, so they run against the seeded member. The one
// test that really does rotate a credential registers its own throwaway account first, so it can
// never invalidate AUTH_TEST_PASSWORD for the rest of the suite.
const canRunDestructiveAuth = process.env.RUN_AUTH_DESTRUCTIVE_E2E === 'true';

test.describe('storefront change password', { tag: ['@auth', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowExpectedAuthFailures: true, allowKnownNuxtPayloadFailures: true });

  test.describe('seeded member', { tag: ['@credentialed'] }, () => {
    // The session is seeded from the API instead of driven through the login form: none of these
    // five tests is about logging in, and the form route cost ~15s each and made every one of them
    // fail whenever login hiccuped. MS-V2-034/035 still cover the form itself.
    test.use({ asMember: true });
    test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);

    test.beforeEach(async ({ page }) => {
      await new AccountProfilePage(page).goto();
    });

    test('MS-V2-089 account profile exposes the password change controls @smoke', async ({ page }) => {
      const profile = new AccountProfilePage(page);

      await profile.expectMemberSummary();
      await profile.expectPasswordControls();
    });

    test('MS-V2-090 change password stays disabled until every field is filled @validation', async ({ page }) => {
      const profile = new AccountProfilePage(page);

      await expect(profile.changePasswordButton).toBeDisabled();

      await profile.currentPasswordInput.fill(env.AUTH_TEST_PASSWORD!);
      await expect(profile.changePasswordButton).toBeDisabled();

      await profile.newPasswordInput.fill(throwawayAccount.rotatedPassword);
      await expect(profile.changePasswordButton).toBeDisabled();

      await profile.confirmPasswordInput.fill(throwawayAccount.rotatedPassword);
      await expect(profile.changePasswordButton).toBeEnabled();
    });

    test('MS-V2-091 a mismatched confirmation is rejected @validation', async ({ page }) => {
      const profile = new AccountProfilePage(page);

      await profile.changePassword({
        currentPassword: env.AUTH_TEST_PASSWORD!,
        newPassword: throwawayAccount.rotatedPassword,
        confirmPassword: `${throwawayAccount.rotatedPassword}-different`
      });

      await profile.expectPasswordChangeRejected(authCopy.passwordMismatch);
    });

    test('MS-V2-092 a new password below the policy is rejected @validation', async ({ page }) => {
      const profile = new AccountProfilePage(page);

      await profile.changePassword({
        currentPassword: env.AUTH_TEST_PASSWORD!,
        newPassword: 'abc'
      });

      await profile.expectPasswordChangeRejected(authCopy.passwordPolicyUnmet);
    });

    test('MS-V2-093 a wrong current password is rejected @validation', async ({ page }) => {
      const profile = new AccountProfilePage(page);

      await profile.changePassword({
        currentPassword: 'DefinitelyNotTheCurrentPassword!9',
        newPassword: throwawayAccount.rotatedPassword
      });

      await profile.expectPasswordChangeRejected(authCopy.currentPasswordWrong);
    });
  });

  test('MS-V2-094 changing a password rotates the credential end to end', { tag: ['@destructive', '@slow'] }, async ({
    page
  }) => {
    test.skip(
      !canRunDestructiveAuth,
      'MS-V2-094 registers a throwaway member and rotates its password. Set RUN_AUTH_DESTRUCTIVE_E2E=true ' +
        'against a dev environment (not production) to run it.'
    );
    test.setTimeout(180_000);

    // Registering a dedicated account keeps the rotation off the seeded member, whose password other
    // @credentialed tests depend on.
    const mailbox = await createMailTmAccount();
    const register = new RegisterPage(page);

    await register.goto();
    await register.fillDetails({
      fullName: throwawayAccount.fullName,
      email: mailbox.address,
      password: throwawayAccount.password
    });
    await register.submitAndAwaitVerificationRequest();

    const otpEmail = await waitForMailTmMessage(mailbox, (message) => /인증/.test(message.subject));
    const registered = await register.submitVerificationCode(extractOtpCode(otpEmail));
    expect(registered.status()).toBe(201);
    recordCreatedAccount({ email: mailbox.address, createdBy: 'MS-V2-094' });
    await expect(page).toHaveURL(/\/kr\/auth\/profile\/?$/);

    const profile = new AccountProfilePage(page);
    await profile.goto();
    await profile.changePassword({
      currentPassword: throwawayAccount.password,
      newPassword: throwawayAccount.rotatedPassword
    });
    await profile.expectPasswordChangeAccepted();

    const login = new LoginPage(page);

    // The rotated password must work...
    await page.context().clearCookies();
    await login.goto();
    await login.loginWithCredentials(mailbox.address, throwawayAccount.rotatedPassword);
    await new HeaderComponent(page).expectMemberMenu();

    // ...and the retired one must not.
    await page.context().clearCookies();
    await login.goto();
    await login.submitInvalidCredentials(mailbox.address, throwawayAccount.password);
    await login.expectStillAnonymous();
  });
});
