import { adminSections } from '../../../fixtures/admin-data.js';
import { expect, test } from '../../../fixtures/e2e-test.js';
import { adminBaseUrl } from '../../../fixtures/env.js';

/**
 * A visitor with no admin session who opens any panel page lands on the sign-in form, with the page
 * they asked for kept in `?redirect=` so signing in takes them back to it. Uses the plain anonymous
 * `page`, not `adminPage`, so it needs no saved session and shows no customer data.
 *
 * Redirect shape read on dev-1, 2026-10-27: /orders -> /?redirect=/orders.
 */
test.describe('Admin sign-in guard', { tag: ['@admin', '@security', '@regression', '@production'] }, () => {
  test.skip(!adminBaseUrl(), 'This environment has no admin panel in tests/fixtures/environments.ts.');
  // The panel asks /auth/admin/me who is signed in, and the API rightly answers 401.
  test.use({ allowExpectedAuthFailures: true });

  for (const { path } of adminSections) {
    test(`MS-ADM-002 an anonymous visitor to ${path} is sent to sign in and back`, async ({ page }) => {
      await page.goto(`${adminBaseUrl()}${path}`);

      await expect(page).toHaveURL((url) => url.pathname === '/' && url.searchParams.get('redirect') === path);
      await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
      await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
      await expect(page.locator('main tbody tr.m-dt-row'), 'no admin data may render before sign-in').toHaveCount(0);
    });
  }
});
