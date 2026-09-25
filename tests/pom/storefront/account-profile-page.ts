import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../fixtures/env.js';
import { authCopy } from '../fixtures/storefront-data.js';
import { waitForPasswordFormInteractive } from '../fixtures/hydration.js';
import { gotoStorefront } from '../fixtures/navigation.js';

export type PasswordChange = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

/**
 * `/kr/account/profile` -- the member account shell's profile tab, which owns the change-password
 * form alongside personal details and notification settings.
 *
 * Note that `PUT /sys/kr/profile/password` answers 200 for rejected changes as well as accepted
 * ones, carrying the outcome in the body; the form surfaces the failure as a field-level error
 * instead. Assertions here therefore go through the rendered error, never the status code.
 */
export class AccountProfilePage {
  readonly page: Page;
  readonly root: Locator;
  readonly shell: Locator;
  readonly title: Locator;

  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly saveButton: Locator;

  readonly passwordSection: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly currentPasswordToggleButton: Locator;
  readonly changePasswordButton: Locator;
  readonly forgotPasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByTestId('account-profile-page');
    this.shell = page.getByTestId('account-shell');
    this.title = page.getByTestId('account-profile-title');

    this.fullNameInput = page.getByTestId('account-profile-full_name-control');
    this.emailInput = page.getByTestId('account-profile-email-control');
    this.saveButton = page.getByTestId('account-profile-save-button');

    this.passwordSection = page.getByTestId('account-profile-password-section');
    this.currentPasswordInput = page.getByTestId('account-profile-current-password-control');
    this.newPasswordInput = page.getByTestId('account-profile-new-password-control');
    this.confirmPasswordInput = page.getByTestId('account-profile-confirm-password-control');
    // The three password fields each carry a visibility toggle; none of them has its own test id,
    // so it is reached through the labelled field wrapper.
    this.currentPasswordToggleButton = page.getByTestId('account-profile-current-password').getByRole('button').first();
    this.changePasswordButton = page.getByTestId('account-profile-change-password-button');
    this.forgotPasswordButton = page.getByTestId('account-profile-forgot-password');
  }

  async goto(): Promise<void> {
    await gotoStorefront(this.page, appPath('./account/profile'));
    await this.page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__));
    await expect(this.root).toBeVisible();
    await waitForPasswordFormInteractive(this.currentPasswordToggleButton, this.currentPasswordInput);
  }

  async expectPasswordControls(): Promise<void> {
    await expect(this.passwordSection).toBeVisible();

    for (const field of [this.currentPasswordInput, this.newPasswordInput, this.confirmPasswordInput]) {
      await expect(field).toBeVisible();
      await expect(field).toHaveAttribute('type', 'password');
    }

    await expect(this.changePasswordButton).toBeVisible();
    await expect(this.forgotPasswordButton).toBeVisible();
    await expect(this.passwordSection).toContainText(authCopy.registerPasswordPolicy);
  }

  /**
   * Fills the three password fields. `confirmPassword` defaults to `newPassword` so the happy path
   * reads cleanly; the mismatch test passes a different value explicitly.
   */
  async fillPasswordChange({ currentPassword, newPassword, confirmPassword = newPassword }: PasswordChange): Promise<void> {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  /** Submits and waits for the password call to settle, whatever its outcome. */
  async submitPasswordChange(): Promise<void> {
    const passwordCall = this.page.waitForResponse(
      (response) => response.url().includes('/sys/kr/profile/password'),
      { timeout: 30_000 }
    );

    await this.changePasswordButton.click({ force: true });
    await passwordCall;
  }

  async changePassword(details: PasswordChange): Promise<void> {
    await this.fillPasswordChange(details);
    await this.submitPasswordChange();
  }

  async expectPasswordChangeRejected(message: string): Promise<void> {
    await expect(this.passwordSection.getByTestId('ui-form-field-error-message').filter({ hasText: message })).toBeVisible();
  }

  /**
   * A change is accepted when the form clears itself and shows no field-level error. There is no
   * success toast on this form, so the cleared state is the only signal it gives.
   */
  async expectPasswordChangeAccepted(): Promise<void> {
    await expect(this.currentPasswordInput).toHaveValue('');
    await expect(this.newPasswordInput).toHaveValue('');
    await expect(this.confirmPasswordInput).toHaveValue('');
    await expect(this.passwordSection.getByTestId('ui-form-field-error-message')).toHaveCount(0);
  }

  async expectMemberSummary(): Promise<void> {
    await expect(this.shell).toBeVisible();
    await expect(this.page.getByTestId('account-shell-tab-profile')).toBeVisible();
    await expect(this.page.getByTestId('account-shell-stat-orders')).toBeVisible();
  }
}
