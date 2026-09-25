import type { Locator, Page, Response } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../fixtures/env.js';
import { authCopy } from '../fixtures/storefront-data.js';
import { waitForPasswordFormInteractive } from '../fixtures/hydration.js';
import { gotoStorefront } from '../fixtures/navigation.js';

export type RegistrationDetails = {
  fullName: string;
  email: string;
  password: string;
  agreeToTerms?: boolean;
  optInToPromotions?: boolean;
};

/**
 * `/kr/auth/register`.
 *
 * Registration is a two-stage flow: submitting the form only requests a verification code
 * (`POST /auth/register/verification`), and the account itself is not created until a 4-digit code
 * from the resulting email is confirmed (`POST /auth/register`). Everything up to and including the
 * request stage is safe to exercise anywhere; only `submitVerificationCode` creates an account.
 */
export class RegisterPage {
  readonly page: Page;
  readonly root: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggleButton: Locator;
  readonly agreeTermsCheckbox: Locator;
  readonly agreeTermsLabel: Locator;
  readonly termsError: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  readonly optInPromosCheckbox: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;

  readonly verificationSubmitButton: Locator;
  readonly verificationResendButton: Locator;

  readonly emailRegisteredModal: Locator;
  readonly emailRegisteredPasswordInput: Locator;
  readonly emailRegisteredContinueButton: Locator;
  readonly emailRegisteredForgotLink: Locator;
  readonly emailRegisteredCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByTestId('auth-register-page');
    this.fullNameInput = page.getByTestId('auth-register-full-name-input-control');
    this.emailInput = page.getByTestId('auth-register-email-input-control');
    this.passwordInput = page.getByTestId('auth-register-password-input-control');
    this.passwordToggleButton = page.getByTestId('auth-register-password-toggle');
    this.agreeTermsCheckbox = page.getByTestId('auth-register-agree-terms-control');
    this.agreeTermsLabel = page.getByTestId('auth-register-agree-terms');
    this.termsError = page.getByTestId('auth-register-terms-error');
    this.termsLink = page.getByTestId('auth-register-terms-link');
    this.privacyLink = page.getByTestId('auth-register-privacy-link');
    this.optInPromosCheckbox = page.getByTestId('auth-register-opt-in-promos-control');
    this.submitButton = page.getByTestId('auth-register-submit');
    this.loginLink = page.getByTestId('auth-register-login-link');

    this.verificationSubmitButton = page.getByTestId('auth-register-verification-submit');
    this.verificationResendButton = page.getByTestId('auth-register-verification-resend');

    this.emailRegisteredModal = page.getByTestId('auth-email-registered-modal');
    this.emailRegisteredPasswordInput = page.getByTestId('auth-email-registered-password-input-control');
    this.emailRegisteredContinueButton = page.getByTestId('auth-email-registered-modal-continue');
    this.emailRegisteredForgotLink = page.getByTestId('auth-email-registered-forgot-link');
    this.emailRegisteredCloseButton = page.getByTestId('auth-email-registered-modal-close');
  }

  verificationCodeInput(position: number): Locator {
    return this.page.getByTestId(`auth-register-verification-code-${position}`);
  }

  async goto(): Promise<void> {
    const appBootstrap = Promise.allSettled([
      this.page.waitForResponse((response) => response.url().includes('/sys/kr/navigation/categories'), { timeout: 10_000 }),
      this.page.waitForResponse((response) => response.url().includes('/sys/kr/user/me'), { timeout: 10_000 })
    ]);

    await gotoStorefront(this.page, appPath('./auth/register'));
    await this.page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__));
    await appBootstrap;
    await expect(this.root).toBeVisible();
    await waitForPasswordFormInteractive(this.passwordToggleButton, this.passwordInput);
  }

  async expectRegisterControls(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: authCopy.registerHeading })).toBeVisible();
    await expect(this.fullNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
    await expect(this.passwordToggleButton).toBeVisible();
    await expect(this.agreeTermsLabel).toBeVisible();
    await expect(this.termsLink).toHaveAttribute('href', /\/kr\/terms-of-use/);
    await expect(this.privacyLink).toHaveAttribute('href', /\/kr\/privacy-policy/);
    await expect(this.optInPromosCheckbox).toBeAttached();
    await expect(this.submitButton).toBeVisible();
    await expect(this.loginLink).toBeVisible();
    await expect(this.root).toContainText(authCopy.registerPasswordPolicy);
  }

  /**
   * Fills the form without submitting. `agreeToTerms` defaults to true because every path that goes
   * on to submit needs it; negative tests pass false explicitly.
   */
  async fillDetails({ fullName, email, password, agreeToTerms = true, optInToPromotions = false }: RegistrationDetails): Promise<void> {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (agreeToTerms) {
      await this.agreeToTerms();
    }

    if (optInToPromotions) {
      await this.optInPromosCheckbox.check({ force: true });
    }
  }

  /**
   * Ticks the terms checkbox. The input itself is visually replaced by a styled box, so it is
   * checked directly rather than through a normal actionability pass.
   */
  async agreeToTerms(): Promise<void> {
    await this.agreeTermsCheckbox.check({ force: true });
  }

  async submit(): Promise<void> {
    await this.submitButton.click({ force: true });
  }

  /** Submits and waits for the verification-code request the server answers with 201. */
  async submitAndAwaitVerificationRequest(): Promise<void> {
    const verificationRequested = this.page.waitForResponse(
      (response) => response.url().includes('/sys/kr/auth/register/verification') && response.status() === 201,
      { timeout: 30_000 }
    );

    await this.submit();
    await verificationRequested;
    await this.expectVerificationModal();
  }

  async expectVerificationModal(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: authCopy.registerOtpHeading })).toBeVisible();
    await expect(this.verificationCodeInput(1)).toBeVisible();
    await expect(this.verificationResendButton).toBeVisible();
  }

  async fillVerificationCode(code: string): Promise<void> {
    if (!/^\d{4}$/.test(code)) {
      throw new Error(`Expected a 4-digit verification code, received "${code}".`);
    }

    for (let position = 1; position <= 4; position += 1) {
      await this.verificationCodeInput(position).fill(code[position - 1]);
    }
  }

  /**
   * Confirms the code and waits for the account-creation call. The endpoint answers 201 only when
   * the code matches; a mismatch is also an HTTP 200 carrying `success: false`, so the status alone
   * distinguishes the two outcomes.
   */
  async submitVerificationCode(code: string): Promise<Response> {
    await this.fillVerificationCode(code);

    const registered = this.page.waitForResponse(
      (response) => response.url().includes('/sys/kr/auth/register') && !response.url().includes('/verification'),
      { timeout: 30_000 }
    );

    await this.verificationSubmitButton.click({ force: true });

    return registered;
  }

  async expectVerificationRejected(): Promise<void> {
    await expect(this.page.getByText(authCopy.registerOtpMismatch)).toBeVisible();
    await expect(this.verificationCodeInput(1)).toBeVisible();
  }

  async openLogin(): Promise<void> {
    await this.loginLink.click();
    await expect(this.page).toHaveURL(/\/kr\/auth\/login\/?$/);
  }

  async togglePasswordVisibility(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
    await this.passwordToggleButton.click();
    await expect(this.passwordInput).toHaveAttribute('type', 'text');
    await this.passwordToggleButton.click();
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  /** The single field-level error the form renders for whichever rule it rejected first. */
  fieldError(): Locator {
    return this.page.getByTestId('ui-form-field-error-message');
  }
}
