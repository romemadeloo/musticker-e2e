import { test, expect } from '../../fixtures/e2e-test.js';
import { appPath } from '../../fixtures/env.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { expectHeadingOrHeal } from '../../fixtures/self-heal.js';
import { ko } from '../../fixtures/storefront-data.js';
import { HomeV2Page } from '../../pom/home-page.js';

test.describe('storefront v2 smoke', { tag: ['@smoke', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-V2-001 homepage loads with critical public content', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.expectCriticalContent();
  });

  test('MS-V2-002 header navigation opens product categories', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.goToCategory(ko.stickers, './stickers');
    await expectHeadingOrHeal(page, ko.stickers, 'category heading ./stickers');

    await home.goto();
    await home.goToCategory(ko.rollStickers, './roll-stickers');
    await expectHeadingOrHeal(page, ko.rollStickers, 'category heading ./roll-stickers');

    await home.goto();
    await home.goToCategory(ko.sheetStickers, './sheet-stickers');
    await expectHeadingOrHeal(page, ko.sheetStickers, 'category heading ./sheet-stickers');
  });

  test('MS-V2-003 header search opens and finds hologram sticker content', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    const search = await home.header.openSearch();
    await search.searchFor('\ud640\ub85c\uadf8\ub7a8');
    await expect(page.getByRole('dialog').getByText(/\ud640\ub85c\uadf8\ub7a8/).first()).toBeVisible();
  });

  test('MS-V2-004 empty cart opens without broken state', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    const cart = await home.header.openCart();
    await cart.expectVisible();
    await cart.expectEmpty();
  });

  test('MS-V2-005 account icon routes anonymous users to authentication', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.openAccountEntry();
    await expect(page).toHaveURL(/\/kr\/auth\/login/);
  });

  test('MS-V2-020 footer legal and support links are reachable', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.expectFooterContent();

    await expect(page.getByRole('link', { name: ko.terms }).first()).toHaveAttribute('href', /\/kr\/terms-of-use/);
    await gotoStorefront(page, appPath('./terms-of-use'));
    await expect(page).toHaveURL(/\/kr\/terms-of-use\/?$/);

    await home.goto();
    await expect(page.getByRole('link', { name: ko.privacy }).first()).toHaveAttribute('href', /\/kr\/privacy-policy/);
    await gotoStorefront(page, appPath('./privacy-policy'));
    await expect(page).toHaveURL(/\/kr\/privacy-policy\/?$/);

    await home.goto();
    await expect(page.getByRole('link', { name: ko.faq }).first()).toHaveAttribute('href', /\/kr\/faq/);
    await gotoStorefront(page, appPath('./faq'));
    await expect(page).toHaveURL(/\/kr\/faq\/?$/);
  });

  test('MS-V2-021 Korean locale control is stable', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.expectLocaleControlStable();
  });
});
