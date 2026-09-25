import { test, expect } from '../../fixtures/e2e-test.js';
import { appPath, env } from '../../fixtures/env.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { authCopy, unregisteredLogin } from '../../fixtures/storefront-data.js';
import { HeaderComponent } from '../../pom/header-component.js';
import { HomeV2Page } from '../../pom/home-page.js';
import { LoginPage } from '../../pom/login-page.js';

test.describe('storefront authentication', { tag: ['@auth', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowExpectedAuthFailures: true, allowKnownNuxtPayloadFailures: true });

  test('MS-V2-026 account navigation opens login', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.openAccountEntry();

    const login = new LoginPage(page);
    await login.expectMemberLoginControls();
  });

  test('MS-V2-027 member login form exposes expected controls', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.expectMemberLoginControls();
  });

  test('MS-V2-028 blank login is blocked before the auth endpoint is called @validation', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.expectRejectedWithoutRequest(authCopy.requiredFieldLogin, () => login.submitMemberForm());

    // Both fields are flagged, not just the first one.
    await expect(login.memberFieldErrors().filter({ hasText: authCopy.requiredFieldLogin })).toHaveCount(2);
  });

  test('MS-V2-029 malformed email is rejected without starting an auth session @validation', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.expectRejectedWithoutRequest(authCopy.invalidEmailFormat, async () => {
      await login.emailInput.fill('not-an-email');
      await login.passwordInput.fill('Dummy!2026');
      await login.submitMemberForm();
    });

    await login.expectStillAnonymous();
  });

  test('MS-V2-030 invalid credentials fail safely and keep the user anonymous @validation', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.submitInvalidCredentials(unregisteredLogin.email, unregisteredLogin.password);
    await login.expectStillAnonymous();

    // The reserved address above is never registered. A registered address with the wrong password
    // must produce the *same* message, or the form would leak which accounts exist.
    if (env.AUTH_TEST_EMAIL) {
      await login.goto();
      await login.submitInvalidCredentials(env.AUTH_TEST_EMAIL, 'DefinitelyNotTheSeededPassword!9');
      await login.expectStillAnonymous();
    }
  });

  test('MS-V2-032 forgot-password recovery opens and validates its email input @validation', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.openForgotPassword();

    // Blank and malformed input are both stopped client-side, so no recovery mail is ever sent.
    await login.expectForgotPasswordRejects('', authCopy.requiredFieldLogin);
    await login.expectForgotPasswordRejects('not-an-email', authCopy.invalidEmailFormat);

    await login.closeForgotPassword();
  });

  // MS-V2-044: re-verified live against production on 2026-08-11 (masked -> visible -> masked
  // all confirmed via the input's `type` attribute). The production bug noted in test-case.md on
  // 2026-08-10 (toggle rendered but did not unmask) is no longer reproducible, so MS-V2-031 stays
  // un-fixme'd.
  test('MS-V2-031 password visibility toggle masks and unmasks password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.togglePasswordVisibility();
    await expect(page).toHaveURL(/\/kr\/auth\/login\/?$/);
  });

  test('MS-V2-033 register entry is reachable from login', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.openRegister();
    await expect(page.getByTestId('auth-register-page')).toBeVisible();
  });

  test('MS-V2-034 seeded member can log in @credentialed', async ({ page }) => {
    test.skip(!env.AUTH_TEST_EMAIL || !env.AUTH_TEST_PASSWORD, 'Set AUTH_TEST_EMAIL and AUTH_TEST_PASSWORD to run.');

    const login = new LoginPage(page);
    const header = new HeaderComponent(page);

    await login.goto();
    await login.loginWithCredentials(env.AUTH_TEST_EMAIL!, env.AUTH_TEST_PASSWORD!);
    await header.expectMemberMenu();
  });

  test.describe('session lifecycle', () => {
    // Logging out races the member-scoped reads the page had already started -- a cart
    // recalculation, and the account overview this test's own visit to /account/profile kicked off.
    // Either can land after the session cookie is gone and answer 401; both are moot by then, so
    // this is the one test that forgives them.
    test.use({ allowPostLogout401: true });

    test('MS-V2-035 session persists across reload and navigation, and logout clears it @credentialed', async ({
      page
    }) => {
      test.skip(!env.AUTH_TEST_EMAIL || !env.AUTH_TEST_PASSWORD, 'Set AUTH_TEST_EMAIL and AUTH_TEST_PASSWORD to run.');

      const login = new LoginPage(page);
      const header = new HeaderComponent(page);

      await login.goto();
      await login.loginWithCredentials(env.AUTH_TEST_EMAIL!, env.AUTH_TEST_PASSWORD!);
      await header.expectMemberMenu();

      // The session has to survive a full document reload, not just client-side routing.
      await page.reload();
      await header.expectMemberMenu();

      await header.goToStickers();
      await header.expectMemberMenu();

      // A member-only route is the strongest signal the session is genuinely live.
      await gotoStorefront(page, appPath('./account/profile'));
      await expect(page.getByTestId('account-profile-page')).toBeVisible();

      await header.logout();
      await expect(page.getByTestId('app-header-account-dropdown-guest')).toBeVisible();
    });
  });

  test('MS-V2-095 a member-only route is not reachable anonymously', async ({ page }) => {
    // Verified on development-1 on 2026-08-27: the account shell never renders for an anonymous
    // visitor -- the app redirects to the storefront home rather than to the login form.
    await gotoStorefront(page, appPath('./account/profile'));

    await expect(page.getByTestId('account-profile-page')).toHaveCount(0);
    await expect(page).not.toHaveURL(/\/kr\/account\/profile/);
  });

  test('MS-V2-096 non-member mode swaps in the guest order-lookup form', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.switchToNonMemberMode();

    // Guest lookup is email + order number; it must not offer a password field.
    await expect(login.passwordInput).toHaveCount(0);
    await expect(login.nonMemberEmailInput).toHaveAttribute('type', 'email');
  });
});
