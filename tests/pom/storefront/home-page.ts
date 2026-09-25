import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../../fixtures/env.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { ko } from '../../fixtures/storefront-data.js';
import { HeaderComponent } from './header-component.js';
import type { CategoryPath } from './header-component.js';

export class HomeV2Page {
  readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  async goto(): Promise<void> {
    await gotoStorefront(this.page, appPath());
    await this.header.expectVisible();
  }

  async expectCriticalContent(): Promise<void> {
    await expect(this.page).toHaveTitle(/\uba38\uc2a4\ud2f0\ucee4/);
    await expect(this.page.getByRole('heading', { name: ko.homeHero })).toBeVisible();
    await expect(await this.header.categoryLink(ko.stickers, './stickers')).toBeVisible();
    await expect(await this.header.categoryLink(ko.rollStickers, './roll-stickers')).toBeVisible();
    await expect(await this.header.categoryLink(ko.sheetStickers, './sheet-stickers')).toBeVisible();
    await expect(this.page.getByRole('button', { name: ko.fastOrder })).toBeVisible();
    await expect(this.page.getByRole('button', { name: ko.orderNow })).toBeVisible();
    await expect(this.page.getByRole('button', { name: ko.inquiryCta })).toBeVisible();
    await expect(this.page.locator('body')).toContainText(ko.reviews225);
    await this.expectFooterContent();
  }

  async expectFooterContent(): Promise<void> {
    const footer = this.footer();

    await expect(footer).toContainText(ko.footerBrand);
    await expect(footer).toContainText('1899-5529');
    await expect(footer).toContainText('sales@musticker.com');
    await expect(this.page.getByRole('link', { name: ko.terms }).first()).toBeVisible();
    await expect(this.page.getByRole('link', { name: ko.privacy }).first()).toBeVisible();
    await expect(this.page.getByRole('link', { name: ko.faq }).first()).toBeVisible();
  }

  async expectLocaleControlStable(): Promise<void> {
    const localeButton = this.page.getByRole('button', { name: 'KR' }).last();

    if ((await localeButton.count()) === 0) {
      await expect(this.header.root).toBeVisible();
      return;
    }

    await expect(localeButton).toBeVisible();
    await localeButton.click();
    await expect(localeButton).toBeVisible();
    await this.page.keyboard.press('Escape').catch(() => undefined);
  }

  async goToCategory(linkName: string, path: CategoryPath): Promise<void> {
    await this.header.goToCategory(linkName, path);
  }

  async openAccountEntry(): Promise<void> {
    await this.header.chooseLoginFromAccountMenu();
    await expect(this.page).toHaveURL(/\/kr\/auth\/login/);
  }

  private footer(): Locator {
    return this.page.getByRole('contentinfo').first().or(this.page.locator('footer').first()).first();
  }
}
