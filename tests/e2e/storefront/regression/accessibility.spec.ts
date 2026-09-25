import { test, expect } from '../../fixtures/e2e-test.js';
import { appPath } from '../../fixtures/env.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { ko } from '../../fixtures/storefront-data.js';
import { HeaderComponent } from '../../pom/header-component.js';

test.describe('storefront v2 accessibility smoke', { tag: ['@regression', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-V2-023 core controls are named and keyboard reachable', async ({ page }) => {
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
});
