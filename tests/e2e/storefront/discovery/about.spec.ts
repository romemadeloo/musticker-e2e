import { test } from '../../fixtures/e2e-test.js';
import { AboutV2Page } from '../../pom/about-page.js';

test.describe('storefront v2 about page', { tag: ['@smoke', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-V2-039 about page loads hero, sub-nav, stats, and CTAs', async ({ page }) => {
    const about = new AboutV2Page(page);

    await about.goto();
    await about.expectHeroAndStats();
    await about.expectSubNav();
    await about.expectCtas();
    await about.expectFooterContent();
  });
});
