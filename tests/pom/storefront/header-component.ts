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
   * on dev-1), so every click waits for hydration first. On its own category page the link opens
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
    await waitForNuxtHydration(this.page);
    await this.searchButton.click();
    await dialog.expectVisible();
    return dialog;
  }

  async openCart(): Promise<CartDrawer> {
    const cart = new CartDrawer(this.page);
    await waitForNuxtHydration(this.page);
    await this.cartButton.click();
    await cart.expectVisible();
    return cart;
  }

  async openAccountMenu(): Promise<void> {
    await waitForNuxtHydration(this.page);
    const menu = this.accountMenu();
    await expect(async () => {
      if (!(await menu.isVisible())) await this.accountButton.click();
      await expect(menu).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
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


}
