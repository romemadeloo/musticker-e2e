import { test, expect } from '../../fixtures/e2e-test.js';
import { appPath, env } from '../../fixtures/env.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../fixtures/member-auth.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { dieCutShapeStickers, v2Products } from '../../fixtures/storefront-data.js';
import { CartDrawer } from '../../pom/cart-drawer.js';
import { CartV2Page } from '../../pom/cart-page.js';
import { HeaderComponent } from '../../pom/header-component.js';
import { LoginPage } from '../../pom/login-page.js';
import { ProductV2Page } from '../../pom/product-page.js';

// The configurator specs all end at "the item reached the cart". What happens to it afterwards --
// removing it, holding two of them, surviving a reload, or being carried across a login -- had no
// coverage at all, which for a storefront is the cart's whole job.
//
// Verified live against development-1 on 2026-08-27:
//
//   * A guest cart survives a full document reload (the badge still reads 1).
//   * Two distinct products make two rows, and 13,800원 + 18,700원 = the 32,500원 cart total.
//   * The cart page confirms every removal through `cart-item-delete-modal`; cancelling keeps the row.
//   * Logging in merges the guest cart into the member cart *additively* -- a member holding one item
//     who signs in with two guest items ends up with three, not two.
const hologramSticker = dieCutShapeStickers[0];
const canRunDestructiveAuth = process.env.RUN_AUTH_DESTRUCTIVE_E2E === 'true';

async function addToCart(page: Parameters<typeof gotoStorefront>[0], data: { path: string; heading: string; size: string; quantity: number }): Promise<number> {
  const product = new ProductV2Page(page);

  await product.goto(data.path, data.heading);
  await product.selectSize(data.size);
  await product.selectQuantity(data.quantity);

  const price = await product.captureQuantityTierPrice(data.quantity);
  await product.addToCart();

  const drawer = new CartDrawer(page);
  await drawer.expectVisible();

  return price;
}

test.describe('storefront v2 cart lifecycle', { tag: ['@regression', '@production', '@purchasing'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true
  });

  test('MS-V2-100 removing the only line item leaves an empty cart, not a broken one', async ({ page }) => {
    const data = v2Products.dieCutSticker;
    const header = new HeaderComponent(page);

    await addToCart(page, { ...data, size: data.size });
    await header.expectCartCount(1);

    const drawer = new CartDrawer(page);
    await drawer.removeLineItem(data.heading);
    await drawer.expectEmpty();
    await header.expectCartCount(0);

    // The full cart page has to agree, and has to render its own empty state rather than a summary
    // with nothing in it.
    const cart = new CartV2Page(page);
    await gotoStorefront(page, appPath('./cart'));
    await cart.expectEmpty();
  });

  test('MS-V2-101 two distinct products become two lines whose prices sum to the cart total', async ({ page }) => {
    const first = v2Products.dieCutSticker;
    const header = new HeaderComponent(page);

    const firstPrice = await addToCart(page, { ...first, size: first.size });
    await header.expectCartCount(1);

    const secondPrice = await addToCart(page, {
      path: hologramSticker.path,
      heading: hologramSticker.heading,
      size: hologramSticker.size,
      quantity: hologramSticker.quantity
    });
    await header.expectCartCount(2);

    const drawer = new CartDrawer(page);
    await drawer.expectLineItems([first.heading, hologramSticker.heading]);

    const cart = new CartV2Page(page);
    await drawer.viewCart();
    await cart.expectRowCount(2);
    await cart.expectDeclaredItemCount(2);

    const total = await cart.expectTotalIsSumOfRows();
    expect(total, 'the cart total must be the two quoted prices added together').toBe(firstPrice + secondPrice);
  });

  test('MS-V2-102 a guest cart survives a full page reload @smoke', async ({ page }) => {
    const data = v2Products.dieCutSticker;
    const header = new HeaderComponent(page);

    const price = await addToCart(page, { ...data, size: data.size });
    await header.expectCartCount(1);

    // A document reload, not client-side routing: the guest cart has to be restored from the server
    // rather than from in-memory store state.
    await page.reload();
    await header.expectCartCount(1);

    const cart = new CartV2Page(page);
    await cart.goto();
    await cart.expectRowCount(1);
    expect(await cart.captureRowPrices(), 'the restored line must keep its price').toEqual([price]);
  });

  test('MS-V2-103 the cart page confirms a removal before acting on it', async ({ page }) => {
    const data = v2Products.dieCutSticker;

    await addToCart(page, { ...data, size: data.size });

    const cart = new CartV2Page(page);
    await cart.goto();
    await cart.expectRowCount(1);

    // Cancelling must be a no-op -- an accidental click on the bin icon cannot cost the shopper the
    // configuration they just built.
    await cart.cancelRemoveRow(data.heading);
    await cart.expectRowCount(1);

    await cart.removeRow(data.heading);
    await cart.expectEmpty();
  });

});

test.describe('storefront v2 cart lifecycle copy', { tag: ['@regression', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  test('MS-V2-105 an empty cart page offers a way back into the catalog', async ({ page }) => {
    const cart = new CartV2Page(page);

    await gotoStorefront(page, appPath('./cart'));
    await cart.expectEmpty();

    // The empty state is the only thing standing between a shopper and a dead end, so it has to
    // carry real product links rather than just an apology.
    await expect(page.getByTestId('cart-empty-featured-die-cut-sticker')).toBeVisible();
    await expect(page.getByTestId('cart-empty-discover-circle-sticker')).toBeVisible();

    // The empty state replaces the whole page, 내 장바구니 heading included -- verified on
    // development-1, so this asserts the summary block is gone rather than expecting that heading.
    await expect(page.getByTestId('cart-page-summary')).toHaveCount(0);
  });
});

// Deliberately NOT tagged @production: this adds a line to a real member's cart. It is excluded from
// production runs by @destructive anyway, but carrying @production would label it production-safe,
// which it is not.
test.describe('storefront v2 guest-to-member cart merge', { tag: ['@regression', '@purchasing'] }, () => {
  test.use({
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true,
    allowTransientCartCreateFailures: true,
    allowTransientApiCorsFailures: true,
    allowTransientProductPageFailures: true
  });

  test(
    'MS-V2-104 a guest cart is merged into the member cart on login',
    { tag: ['@credentialed', '@destructive', '@slow'] },
    async ({ page }) => {
      test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);
      test.skip(
        !canRunDestructiveAuth,
        'MS-V2-104 adds a line to the seeded member\'s real cart before removing it again. Set ' +
          'RUN_AUTH_DESTRUCTIVE_E2E=true against a dev environment (not production) to run it.'
      );
      test.setTimeout(180_000);

      const header = new HeaderComponent(page);
      const guestPrice = await addToCart(page, {
        path: hologramSticker.path,
        heading: hologramSticker.heading,
        size: hologramSticker.size,
        quantity: hologramSticker.quantity
      });
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
      expect(
        await cart.captureRowPrices(),
        'the guest line must keep its price through the merge'
      ).toContain(guestPrice);
      await cart.expectTotalIsSumOfRows();

      // Put the member's cart back the way it was found. Anything this test adds to a real account
      // has to come back out, whether or not the assertions above passed.
      await cart.removeRow(hologramSticker.heading);
      await cart.expectRowCount(mergedRowCount - 1);
    }
  );
});
