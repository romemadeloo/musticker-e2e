import { expect, test } from '@playwright/test';

import { adminStorageStatePath, isAdminSessionValid } from '../fixtures/admin-auth.js';
import { activeEnvironment, adminBaseUrl } from '../fixtures/env.js';
import { waitForNuxtHydration } from '../fixtures/hydration.js';

/**
 * Captures an admin panel session for the admin specs to reuse (see tests/fixtures/admin-auth.ts):
 *
 *   E2E_ENVIRONMENT=dev-1 npm run admin:login
 *
 * A browser window opens on the panel's login page. With ADMIN_EMAIL and ADMIN_PASSWORD in .env the
 * form is filled and submitted for you; otherwise sign in yourself, with "Keep me signed in" ticked.
 * Either way the verification code goes to sales@musticker.com and has to be typed in by a person --
 * nothing here reads that inbox. Once the dashboard loads, the session is saved to
 * .auth/admin-<environment>.json (gitignored).
 *
 * If the panel shows "Active Session Detected", choosing "Logout & Continue" signs this account out
 * everywhere else, including your own browser.
 */
test('capture an admin panel session', async ({ page }) => {
  const baseURL = adminBaseUrl();
  expect(baseURL, `E2E_ENVIRONMENT=${activeEnvironment ?? '(unset)'} has no admin panel`).toBeTruthy();

  await page.goto(`${baseURL}/`);

  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (email && password) {
    const emailInput = page.getByPlaceholder('Enter your email');
    const passwordInput = page.getByPlaceholder('Enter your password');

    // The form is server-rendered and usable-looking before Vue hydrates it, and hydration resets the
    // inputs -- a fill in that window is wiped and Sign In submits an empty password (2026-10-27).
    // So wait for hydration, then confirm both values survived before submitting.
    await waitForNuxtHydration(page);
    await expect(async () => {
      await emailInput.fill(email);
      await passwordInput.fill(password);
      await expect(emailInput).toHaveValue(email, { timeout: 1_000 });
      await expect(passwordInput).toHaveValue(password, { timeout: 1_000 });
    }).toPass({ timeout: 20_000 });

    // A hidden <input> inside a styled label: there is no accessible checkbox to find by role.
    const keepSignedIn = page.locator('#login-remember label');
    if (!(await keepSignedIn.locator('input[type="checkbox"]').isChecked())) {
      await keepSignedIn.click();
    }
    await expect(keepSignedIn.locator('input[type="checkbox"]'), '"Keep me signed in" ticked').toBeChecked();

    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Verification Required'), 'the panel did not accept the email and password').toBeVisible({
      timeout: 20_000
    });
    console.log('\nSigned in. Enter the verification code sent to sales@musticker.com in the browser window.\n');
  } else {
    console.log('\nSign in in the browser window (tick "Keep me signed in"), then enter the verification code.\n');
  }

  await page.waitForURL(/\/dashboard/, { timeout: 9 * 60_000 });

  const path = adminStorageStatePath();
  await page.context().storageState({ path });
  expect(await isAdminSessionValid(page.context().request), 'the captured session was not accepted by /auth/admin/me').toBe(
    true
  );

  console.log(`\nAdmin session for ${activeEnvironment} saved to ${path}\n`);
});
