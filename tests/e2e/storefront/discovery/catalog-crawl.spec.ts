import { test } from '../../../fixtures/e2e-test.js';
import { catalogPaths } from '../../../fixtures/storefront-data.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

test.describe('Catalog crawl', { tag: ['@regression', '@production'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientProductPageFailures: true
  });

  for (const path of catalogPaths) {
    test(`MS-DSC-007 catalog page renders without error: ${path}`, async ({ page }) => {
      const product = new ProductV2Page(page);

      await product.expectCatalogEntryRenders(path);
    });
  }
});
