import { test } from '../../../fixtures/e2e-test.js';
import { faqFooterLinks, publicFooterPages } from '../../../fixtures/public-content-data.js';
import { PublicContentPage } from '../../../pom/storefront/public-content-page.js';

test.describe('Public content', { tag: ['@regression', '@production', '@discovery'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  for (const link of faqFooterLinks) {
    test(`${link.id} footer ${link.name} link selects its FAQ topic and survives reload`, async ({ page }) => {
      const content = new PublicContentPage(page);
      const destination = await content.openFooterLink(link.label);
      await destination.expectFaqDestination(link);
    });
  }

  for (const target of publicFooterPages) {
    test(`${target.id} footer ${target.name} link renders its public content`, async ({ page }) => {
      const content = new PublicContentPage(page);
      const destination = await content.openFooterLink(target.label);
      await destination.expectPublicDestination(target);
    });
  }
});
