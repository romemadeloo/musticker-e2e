import { test } from '../../fixtures/e2e-test.js';
import { ko } from '../../fixtures/storefront-data.js';
import { FaqV2Page } from '../../pom/faq-page.js';

test.describe('storefront v2 FAQ', { tag: ['@smoke', '@regression', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-V2-015 FAQ topics and accordions are usable', async ({ page }) => {
    const faq = new FaqV2Page(page);

    await faq.goto();
    await faq.expectTopics();
    await faq.openOrderQuestion();
  });

  test('MS-V2-016 FAQ search filters and resets content', async ({ page }) => {
    const faq = new FaqV2Page(page);

    await faq.goto();
    await faq.search(ko.coupon);
    await faq.expectSearchResults(ko.coupon);
    await faq.clearSearchAndExpectDefaultList();
  });
});

