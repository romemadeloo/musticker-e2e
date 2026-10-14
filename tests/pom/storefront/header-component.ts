import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { waitForNuxtHydration } from '../../fixtures/hydration.js';
import { locateOrHeal } from '../../fixtures/self-heal.js';
import { ko } from '../../fixtures/storefront-data.js';
import { CartDrawer } from './cart-drawer.js';
import { SearchDialog } from './search-dialog.js';

export type CategoryPath = './stickers' | './roll-stickers' | './sheet-stickers';

function categoryHref(path: CategoryPath): string {
  return `/${path.replace(/^\.\//, '')}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class HeaderComponent {
  readonly page: Page;
  readonly root: Locator;
  readonly logo: Locator;
  readonly searchButton: Locator;
  readonly cartButton: Locator;
  readonly cartCount: Locator;
  readonly accountButton: Locator;
  readonly categoryMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole('banner');
    this.logo = this.root.getByRole('link', { name: 'Musticker' });
    this.searchButton = page.getByTestId('app-header-search-button');
    this.cartButton = page.getByTestId('app-header-cart-button');
    this.cartCount = page.getByTestId('app-header-cart-count');
    this.accountButton = page.getByTestId('app-header-account-toggle-button');
    this.categoryMenu = page.getByTestId('category-nav-dropdown');
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.logo).toBeVisible();
    await expect(this.searchButton).toBeVisible();
    await expect(this.cartButton).toBeVisible();
    await expect(this.accountButton).toBeVisible();
  }

  /**
   * The badge on the cart button. It is an independent read of the cart's size from the drawer's own
   * line items, so the two disagreeing is itself a defect worth catching.
   */
  async expectCartCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartCount).toHaveCount(0, { timeout: 15_000 });
      return;
    }

    await expect(this.cartCount).toHaveText(String(expected), { timeout: 15_000 });
  }

  async goHome(): Promise<void> {
    await this.logo.click();
    await expect(this.page).toHaveURL(/\/kr\/?$/);
  }

  /** Client-side navigation to a product page through the 스티커 menu. */
  async goToStickers(): Promise<void> {
    await this.goToProductFromMenu(ko.stickers, './stickers', './stickers/die-cut-sticker');
  }

  /**
   * Opens a category's product menu. Since early October 2026 a nav item no longer navigates to its
   * category page: clicking it sets aria-expanded and opens `category-nav-dropdown`, a panel listing
   * that category's products. The category pages themselves still exist, reached by URL.
   *
   * The nav items are plain links underneath, so a click that lands before Nuxt has bound the handler
   * navigates to the category page instead (which is how the old category-page assertion kept passing
   * on static-1), so every click waits for hydration first. On its own category page the link opens
   * no menu at all, so if a click still navigated, the retry goes back first. It never clicks a menu
   * that already reports open, since a second click closes it.
   */
  async openCategoryMenu(linkName: string, path: CategoryPath): Promise<Locator> {
    const link = await this.categoryLink(linkName, path);
    const startUrl = this.page.url();

    await expect(async () => {
      if (this.page.url() !== startUrl) {
        await this.page.goBack();
        await expect(this.page).toHaveURL(startUrl);
      }

      await waitForNuxtHydration(this.page);

      if ((await link.getAttribute('aria-expanded')) !== 'true') {
        await link.click();
      }

      await expect(link).toHaveAttribute('aria-expanded', 'true', { timeout: 2_000 });
    }).toPass({ timeout: 45_000 });
    await expect(this.categoryMenu).toBeVisible();
    return this.categoryMenu;
  }

  /** The product pages the open category menu links to, in menu order, as `./<category>/<slug>`. */
  async categoryMenuPaths(): Promise<string[]> {
    const hrefs = await this.categoryMenu
      .getByTestId('category-nav-dropdown-list')
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));

    return hrefs.map((href) => `.${href.replace(/^\/kr/, '')}`);
  }

  async goToProductFromMenu(linkName: string, path: CategoryPath, productPath: string): Promise<void> {
    const menu = await this.openCategoryMenu(linkName, path);
    const href = productPath.replace(/^\./, '');

    await menu.locator(`a[href$="${href}"]`).click();
    await expect(this.page).toHaveURL(new RegExp(`/kr${escapeRegExp(href)}/?$`));
  }

  // The nav link by its label, or -- after a relabel, like 시트 스티커 -> 판스티커 -- by its href.
  async categoryLink(linkName: string, path: CategoryPath): Promise<Locator> {
    return locateOrHeal({
      preferred: this.root.getByRole('link', { name: linkName, exact: true }),
      stable: this.root.locator(`a[href$="${categoryHref(path)}"]`).filter({ visible: true }),
      target: `header nav link ${path}`,
      expected: linkName,
      describeActual: (link) => link.innerText()
    });
  }

  async openSearch(): Promise<SearchDialog> {
    const dialog = new SearchDialog(this.page);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.searchButton.click();

      if (await dialog.isVisible({ timeout: 3_000 })) {
        await dialog.expectVisible();
        return dialog;
      }

      await this.page.waitForTimeout(500);
    }

    await dialog.expectVisible();
    return dialog;
  }

  async openCart(): Promise<CartDrawer> {
    const cart = new CartDrawer(this.page);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.cartButton.click({ force: attempt > 0 });

      if (await cart.isVisible({ timeout: 3_000 })) {
        await cart.expectVisible();
        return cart;
      }

      await this.page.waitForTimeout(500);
    }

    await cart.expectVisible();
    return cart;
  }

  async openAccountMenu(): Promise<void> {
    const accountMenu = this.accountMenu();

    await this.page.waitForLoadState('load').catch(() => undefined);
    // Production can render the header before Nuxt has bound the account-menu click handler.
    await this.page.waitForTimeout(1_000);

    // Opening the menu is not the same as it staying open: the header re-renders when the
    // post-login /user/me response lands, and that can tear the dropdown down in the same tick it
    // appeared. Confirming with a short timeout drops a torn-down menu back into the loop for
    // another click -- a bare assertion here cannot recover, and spends its whole timeout waiting
    // on a header that no longer has a menu to find.
    const confirmOpen = async (): Promise<boolean> =>
      expect(accountMenu)
        .toBeVisible({ timeout: 1_000 })
        .then(() => true)
        .catch(() => false);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      if ((await this.isAccountMenuVisible(accountMenu)) && (await confirmOpen())) {
        return;
      }

      await expect(this.accountButton).toBeEnabled();
      await this.accountButton.click({ force: attempt > 0 });

      const opened = await accountMenu
        .waitFor({ state: 'visible', timeout: 2_000 })
        .then(() => true)
        .catch(() => false);

      if (opened && (await confirmOpen())) {
        return;
      }

      if ((await this.accountButton.getAttribute('aria-expanded').catch(() => null)) === 'true') {
        await this.page.keyboard.press('Escape').catch(() => undefined);
        await accountMenu.waitFor({ state: 'hidden', timeout: 1_000 }).catch(() => undefined);
      }

      await this.page.waitForTimeout(500);
    }

    await expect(accountMenu).toBeVisible();
  }

  async chooseLoginFromAccountMenu(): Promise<void> {
    await this.openAccountMenu();
    await this.page.getByTestId('app-header-account-login').click();
    await expect(this.page).toHaveURL(/\/kr\/auth\/login/);
  }

  async expectMemberMenu(): Promise<void> {
    await this.openAccountMenu();
    await expect(this.page.getByTestId('app-header-account-dropdown-member')).toBeVisible();
    await expect(this.page.getByTestId('app-header-account-logout-button')).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.openAccountMenu();
    await this.page.getByTestId('app-header-account-logout-button').click();
    await expect(this.page.getByTestId('app-header-account-dropdown-member')).toBeHidden();

    await this.openAccountMenu();
    await expect(this.page.getByTestId('app-header-account-dropdown-guest')).toBeVisible();
  }

  private accountMenu(): Locator {
    return this.page
      .getByTestId('app-header-account-dropdown-guest')
      .or(this.page.getByTestId('app-header-account-dropdown-member'))
      .or(this.page.getByRole('menu', { name: '계정 메뉴' }))
      .first();
  }

  private async isAccountMenuVisible(accountMenu: Locator): Promise<boolean> {
    return accountMenu.isVisible().catch(() => false);
  }
}
