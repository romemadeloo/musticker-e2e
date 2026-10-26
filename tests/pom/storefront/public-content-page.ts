import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath, env } from '../../fixtures/env.js';
import { waitForNuxtHydration } from '../../fixtures/hydration.js';
import { discoveryCopy } from '../../fixtures/public-content-data.js';
import type { FaqFooterLink, PublicFooterPage } from '../../fixtures/public-content-data.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { ko } from '../../fixtures/storefront-data.js';
import { FaqV2Page } from './faq-page.js';
import { HomeV2Page } from './home-page.js';

export class PublicContentPage {
  constructor(readonly page: Page) {}

  async expectRootEntry(): Promise<void> {
    const response = await gotoStorefront(this.page, `${new URL(env.BASE_URL).origin}/`);
    expect(response?.status(), 'public root entry must load successfully').toBe(200);
    await expect(this.page.getByRole('heading', { level: 1, name: ko.homeHero })).toBeVisible();
    await expect(this.page.getByRole('contentinfo').getByRole('link', { name: ko.faq, exact: true })).toHaveAttribute('href', appPath('./faq'));
  }

  async openFooterLink(label: string): Promise<PublicContentPage> {
    await new HomeV2Page(this.page).goto();
    await waitForNuxtHydration(this.page);
    const link = this.page.getByRole('contentinfo').getByRole('link', { name: label, exact: true });
    if ((await link.getAttribute('target')) === '_blank') {
      const [popup] = await Promise.all([this.page.waitForEvent('popup'), link.click()]);
      await popup.waitForLoadState('domcontentloaded');
      return new PublicContentPage(popup);
    }
    await link.click();
    return this;
  }

  async expectFaqDestination(link: FaqFooterLink): Promise<void> {
    await expect(this.page).toHaveURL(url => url.pathname === appPath('./faq') && url.searchParams.get('topic') === link.topic && url.searchParams.get('question') === ('questionKey' in link ? link.questionKey : null));
    await waitForNuxtHydration(this.page);
    // FAQ topic controls have no tab roles or selected ARIA state on the deployed page.
    await expect(this.page.locator('.topics-nav .selected')).toHaveText(link.topicLabel);
    await expect(this.page.getByRole('button', { name: link.question, exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: discoveryCopy.membershipQuestion, exact: true })).toBeHidden();
    if ('questionKey' in link) {
      // The shipping link must reveal its answer without an extra click.
      await new FaqV2Page(this.page).expectAnswerVisible(link.question, discoveryCopy.shippingAnswer);
    }
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await expect(this.page.locator('.topics-nav .selected')).toHaveText(link.topicLabel);
    await expect(this.page.getByRole('button', { name: link.question, exact: true })).toBeVisible();
    if ('questionKey' in link) {
      await new FaqV2Page(this.page).expectAnswerVisible(link.question, discoveryCopy.shippingAnswer);
    }
  }

  async expectPublicDestination(target: PublicFooterPage): Promise<void> {
    await expect(this.page).toHaveURL(url => url.pathname === appPath(target.path));
    // The license route nests its content main inside the application layout's main.
    const main = this.page.getByRole('main').last();
    await expect(main.getByRole('heading', { level: 1, name: target.heading })).toBeVisible();
    if (target.section) {
      const section = main.locator(target.section);
      await expect(section).toContainText(/\S/);
      // Section links expose their destination through href rather than a test ID.
      await main.locator(`a[href="${target.section}"]`).click();
      // The client scroll spy may replace the semantic anchor with its numbered section hash.
      await expect(this.page).toHaveURL(url => url.pathname === appPath(target.path) && url.hash.length > 1);
      await expect(section).toBeInViewport();
    } else {
      await expect(main).toContainText(/\S.{100}/s);
    }
  }
}
