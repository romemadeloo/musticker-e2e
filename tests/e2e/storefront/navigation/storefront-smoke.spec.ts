import { test, expect } from '../../../fixtures/e2e-test.js';
import { appPath } from '../../../fixtures/env.js';
import { gotoStorefront } from '../../../fixtures/navigation.js';
import { expectHeadingOrHeal } from '../../../fixtures/self-heal.js';
import { categoryProducts, ko } from '../../../fixtures/storefront-data.js';
import { HomeV2Page } from '../../../pom/storefront/home-page.js';

test.describe('Storefront smoke', { tag: ['@smoke', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-NAV-001 homepage loads with critical public content', { tag: '@critical' }, async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.expectCriticalContent();
  });

  // Each nav item opens a menu of its category's products rather than the category page (changed by
  // 2026-10-14). The menu is checked by its links, not its labels: it still uses the names from
  // before the 2026-09-24 rename (키스컷, 아트지 롤, 시트 스티커 -- see MUS-QA-016), and which side is
  // right is product's call.
  test('MS-NAV-002 header navigation opens each category product menu', async ({ page }) => {
    const home = new HomeV2Page(page);
    const categories = [
      { name: ko.stickers, path: './stickers', products: categoryProducts.stickers },
      { name: ko.rollStickers, path: './roll-stickers', products: categoryProducts.rollStickers },
      { name: ko.sheetStickers, path: './sheet-stickers', products: categoryProducts.sheetStickers }
    ] as const;

    await home.goto();

    for (const category of categories) {
      await home.header.openCategoryMenu(category.name, category.path);
      expect(await home.header.categoryMenuPaths(), `${category.path} menu`).toEqual(
        category.products.map((product) => product.path)
      );
    }

    const [firstRoll] = categoryProducts.rollStickers;
    await home.header.goToProductFromMenu(ko.rollStickers, './roll-stickers', firstRoll.path);
    await expectHeadingOrHeal(page, firstRoll.name, `product heading ${firstRoll.path}`);
  });

  test('MS-NAV-003 header search opens and finds hologram sticker content', { tag: '@critical' }, async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    const search = await home.header.openSearch();
    await search.searchFor('\ud640\ub85c\uadf8\ub7a8');
    await expect(page.getByRole('dialog').getByText(/\ud640\ub85c\uadf8\ub7a8/).first()).toBeVisible();
  });

  test('MS-NAV-004 empty cart opens without broken state', { tag: '@critical' }, async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    const cart = await home.header.openCart();
    await cart.expectVisible();
    await cart.expectEmpty();
  });

  test('MS-NAV-005 account icon routes anonymous users to authentication', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.openAccountEntry();
    await expect(page).toHaveURL(/\/kr\/auth\/login/);
  });

  test('MS-NAV-006 footer legal and support links are reachable', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.expectFooterContent();

    await expect(page.getByRole('link', { name: ko.terms }).first()).toHaveAttribute('href', /\/kr\/terms-of-use/);
    await expect(page.getByRole('link', { name: ko.privacy }).first()).toHaveAttribute('href', /\/kr\/privacy-policy/);
    await expect(page.getByRole('link', { name: ko.faq }).first()).toHaveAttribute('href', /\/kr\/faq/);

    // Check all footer links on the initial home page, then visit each destination once.
    // Repeated full home loads spent the 60s budget before the final FAQ assertion.
    await gotoStorefront(page, appPath('./terms-of-use'));
    await expect(page).toHaveURL(/\/kr\/terms-of-use\/?$/);

    await gotoStorefront(page, appPath('./privacy-policy'));
    await expect(page).toHaveURL(/\/kr\/privacy-policy\/?$/);

    await gotoStorefront(page, appPath('./faq'));
    await expect(page).toHaveURL(/\/kr\/faq\/?$/);
  });

  test('MS-NAV-007 Korean locale control is stable', async ({ page }) => {
    const home = new HomeV2Page(page);

    await home.goto();
    await home.expectLocaleControlStable();
  });
});
