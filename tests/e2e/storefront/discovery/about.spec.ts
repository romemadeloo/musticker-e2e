import { test } from '../../../fixtures/e2e-test.js';
import { AboutV2Page } from '../../../pom/storefront/about-page.js';

test.describe('About page', { tag: ['@smoke', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-DSC-006 about page loads hero, sub-nav, stats, and CTAs', async ({ page }) => {
    const about = new AboutV2Page(page);

    await about.goto();
    await about.expectHeroAndStats();
    await about.expectSubNav();
    await about.expectCtas();
    await about.expectFooterContent();
  });
});
