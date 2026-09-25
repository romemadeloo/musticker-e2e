import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../fixtures/env.js';
import { authCopy, guestOrderLookupCopy } from '../fixtures/storefront-data.js';
import { waitForPasswordFormInteractive } from '../fixtures/hydration.js';
import { gotoStorefront } from '../fixtures/navigation.js';

export class LoginPage {
  readonly page: Page;
  readonly root: Locator;
  readonly createAccountLink: Locator;
  readonly memberModeButton: Locator;
  readonly memberForm: Locator;
  readonly memberEmailError: Locator;
  readonly memberPasswordError: Locator;
  readonly nonMemberModeButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggleButton: Locator;
  readonly keepSignedInCheckbox: Locator;
  readonly forgotPasswordButton: Locator;
  readonly submitButton: Locator;
  readonly kakaoLoginButton: Locator;
  readonly naverLoginButton: Locator;
  readonly googleLoginButton: Locator;
  readonly facebookLoginButton: Locator;

  readonly nonMemberEmailInput: Locator;
  readonly nonMemberOrderNumberInput: Locator;
  readonly nonMemberSubmitButton: Locator;
  readonly nonMemberEmailError: Locator;
  readonly nonMemberOrderNumberError: Locator;

  readonly forgotPasswordEmailInput: Locator;
  readonly forgotPasswordSubmitButton: Locator;
  readonly forgotPasswordReturnButton: Locator;
  readonly forgotPasswordCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByTestId('auth-login-page');
    this.createAccountLink = page.getByTestId('auth-login-create-account-link');
    this.memberModeButton = page.getByTestId('auth-login-mode-member-active-button');
    this.memberForm = page.getByTestId('auth-login-member-form');
    // The login form labels each field's error individually rather than reusing the shared
    // `ui-form-field-error-message` test id the register form uses.
    this.memberEmailError = page.getByTestId('auth-login-member-email-error');
    this.memberPasswordError = page.getByTestId('auth-login-member-password-error');
    this.nonMemberModeButton = page.getByTestId('auth-login-mode-non-member-inactive-button');
    this.emailInput = page.getByTestId('auth-login-member-email-input-control');
    this.passwordInput = page.getByTestId('auth-login-member-password-input-control');
    this.passwordToggleButton = page.getByTestId('auth-login-member-password-toggle-button');
    this.keepSignedInCheckbox = page.getByTestId('auth-login-member-keep-signed-in-control');
    this.forgotPasswordButton = page.getByTestId('auth-login-member-forgot-password-button');
    this.submitButton = page.getByTestId('auth-login-submit-member-button');
    this.kakaoLoginButton = page.getByTestId('auth-login-social-kakao');
    this.naverLoginButton = page.getByTestId('auth-login-social-naver');
    this.googleLoginButton = page.getByTestId('auth-login-social-google');
    this.facebookLoginButton = page.getByTestId('auth-login-social-facebook').first();

    this.nonMemberEmailInput = page.getByTestId('auth-login-non-member-email-input-control');
    this.nonMemberOrderNumberInput = page.getByTestId('auth-login-non-member-order-number-input-control');
    this.nonMemberSubmitButton = page.getByTestId('auth-login-submit-non-member-button');
    // Guest lookup labels each field's error individually, the same way the member form does.
    this.nonMemberEmailError = page.getByTestId('auth-login-non-member-email-error');
    this.nonMemberOrderNumberError = page.getByTestId('auth-login-non-member-order-number-error');

