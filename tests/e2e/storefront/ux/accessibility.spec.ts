import { test, expect } from '../../../fixtures/e2e-test.js';
import { appPath } from '../../../fixtures/env.js';
import { waitForNuxtHydration } from '../../../fixtures/hydration.js';
import { findRawTranslationKeys, i18nScanPages, KNOWN_I18N_KEY_LEAKS } from '../../../fixtures/i18n-keys.js';
import { gotoStorefront } from '../../../fixtures/navigation.js';
import { ko } from '../../../fixtures/storefront-data.js';
import { HeaderComponent } from '../../../pom/storefront/header-component.js';

test.describe('Accessibility', { tag: ['@regression', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-UX-001 core controls are named and keyboard reachable', async ({ page }) => {
    await gotoStorefront(page, appPath());

    await expect(page.getByTestId('app-header-search-button')).toBeVisible();
    await expect(page.getByTestId('app-header-cart-button')).toBeVisible();
    await expect(page.getByTestId('app-header-account-toggle-button')).toBeVisible();
    await expect(page.getByRole('link', { name: ko.stickers, exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: ko.fastOrder })).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();

    const header = new HeaderComponent(page);
    const searchDialog = await header.openSearch();
    await expect(searchDialog.dialog).toBeVisible();
    await searchDialog.closeWithEscape();
    await expect(searchDialog.dialog).toBeHidden();
  });

  test('MS-UX-005 pages show no untranslated i18n keys beyond the recorded defect', async ({ page }) => {
    for (const target of i18nScanPages) {
      await test.step(`scan ${target.name}`, async () => {
        await gotoStorefront(page, appPath(target.path));
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
        // Labels are bound on the client, so scan the hydrated page, not the server HTML.
        await waitForNuxtHydration(page);

        const keys = await findRawTranslationKeys(page);
        const unknown = keys.filter((key) => !KNOWN_I18N_KEY_LEAKS.includes(key));

        expect(unknown, `untranslated keys on ${target.name}`).toEqual([]);
      });
    }
  });
});
