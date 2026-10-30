import type { Page } from '@playwright/test';

import { expect, test } from '../../../fixtures/e2e-test.js';
import { appPath } from '../../../fixtures/env.js';
import { footerBusiness, footerColumns, footerReviews } from '../../../fixtures/footer-data.js';
import type { FooterLink } from '../../../fixtures/footer-data.js';
import { currentPath, gotoStorefront } from '../../../fixtures/navigation.js';
import { FooterComponent } from '../../../pom/storefront/footer-component.js';
import { HomeV2Page } from '../../../pom/storefront/home-page.js';

// Explored read-only on production on 2026-10-30; dev-1 matched. MS-NAV-006 keeps the smoke-level
// check of the footer; the FAQ and policy destinations are MS-DSC-008 to MS-DSC-015.
const productLinks = footerColumns[0].links;
const newTabLinks = footerColumns.flatMap((column) => column.links).filter((link) => link.newTab);

async function expectLanding(page: Page, link: FooterLink): Promise<void> {
  // A navigation budget, not a UI one: Nuxt only commits the URL once the next route's chunks and
  // payload have loaded, and a cold product page on production took over 10s (2026-10-30).
  await expect.poll(() => currentPath(page), { timeout: 30_000 }).toBe(appPath(link.path));
  await expect(page.getByRole('heading', { level: 1, name: link.heading })).toBeVisible();
}

test.describe('Footer', { tag: ['@regression', '@production', '@discovery'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-NAV-012 footer columns list their links in order, and new-tab links open without an opener', async ({ page }) => {
    await new HomeV2Page(page).goto();
    const footer = new FooterComponent(page);

    for (const column of footerColumns) {
      await footer.expectColumn(column.title, column.links);
    }
    await footer.expectLegalLinks();
  });

  test('MS-NAV-013 footer product links open their category and product pages, each keeping the footer', async ({ page }) => {
    // Five page loads in a row; production's WAF and dev-1's cold pages each need headroom.
    test.setTimeout(150_000);
    await new HomeV2Page(page).goto();

    // Each next link is followed from the footer of the page the previous one opened, which also
    // shows the footer is rendered on category and product pages, not only on home.
    for (const link of productLinks) {
      await test.step(`shopper: follows ${link.name}`, async () => {
        const landed = await new FooterComponent(page).follow(link);
        await expectLanding(landed, link);
      });
    }
  });

  test('MS-NAV-014 footer support and company links open their pages in a new tab', async ({ page }) => {
    test.setTimeout(120_000);
    await new HomeV2Page(page).goto();
    const footer = new FooterComponent(page);

    for (const link of newTabLinks) {
      await test.step(`shopper: opens ${link.name}`, async () => {
        const tab = await footer.follow(link);
        await expectLanding(tab, link);
        // The storefront stays where it was.
        expect(currentPath(page)).toBe(appPath());
        await tab.close();
      });
    }
  });

  test('MS-NAV-015 footer 고객리뷰 takes the shopper to the home page reviews from another page', async ({ page }) => {
    await gotoStorefront(page, appPath('./faq'));
    await new FooterComponent(page).openReviews();
    await expect.poll(() => new URL(page.url()).hash).toBe(footerReviews.hash);
  });

  test('MS-NAV-016 footer shows contact, social and business registration details', async ({ page }) => {
    await new HomeV2Page(page).goto();
    const footer = new FooterComponent(page);

    await footer.expectContactDetails();
    await footer.expectSocialLinks();
    await footer.expectBusinessDetails();
  });

  test('MS-NAV-017 footer 사업자정보확인 opens the FTC lookup for the registration number it shows', async ({ page }) => {
    await new HomeV2Page(page).goto();
    const tab = await new FooterComponent(page).openBusinessInfo();

    const lookup = new URL(tab.url());
    expect(`${lookup.origin}${lookup.pathname}`).toBe(footerBusiness.ftcLookupUrl);
    expect(lookup.searchParams.get('wrkr_no'), 'the lookup must be for the number printed in the footer').toBe(
      footerBusiness.registrationDigits
    );
    expect(footerBusiness.registration.replace(/\D/g, '')).toBe(footerBusiness.registrationDigits);
  });

  test('MS-NAV-018 home footer CTAs open the die-cut sticker product and an inquiry form that 취소 closes', async ({ page }) => {
    const home = new HomeV2Page(page);
    await home.goto();
    const footer = new FooterComponent(page);
    await footer.expectCtaBand();

    await test.step('shopper: opens and cancels the inquiry form', async () => {
      await footer.cancelInquiry(await footer.openInquiry());
    });

    await test.step('shopper: orders now', async () => {
      await footer.orderNow();
      // The CTA band is home-only.
      await new FooterComponent(page).expectNoCtaBand();
    });
  });

  test('MS-NAV-019 footer inquiry form is announced as a dialog, takes focus and closes on Escape', async ({ page }) => {
    // MUS-QA-026, found 2026-10-30 on production and dev-1: the form has no dialog role or name,
    // focus stays on the trigger, Escape does nothing, and 취소 drops focus to <body>. When this
    // starts passing, the form has been fixed -- remove this line.
    test.fail(true, 'DEFECT MUS-QA-026: footer inquiry form is not an accessible modal dialog');

    await new HomeV2Page(page).goto();
    const footer = new FooterComponent(page);
    await footer.openInquiry();
    await footer.expectInquiryIsAccessibleDialog();
  });
});
