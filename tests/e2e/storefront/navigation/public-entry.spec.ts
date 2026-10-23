import { test } from '../../../fixtures/e2e-test.js';
import { PublicContentPage } from '../../../pom/storefront/public-content-page.js';

test.describe('Public entry', { tag: ['@regression', '@production', '@discovery'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-NAV-011 public root entry renders the storefront with localized support links', async ({ page }) => {
    await new PublicContentPage(page).expectRootEntry();
  });
});
