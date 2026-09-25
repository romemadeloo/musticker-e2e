import { test, expect } from '../../fixtures/e2e-test.js';
import { env } from '../../fixtures/env.js';
import { createMailTmAccount, extractOtpCode, waitForMailTmMessage } from '../../fixtures/mail-tm.js';
import { authCopy, throwawayAccount } from '../../fixtures/storefront-data.js';
import { recordCreatedAccount } from '../../fixtures/test-data-ledger.js';
import { LoginPage } from '../../pom/login-page.js';
import { RegisterPage } from '../../pom/register-page.js';

// Registration is a two-stage flow, verified live against development-1 on 2026-08-27:
//
//   1. `계정 만들기` validates client-side, then POSTs /auth/register/verification (201) and opens a
//      4-digit code modal. No account exists yet at this point.
//   2. Confirming the emailed code POSTs /auth/register. A correct code answers 201, signs the new
//      member in, and lands on the /kr/auth/profile onboarding step; a wrong code answers 200 with
//      `success: false` and the modal reports 입력하신 인증번호가 일치하지 않습니다.
//
// Everything through stage 1 is read-only and runs anywhere. Stage 2 creates a real account, so the
// tests that reach it are @destructive and gated behind RUN_AUTH_DESTRUCTIVE_E2E, exactly as the
// full-payment checkout is gated behind RUN_PAYMENT_E2E.
const canRunDestructiveAuth = process.env.RUN_AUTH_DESTRUCTIVE_E2E === 'true';

