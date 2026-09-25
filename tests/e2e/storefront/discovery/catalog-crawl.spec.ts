import { test } from '../../fixtures/e2e-test.js';
import { catalogPaths } from '../../fixtures/storefront-data.js';
import { ProductV2Page } from '../../pom/product-page.js';

test.describe('storefront v2 catalog crawl', { tag: ['@regression', '@production'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientProductPageFailures: true
  });

  for (const path of catalogPaths) {
    test(`MS-V2-040 catalog page renders without error: ${path}`, async ({ page }) => {
      const product = new ProductV2Page(page);

      await product.expectCatalogEntryRenders(path);
    });
  }
});
