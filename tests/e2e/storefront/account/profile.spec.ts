import { test, expect } from '../../../fixtures/e2e-test.js';
import { env } from '../../../fixtures/env.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
import { AccountProfilePage } from '../../../pom/storefront/account-profile-page.js';

// The 개인 정보 and 설정 parts of /kr/account/profile; its 비밀번호 section is covered by
// auth/change-password.spec.ts. Verified live against dev-1 on 2026-11-02.
//
// Read-only on purpose: nothing is saved, no notification switch is flipped, and 회원 탈퇴 is never
// clicked -- one click on it emails the member a deletion code (POST account-deletion/validate).
test.describe('Profile', { tag: ['@regression', '@production', '@auth', '@credentialed'] }, () => {
  test.use({
    asMember: true,
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true
  });

  test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);

  test('MS-ACC-008 the profile shows the signed-in member\'s name and locked email', async ({ page }) => {
    const profile = new AccountProfilePage(page);
    await profile.goto();

    await expect(profile.fullNameInput).not.toHaveValue('');
    await expect
      .poll(async () => (await profile.emailInput.inputValue()).toLowerCase(), { message: 'the form must show the signed-in email' })
      .toBe(env.AUTH_TEST_EMAIL!.toLowerCase());
    // The email is changed only through its own 변경 flow, never by typing in the form.
    await expect(profile.emailInput).toBeDisabled();
    await expect(profile.emailChangeButton).toBeEnabled();

    // The member's name in the summary strip is the one on the form.
    const name = await profile.fullNameInput.inputValue();
    await expect(page.getByTestId('account-shell-user')).toContainText(name.trim());
  });

  test('MS-ACC-009 변경사항 저장 turns on only once the name has been edited', async ({ page }) => {
    const profile = new AccountProfilePage(page);
    await profile.goto();

    const original = await profile.fullNameInput.inputValue();
    await expect(profile.saveButton, 'nothing has changed yet, so there is nothing to save').toBeDisabled();

    await profile.fullNameInput.fill(`${original} QA`);
    await expect(profile.saveButton).toBeEnabled();

    // Putting the name back is not a change either. The form is never submitted.
    await profile.fullNameInput.fill(original);
    await expect(profile.saveButton).toBeDisabled();
  });

  test('MS-ACC-010 이메일 변경 opens its own dialog and closing it leaves the email as it was', async ({ page }) => {
    const profile = new AccountProfilePage(page);
    await profile.goto();
    const email = await profile.emailInput.inputValue();

    await profile.openEmailChange();
    await expect(profile.emailChangeModalInput).toBeEditable();
    await expect(profile.emailChangeModalConfirm).toBeVisible();

    await profile.closeEmailChange();
    await expect(profile.emailInput).toHaveValue(email);
  });

  test('MS-ACC-011 the profile offers photo upload, notification settings and account withdrawal', async ({ page }) => {
    const profile = new AccountProfilePage(page);
    await profile.goto();

    await expect(profile.photoUploadButton).toBeVisible();
    await expect(profile.photoDeleteButton).toBeVisible();
    await expect(profile.photoInput).toHaveAttribute('accept', /\.jpg/);
    await expect(profile.photoInput).toHaveAttribute('accept', /\.png/);

    // Each switch only has to be a working checkbox; which way the member left it is their choice.
    await expect(profile.settingsSection).toBeVisible();
    for (const toggle of [profile.promotionsToggle, profile.reviewRemindersToggle]) {
      await expect(toggle).toHaveAttribute('type', 'checkbox');
      await expect(toggle).toBeEnabled();
    }

    await expect(profile.withdrawButton).toBeVisible();
  });
});
