import { test } from '../../../fixtures/e2e-test.js';
import { discoveryCopy } from '../../../fixtures/public-content-data.js';
import { HomeV2Page } from '../../../pom/storefront/home-page.js';

test.describe('Header search', { tag: ['@regression', '@production', '@discovery'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-NAV-009 search recovers from no results when the query is replaced', async ({ page }) => {
    const home = new HomeV2Page(page);
    await home.goto();
    const search = await home.header.openSearch();
    await search.searchFor(discoveryCopy.noMatchQuery);
    await search.expectNoResults();
    await search.searchFor(discoveryCopy.stickerQuery);
    await search.expectDieCutStickerResults();
    await search.expectNoResultsHidden();
  });

  test('MS-NAV-010 selecting a search result opens the product and closes search', async ({ page }) => {
    const home = new HomeV2Page(page);
    await home.goto();
    const search = await home.header.openSearch();
    await search.searchFor(discoveryCopy.stickerQuery);
    await search.expectDieCutStickerResults();
    await search.chooseDieCutSticker();
    await search.expectClosed();
  });
});