    this.forgotPasswordEmailInput = page.getByTestId('auth-login-forgot-password-email-input-control');
    this.forgotPasswordSubmitButton = page.getByTestId('auth-login-forgot-password-submit-button');
    this.forgotPasswordReturnButton = page.getByTestId('auth-login-forgot-password-return-button');
    this.forgotPasswordCloseButton = page.getByTestId('auth-login-forgot-password-close-button');
  }

  async goto(): Promise<void> {
    const appBootstrap = Promise.allSettled([
      this.page.waitForResponse((response) => response.url().includes('/sys/kr/navigation/categories'), { timeout: 10_000 }),
      this.page.waitForResponse((response) => response.url().includes('/sys/kr/user/me'), { timeout: 10_000 }),
      this.page.waitForResponse((response) => response.url().includes('/sys/kr/inquiry/types'), { timeout: 10_000 })
    ]);

    await gotoStorefront(this.page, appPath('./auth/login'));
    await this.page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__));
    await appBootstrap;
    await expect(this.root).toBeVisible();
    await waitForPasswordFormInteractive(this.passwordToggleButton, this.passwordInput);
  }

  async expectMemberLoginControls(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: '\ub85c\uadf8\uc778' })).toBeVisible();
    await expect(this.createAccountLink).toBeVisible();
    await expect(this.memberModeButton).toBeVisible();
    await expect(this.nonMemberModeButton).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
    await expect(this.passwordToggleButton).toBeVisible();
    await expect(this.keepSignedInCheckbox).toBeVisible();
    await expect(this.forgotPasswordButton).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.kakaoLoginButton).toBeVisible();
    await expect(this.naverLoginButton).toBeVisible();
    await expect(this.googleLoginButton).toBeVisible();
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordInput.fill('temporary-secret');
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
    await this.passwordToggleButton.click();
    await expect(this.passwordInput).toHaveAttribute('type', 'text');
    await this.passwordToggleButton.click();
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  /**
   * Submits whatever is currently in the member form without waiting for a network call. The form
   * validates client-side first, so blank and malformed input never reach the server at all.
   */
  async submitMemberForm(): Promise<void> {
    await this.submitButton.click({ force: true });
  }

  /** Field-level errors currently rendered inside the member login form. */
  memberFieldErrors(): Locator {
    return this.memberEmailError.or(this.memberPasswordError);
  }

  /**
   * Asserts the form rejected the attempt locally: the named error is shown, the URL is unchanged,
   * and -- the part that matters -- no login request was ever issued.
   */
  async expectRejectedWithoutRequest(message: string, attempt: () => Promise<void>): Promise<void> {
    const loginRequests: string[] = [];
    const recordLoginRequest = (request: import('@playwright/test').Request): void => {
      if (request.method() === 'POST' && request.url().includes('/sys/kr/auth/login')) {
        loginRequests.push(request.url());
      }
    };

    this.page.on('request', recordLoginRequest);

    try {
      await attempt();
      await expect(this.memberFieldErrors().filter({ hasText: message }).first()).toBeVisible();
    } finally {
      this.page.off('request', recordLoginRequest);
    }

    expect(loginRequests, 'Login form must validate before contacting the auth endpoint').toEqual([]);
    await expect(this.page).toHaveURL(/\/kr\/auth\/login\/?$/);
  }

  /**
   * Submits credentials the server is expected to reject and waits for the failed attempt. The
   * endpoint answers HTTP 200 with `success: false` rather than a 4xx, so the rejection is read off
   * the rendered error rather than the status.
   */
  async submitInvalidCredentials(email: string, password: string): Promise<void> {
    const loginAttempt = this.page.waitForResponse(
      (response) => response.url().includes('/sys/kr/auth/login') && response.request().method() === 'POST',
      { timeout: 30_000 }
    );

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click({ force: true });
    await loginAttempt;

    await expect(this.memberFieldErrors().filter({ hasText: authCopy.invalidCredentials }).first()).toBeVisible();
  }

  /** The user must still be anonymous: no member dropdown, still on the login route. */
  async expectStillAnonymous(): Promise<void> {
    await expect(this.page.getByTestId('app-header-account-dropdown-member')).toHaveCount(0);
    await expect(this.page).toHaveURL(/\/kr\/auth\/login\/?$/);
  }

  async openForgotPassword(): Promise<void> {
    await this.forgotPasswordButton.click();
    await expect(this.page.getByRole('heading', { name: authCopy.forgotPasswordHeading })).toBeVisible();
    await expect(this.forgotPasswordEmailInput).toBeVisible();
    await expect(this.forgotPasswordSubmitButton).toBeVisible();
  }

  /**
   * Submits the recovery form and expects the named validation error. Only ever called with blank or
   * malformed input, so no recovery mail is sent -- the form stops before the request.
   */
  async expectForgotPasswordRejects(email: string, message: string): Promise<void> {
    await this.forgotPasswordEmailInput.fill(email);
    await this.forgotPasswordSubmitButton.click({ force: true });

    await expect(
      this.page.getByTestId('ui-form-field-error-message').filter({ hasText: message }).first()
    ).toBeVisible();
  }

  async closeForgotPassword(): Promise<void> {
    await this.forgotPasswordReturnButton.click();
    await expect(this.forgotPasswordSubmitButton).toHaveCount(0);
    await expect(this.memberForm).toBeVisible();
  }

  async switchToNonMemberMode(): Promise<void> {
    await this.nonMemberModeButton.click();
    await expect(this.nonMemberEmailInput).toBeVisible();
    await expect(this.nonMemberOrderNumberInput).toBeVisible();
    await expect(this.nonMemberSubmitButton).toBeVisible();
    await expect(this.memberForm).toHaveCount(0);
  }

  /**
   * Submits the guest order lookup and waits for the attempt to settle.
   *
   * `POST /sys/kr/auth/login/guest/verification` answers HTTP 200 for an unknown order and carries
   * the refusal in the body, so the outcome is read off the rendered error rather than the status --
   * the same shape as the member login endpoint.
   */
  async submitGuestOrderLookup(email: string, orderNumber: string): Promise<void> {
    const lookupAttempt = this.page.waitForResponse(
      (response) =>
        response.url().includes('/sys/kr/auth/login/guest/verification') && response.request().method() === 'POST',
      { timeout: 30_000 }
    );

    await this.nonMemberEmailInput.fill(email);
    await this.nonMemberOrderNumberInput.fill(orderNumber);
    await this.nonMemberSubmitButton.click({ force: true });
    await lookupAttempt;
  }

  /** The message the guest lookup rejected the attempt with, once one is rendered. */
  async captureGuestOrderLookupRefusal(): Promise<string> {
    const error = this.nonMemberEmailError.or(this.nonMemberOrderNumberError).first();
    await expect(error).toBeVisible({ timeout: 20_000 });

    return (await error.innerText()).trim();
  }

  /**
   * Asserts blank guest lookup is refused locally: both fields are marked required and -- the part
   * that matters -- nothing is sent to the lookup endpoint.
   */
  async expectBlankGuestOrderLookupRejected(): Promise<void> {
    const lookupRequests: string[] = [];
    const recordLookup = (request: import('@playwright/test').Request): void => {
      if (request.method() === 'POST' && request.url().includes('/sys/kr/auth/login/guest/verification')) {
        lookupRequests.push(request.url());
      }
    };

    this.page.on('request', recordLookup);

    try {
      await this.nonMemberEmailInput.fill('');
      await this.nonMemberOrderNumberInput.fill('');
      await this.nonMemberSubmitButton.click({ force: true });

      await expect(this.nonMemberEmailError).toHaveText(guestOrderLookupCopy.requiredField);
      await expect(this.nonMemberOrderNumberError).toHaveText(guestOrderLookupCopy.requiredField);
    } finally {
      this.page.off('request', recordLookup);
    }

    expect(lookupRequests, 'guest lookup must validate before contacting the endpoint').toEqual([]);
  }

  async openRegister(): Promise<void> {
    await this.createAccountLink.click();
    await expect(this.page).toHaveURL(/\/kr\/auth\/register\/?$/);
  }

  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.enterCredentialsWithFill(email, password);
    await this.expectCredentialsEntered(email, password);

    const loginSucceeded = await this.submitWithEnter();

    if (!loginSucceeded) {
      await this.submitWithClick();
    }

    await expect(this.page.getByTestId('ui-toast')).toContainText('\ub85c\uadf8\uc778\uc5d0 \uc131\uacf5\ud588\uc2b5\ub2c8\ub2e4');
  }

  private async submitWithEnter(): Promise<boolean> {
    const loginResponse = this.waitForSuccessfulLoginResponse(12_000);

    await this.page.keyboard.press('Enter');

    return loginResponse
      .then(() => true)
      .catch(() => false);
  }

  private async submitWithClick(): Promise<void> {
    const loginResponse = this.waitForSuccessfulLoginResponse(20_000);

    await this.submitButton.click({ force: true });
    await loginResponse;
  }

  private async waitForSuccessfulLoginResponse(timeout: number): Promise<void> {
    await this.page.waitForResponse(
      (response) => response.url().includes('/sys/kr/auth/login') && response.status() === 200,
      { timeout }
    );
  }

  private async enterCredentialsWithFill(email: string, password: string): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);

      if ((await this.emailInput.inputValue()) === email && (await this.passwordInput.inputValue()).length === password.length) {
        return;
      }
    }

    throw new Error('Login credentials were not retained by the form fields.');
  }

  private async expectCredentialsEntered(email: string, password: string): Promise<void> {
    if ((await this.emailInput.inputValue()) !== email || (await this.passwordInput.inputValue()).length !== password.length) {
      throw new Error('Login credentials were not retained by the form fields.');
    }
  }
}
