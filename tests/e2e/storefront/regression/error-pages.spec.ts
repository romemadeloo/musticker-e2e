import { test, expect } from '../../fixtures/e2e-test.js';
import { appPath } from '../../fixtures/env.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { ko } from '../../fixtures/storefront-data.js';

const unknownRoute = 'this-page-does-not-exist-e2e-check';

test.describe('storefront v2 error handling', { tag: ['@regression', '@production'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowExpectedNotFound: true
  });

  // Production behavior changed after the 2026-08-11 observation: unknown routes under /kr used to
  // redirect silently to the homepage with a 200. They now return a real 404 and render a dedicated
  // not-found page, so this asserts that page and its way back home rather than a redirect.
  test('MS-V2-043 unknown route serves the 404 page with a working way back home', async ({ page }) => {
    const response = await gotoStorefront(page, appPath(`./${unknownRoute}`));

    expect(response?.status(), 'unknown route should return a not-found status').toBe(404);
    await expect(page.getByRole('heading', { name: ko.notFoundHeading })).toBeVisible();

    const backHome = page.getByRole('button', { name: ko.backToHome });
    const homeHeading = page.getByRole('heading', { name: ko.homeHero });

    // The button routes client-side, but the 404 page is server-rendered and only hydrates a second
    // or so later, so a click that lands first is swallowed. Retry until the navigation takes.
    await expect(async () => {
      if (page.url().includes(unknownRoute)) {
        await backHome.click();
      }

      await expect(homeHeading).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });
  });
});
