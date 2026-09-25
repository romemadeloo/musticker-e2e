import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../fixtures/env.js';
import { gotoStorefront } from '../fixtures/navigation.js';
import { aboutPage, ko } from '../fixtures/storefront-data.js';

export class AboutV2Page {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await gotoStorefront(this.page, appPath('./about'));
    await expect(this.page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  }

  async expectHeroAndStats(): Promise<void> {
    const body = this.page.locator('body');

    await expect(body).toContainText(aboutPage.heroHeading);
    await expect(body).toContainText(aboutPage.statYears);
    await expect(body).toContainText(aboutPage.statOrders);
  }

  async expectSubNav(): Promise<void> {
    for (const label of aboutPage.subNav) {
      await expect(this.page.getByRole('button', { name: label }).first()).toBeVisible();
    }
  }

  async expectCtas(): Promise<void> {
    await expect(this.page.getByRole('button', { name: aboutPage.viewStoryCta }).first()).toBeVisible();
    await expect(this.page.getByRole('button', { name: ko.orderNow }).first()).toBeVisible();
  }

  async expectFooterContent(): Promise<void> {
    const footer = this.footer();

    await expect(footer).toContainText(ko.footerBrand);
    await expect(this.page.getByRole('link', { name: ko.terms }).first()).toBeVisible();
    await expect(this.page.getByRole('link', { name: ko.privacy }).first()).toBeVisible();
  }

  private footer(): Locator {
    return this.page.getByRole('contentinfo').first().or(this.page.locator('footer').first()).first();
  }
}