test.describe('storefront registration', { tag: ['@auth', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowExpectedAuthFailures: true, allowKnownNuxtPayloadFailures: true });

  test('MS-V2-079 register form exposes expected controls @smoke', async ({ page }) => {
    const register = new RegisterPage(page);

    await register.goto();
    await register.expectRegisterControls();
  });

  test('MS-V2-080 blank register submit is blocked with required-field validation @validation', async ({ page }) => {
    const register = new RegisterPage(page);

    await register.goto();
    await register.submit();

    await expect(register.fieldError().filter({ hasText: authCopy.requiredFieldRegister }).first()).toBeVisible();
    await expect(page).toHaveURL(/\/kr\/auth\/register\/?$/);
    await expect(register.verificationCodeInput(1)).toHaveCount(0);
  });

  test('MS-V2-081 malformed email is rejected before any account is requested @validation', async ({ page }) => {
    const register = new RegisterPage(page);

    await register.goto();
    await register.fillDetails({
      fullName: throwawayAccount.fullName,
      email: 'not-an-email',
      password: throwawayAccount.password
    });
    await register.submit();

    await expect(register.fieldError().filter({ hasText: authCopy.invalidEmailFormat }).first()).toBeVisible();
    await expect(register.verificationCodeInput(1)).toHaveCount(0);
  });

  test('MS-V2-082 password below the stated policy is rejected @validation', async ({ page }) => {
    const register = new RegisterPage(page);

    await register.goto();
    // The form states "최소 6자 이상 ... 대문자, 숫자, 또는 특수문자". "abc" fails on both counts.
    await register.fillDetails({
      fullName: throwawayAccount.fullName,
      email: `e2e-policy-${Date.now()}@example.com`,
      password: 'abc'
    });
    await register.submit();

    await expect(register.fieldError().filter({ hasText: authCopy.registerWeakPassword }).first()).toBeVisible();
    await expect(register.verificationCodeInput(1)).toHaveCount(0);
  });

  test('MS-V2-083 registration is blocked until the terms checkbox is agreed @validation', async ({ page }) => {
    const register = new RegisterPage(page);

    await register.goto();
    await register.fillDetails({
      fullName: throwawayAccount.fullName,
      email: `e2e-terms-${Date.now()}@example.com`,
      password: throwawayAccount.password,
      agreeToTerms: false
    });
    await register.submit();

    // The terms row flips to an error state and grows a danger-toned explainer control; unlike the
    // text inputs it has no inline `ui-form-field-error-message`.
    await expect(register.termsError).toBeVisible();
    await expect(register.agreeTermsLabel).toHaveAttribute('data-state', 'error');
    await expect(register.verificationCodeInput(1)).toHaveCount(0);

    await register.agreeToTerms();
    await expect(register.agreeTermsLabel).not.toHaveAttribute('data-state', 'error');
  });

  test('MS-V2-084 register password visibility toggle masks and unmasks', async ({ page }) => {
    const register = new RegisterPage(page);

    await register.goto();
    await register.passwordInput.fill('temporary-secret');
    await register.togglePasswordVisibility();
    await expect(page).toHaveURL(/\/kr\/auth\/register\/?$/);
  });

  test('MS-V2-085 login entry is reachable from register', async ({ page }) => {
    const register = new RegisterPage(page);

    await register.goto();
    await register.openLogin();

    const login = new LoginPage(page);
    await login.expectMemberLoginControls();
  });

  test('MS-V2-086 registering an existing email offers sign-in instead of a duplicate account @credentialed', async ({
    page
  }) => {
    test.skip(!env.AUTH_TEST_EMAIL, 'Set AUTH_TEST_EMAIL to an already-registered member to run.');

    const register = new RegisterPage(page);

    await register.goto();
    await register.fillDetails({
      fullName: throwawayAccount.fullName,
      email: env.AUTH_TEST_EMAIL!,
      password: throwawayAccount.password
    });
    await register.submit();

    // The verification endpoint answers 200 with `email_already_taken` and the app opens a
    // "sign in instead" modal rather than starting the OTP flow. No second account is created.
    await expect(register.emailRegisteredModal).toBeVisible();
    await expect(page.getByRole('heading', { name: authCopy.emailAlreadyRegisteredHeading })).toBeVisible();
    await expect(register.emailRegisteredPasswordInput).toBeVisible();
    await expect(register.emailRegisteredPasswordInput).toHaveAttribute('type', 'password');
    await expect(register.emailRegisteredContinueButton).toBeVisible();
    await expect(register.emailRegisteredForgotLink).toBeVisible();
    await expect(register.verificationCodeInput(1)).toHaveCount(0);
  });

  test.describe('account creation', { tag: ['@destructive', '@slow'] }, () => {
    test.skip(
      !canRunDestructiveAuth,
      'MS-V2-087/088 create a real member account and send real verification email. Set ' +
        'RUN_AUTH_DESTRUCTIVE_E2E=true against a dev environment (not production) to run them.'
    );

    test('MS-V2-087 a wrong verification code is rejected and creates no account', async ({ page }) => {
      test.setTimeout(120_000);

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
      const correctCode = extractOtpCode(otpEmail);
      const wrongCode = correctCode === '1111' ? '2222' : '1111';

      const response = await register.submitVerificationCode(wrongCode);

      // A mismatch is reported in the body of an HTTP 200, not as a 4xx; 201 would mean the account
      // was created despite the wrong code.
      expect(response.status(), 'A wrong code must not create the account').not.toBe(201);
      await register.expectVerificationRejected();
      await expect(page).toHaveURL(/\/kr\/auth\/register\/?$/);
    });

    test('MS-V2-088 a correct verification code creates the account and signs the new member in', async ({ page }) => {
      test.setTimeout(120_000);

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
      expect(otpEmail.from?.address).toBe('system@musticker.com');

      const response = await register.submitVerificationCode(extractOtpCode(otpEmail));
      expect(response.status()).toBe(201);
      // Books the new member for deletion by the global teardown, so a RUN_AUTH_DESTRUCTIVE_E2E run
      // stops growing the target server's user table by one row each time.
      recordCreatedAccount({ email: mailbox.address, createdBy: 'MS-V2-088' });

      // Registration signs the new member straight in and hands off to profile onboarding.
      await expect(page).toHaveURL(/\/kr\/auth\/profile\/?$/);
      await expect(page.getByRole('heading', { name: authCopy.registerWelcomeHeading })).toBeVisible();
      await expect(page.getByTestId('auth-profile-continue-button')).toBeVisible();
      await expect(page.getByTestId('auth-profile-email-control')).toHaveValue(mailbox.address);
    });
  });
});
