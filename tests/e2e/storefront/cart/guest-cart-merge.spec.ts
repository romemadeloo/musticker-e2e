import { test, expect } from '../../../fixtures/e2e-test.js';
import { activeEnvironment, env } from '../../../fixtures/env.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
import { dieCutShapeStickers } from '../../../fixtures/storefront-data.js';
import { CartDrawer } from '../../../pom/storefront/cart-drawer.js';
import { CartV2Page } from '../../../pom/storefront/cart-page.js';
import { HeaderComponent } from '../../../pom/storefront/header-component.js';
import { LoginPage } from '../../../pom/storefront/login-page.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

// Moved out of cart-lifecycle.spec.ts so it reads as its own suite. Verified live against
// the dev storefront on 2026-08-27: logging in merges the guest cart into the member cart *additively* --
// a member holding one item who signs in with two guest items ends up with three, not two.
const hologramSticker = dieCutShapeStickers[0];
const canRunDestructiveAuth = process.env.RUN_AUTH_DESTRUCTIVE_E2E === 'true' && activeEnvironment?.startsWith('dev-') === true;

// Deliberately NOT tagged @production: this adds a line to a real member's cart. It is excluded from
// production runs by @destructive anyway, but carrying @production would label it production-safe,
// which it is not.
test.describe('Guest cart merge', { tag: ['@regression', '@purchasing'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true
  });

  test(
    'MS-CRT-005 a guest cart is merged into the member cart on login',
    { tag: ['@credentialed', '@destructive', '@slow'] },
    async ({ page }) => {
      test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);
      test.skip(
        !canRunDestructiveAuth,
        'MS-CRT-005 adds a line to the seeded member\'s real cart before removing it again. Set ' +
          'RUN_AUTH_DESTRUCTIVE_E2E=true against a dev environment (not production) to run it.'
      );
      test.setTimeout(180_000);

      const header = new HeaderComponent(page);
      const product = new ProductV2Page(page);
      await product.goto(hologramSticker.path, hologramSticker.heading);
      await product.selectSize(hologramSticker.size);
      await product.selectQuantity(hologramSticker.quantity);
      const guestPrice = await product.captureQuantityTierPrice(hologramSticker.quantity);
      await product.addToCart();
      await new CartDrawer(page).expectVisible();
      await header.expectCartCount(1);

      // Logging in through the form is the merge trigger, so this test cannot use a seeded session.
      const login = new LoginPage(page);
      await login.goto();
      await login.loginWithCredentials(env.AUTH_TEST_EMAIL!, env.AUTH_TEST_PASSWORD!);

      const cart = new CartV2Page(page);
      await cart.goto();

      // The seeded member may already hold lines of their own, so the assertion is that the guest
      // line survived the transition -- not that the cart now holds exactly one thing.
      const mergedRowCount = await cart.rowCount();
      expect(mergedRowCount, 'the merged cart must hold at least the guest line').toBeGreaterThanOrEqual(1);
      await expect(cart.row(hologramSticker.heading)).toBeVisible();
      await expect
        .poll(() => cart.captureRowPrices(), { message: 'the guest line must keep its price through the merge' })
        .toContain(guestPrice);
      await cart.expectTotalIsSumOfRows();

      // Put the member's cart back the way it was found. Anything this test adds to a real account
      // has to come back out, whether or not the assertions above passed.
      await cart.removeRow(hologramSticker.heading);
      await cart.expectRowCount(mergedRowCount - 1);
    }
  );
});
