import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { appPath } from '../../fixtures/env.js';
import {
  footerBusiness,
  footerContact,
  footerCta,
  footerLegalLinks,
  footerReviews,
  footerSocialLinks
} from '../../fixtures/footer-data.js';
import type { FooterLink } from '../../fixtures/footer-data.js';
import { waitForNuxtHydration } from '../../fixtures/hydration.js';
import { currentPath } from '../../fixtures/navigation.js';

const NEW_TAB_REL = 'noopener noreferrer';

/** The site-wide footer. See footer-data.ts for what it holds and which pages render it. */
export class FooterComponent {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole('contentinfo');
  }

  /** A column's link list, found through its visible title (the title's parent holds exactly one list). */
  column(title: string): Locator {
    return this.root.getByText(title, { exact: true }).locator('..').getByRole('list');
  }

  link(name: string): Locator {
    return this.root.getByRole('link', { name, exact: true });
  }

  async expectColumn(title: string, links: readonly FooterLink[]): Promise<void> {
    await expect(this.column(title).getByRole('link')).toHaveText(links.map((link) => link.name));

    for (const link of links) {
      await this.expectLinkTarget(this.link(link.name), appPath(link.path), link.newTab);
    }
  }

  async expectLegalLinks(): Promise<void> {
    for (const link of footerLegalLinks) {
      await this.expectLinkTarget(this.link(link.name), appPath(link.path), true);
    }
  }

  /**
   * Follows a footer link and returns the page it lands on: the same page for in-tab links, the new
   * tab otherwise. A new tab starts on about:blank, so this waits for it to navigate away.
   */
  async follow(link: FooterLink): Promise<Page> {
    await waitForNuxtHydration(this.page);

    if (!link.newTab) {
      await this.link(link.name).click();
      return this.page;
    }

    const [tab] = await Promise.all([this.page.waitForEvent('popup'), this.link(link.name).click()]);
    await tab.waitForURL((url) => url.href !== 'about:blank', { waitUntil: 'domcontentloaded' });
    return tab;
  }

  async expectContactDetails(): Promise<void> {
    await expect(this.root.getByText(footerContact.supportLabel, { exact: true })).toBeVisible();
    await expect(this.link(footerContact.phone)).toHaveAttribute('href', `tel:${footerContact.phone}`);
    await expect(this.root.getByText(footerContact.hours, { exact: true })).toBeVisible();
    await expect(this.root.getByText(footerContact.salesLabel)).toBeVisible();
    await expect(this.link(footerContact.salesEmail)).toHaveAttribute('href', `mailto:${footerContact.salesEmail}`);
  }

  async expectSocialLinks(): Promise<void> {
    for (const social of footerSocialLinks) {
      await this.expectLinkTarget(this.link(social.name), social.href, true);
    }
  }

  async expectBusinessDetails(): Promise<void> {
    for (const detail of [
      footerBusiness.company,
      footerBusiness.representative,
      footerBusiness.registration,
      footerBusiness.mailOrderNumber,
      footerBusiness.address
    ]) {
      await expect(this.root).toContainText(detail);
    }
    await expect(this.root.getByText(footerBusiness.copyright)).toBeVisible();
  }

  /**
   * Opens the FTC registration lookup and returns its tab. The government page itself is stubbed:
   * what the footer owns is the URL it opens, and a third-party site's uptime is not this suite's to
   * test.
   */
  async openBusinessInfo(): Promise<Page> {
    await this.page.context().route(`${footerBusiness.ftcLookupUrl}**`, (route) =>
      route.fulfill({ contentType: 'text/html; charset=utf-8', body: '<title>FTC lookup (stubbed)</title>' })
    );
    await waitForNuxtHydration(this.page);

    const [tab] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.root.getByRole('button', { name: footerBusiness.businessInfoButton, exact: true }).click()
    ]);
    await tab.waitForURL((url) => url.href !== 'about:blank', { waitUntil: 'domcontentloaded' });
    return tab;
  }

  /** 고객리뷰 is a button, not a link: on home it scrolls, elsewhere it opens home at #reviews. */
  async openReviews(): Promise<void> {
    await waitForNuxtHydration(this.page);
    await this.root.getByRole('button', { name: footerReviews.button, exact: true }).click();
    await expect.poll(() => currentPath(this.page)).toBe(appPath());
    await expect(this.page.getByRole('heading', { name: footerReviews.sectionHeading })).toBeInViewport();
  }

  async expectCtaBand(): Promise<void> {
    await expect(this.root.getByRole('heading', { level: 2, name: footerCta.heading })).toBeVisible();
    await expect(this.ctaButton(footerCta.inquiry)).toBeVisible();
    await expect(this.ctaButton(footerCta.order)).toBeVisible();
  }

  async expectNoCtaBand(): Promise<void> {
    await expect(this.root.getByRole('heading', { name: footerCta.heading })).toHaveCount(0);
    await expect(this.ctaButton(footerCta.order)).toHaveCount(0);
  }

  async orderNow(): Promise<void> {
    await waitForNuxtHydration(this.page);
    await this.ctaButton(footerCta.order).click();
    await expect.poll(() => currentPath(this.page)).toBe(appPath(footerCta.orderPath));
    await expect(this.page.getByRole('heading', { level: 1, name: footerCta.orderHeading })).toBeVisible();
  }

  /**
   * Opens the inquiry form. It has no dialog role, accessible name or test id (MUS-QA-026), so it is
   * found by its CSS class -- the documented last resort.
   */
  async openInquiry(): Promise<Locator> {
    await waitForNuxtHydration(this.page);
    const form = this.page.locator('.inquiry-modal');
    await this.ctaButton(footerCta.inquiry).click();
    await expect(form).toBeVisible();
    await expect(form.getByRole('heading', { name: footerCta.inquiryHeading, exact: true })).toBeVisible();
    return form;
  }

  async cancelInquiry(form: Locator): Promise<void> {
    await form.getByRole('button', { name: footerCta.inquiryCancel, exact: true }).click();
    await expect(form).toBeHidden();
  }

  /**
   * What an accessible modal would offer: a named dialog that takes focus, closes on Escape and
   * hands focus back to its trigger. Bounded short because MS-NAV-019 expects this to fail today.
   */
  async expectInquiryIsAccessibleDialog(): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: footerCta.inquiryHeading });
    await expect(dialog, 'the form must be exposed as a named dialog').toBeVisible({ timeout: 3_000 });
    await expect(dialog.locator(':focus'), 'focus must move into the dialog').toHaveCount(1, { timeout: 3_000 });

    await this.page.keyboard.press('Escape');
    await expect(dialog).toBeHidden({ timeout: 3_000 });
    await expect(this.ctaButton(footerCta.inquiry), 'focus must return to the button that opened it').toBeFocused();
  }

  private ctaButton(name: string): Locator {
    return this.root.getByRole('button', { name, exact: true });
  }

  private async expectLinkTarget(link: Locator, href: string, newTab: boolean): Promise<void> {
    await expect(link).toHaveAttribute('href', href);

    if (newTab) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', NEW_TAB_REL);
    } else {
      await expect(link).not.toHaveAttribute('target', '_blank');
    }
  }
}
