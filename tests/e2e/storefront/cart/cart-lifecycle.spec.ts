import { test, expect } from '../../../fixtures/e2e-test.js';
import { appPath } from '../../../fixtures/env.js';
import { gotoStorefront } from '../../../fixtures/navigation.js';
import { dieCutShapeStickers, v2Products } from '../../../fixtures/storefront-data.js';
import { CartDrawer } from '../../../pom/storefront/cart-drawer.js';
import { CartV2Page } from '../../../pom/storefront/cart-page.js';
import { HeaderComponent } from '../../../pom/storefront/header-component.js';
import { ProductV2Page } from '../../../pom/storefront/product-page.js';

// The configurator specs all end at "the item reached the cart". What happens to it afterwards --
// removing it, holding two of them, surviving a reload, or being carried across a login -- had no
// coverage at all, which for a storefront is the cart's whole job.
//
// Verified live against the dev storefront on 2026-08-27:
//
//   * A guest cart survives a full document reload (the badge still reads 1).
//   * Two distinct products make two rows, and 13,800원 + 18,700원 = the 32,500원 cart total.
//   * The cart page confirms every removal through `cart-item-delete-modal`; cancelling keeps the row.
//
// What happens to a guest cart at login is its own suite: guest-cart-merge.spec.ts.
const hologramSticker = dieCutShapeStickers[0];

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

test.describe('Cart lifecycle', () => {
  test.describe('with items', { tag: ['@regression', '@production', '@purchasing'] }, () => {
    test.use({
      allowGuestUserMe401: true,
      allowKnownNuxtPayloadFailures: true,
      allowTransientCartCreateFailures: true,
      allowTransientApiCorsFailures: true,
      allowTransientProductPageFailures: true
    });

    test('MS-CRT-001 removing the only line item leaves an empty cart, not a broken one', async ({ page }) => {
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

    test('MS-CRT-002 two distinct products become two lines whose prices sum to the cart total', async ({ page }) => {
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

    test('MS-CRT-003 a guest cart survives a full page reload @smoke', async ({ page }) => {
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

    test('MS-CRT-004 the cart page confirms a removal before acting on it', async ({ page }) => {
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

  test.describe('empty cart', { tag: ['@regression', '@production'] }, () => {
    test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

    test('MS-CRT-006 an empty cart page offers a way back into the catalog', async ({ page }) => {
      const cart = new CartV2Page(page);

      await gotoStorefront(page, appPath('./cart'));
      await cart.expectEmpty();

      // The empty state is the only thing standing between a shopper and a dead end, so it has to
      // carry real product links rather than just an apology.
      await expect(page.getByTestId('cart-empty-featured-die-cut-sticker')).toBeVisible();
      await expect(page.getByTestId('cart-empty-discover-circle-sticker')).toBeVisible();

      // The empty state replaces the whole page, 내 장바구니 heading included -- verified on
      // the dev storefront, so this asserts the summary block is gone rather than expecting that heading.
      await expect(page.getByTestId('cart-page-summary')).toHaveCount(0);
    });
  });
});
