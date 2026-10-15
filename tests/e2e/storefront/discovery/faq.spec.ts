import { test } from '../../../fixtures/e2e-test.js';
import { ko } from '../../../fixtures/storefront-data.js';
import { FaqV2Page } from '../../../pom/storefront/faq-page.js';

test.describe('FAQ', { tag: ['@smoke', '@regression', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-DSC-004 FAQ topics and accordions are usable', async ({ page }) => {
    const faq = new FaqV2Page(page);

    await faq.goto();
    await faq.expectTopics();
    await faq.openOrderQuestion();
  });

  test('MS-DSC-005 FAQ search filters and resets content', async ({ page }) => {
    const faq = new FaqV2Page(page);

    await faq.goto();
    await faq.search(ko.coupon);
    await faq.expectSearchResults(ko.coupon);
    await faq.clearSearchAndExpectDefaultList();
  });
});

