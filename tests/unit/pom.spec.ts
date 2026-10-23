import { test, expect } from '@playwright/test';
import { HeaderComponent } from '../pom/storefront/header-component.js';
import { CheckoutV2Page } from '../pom/storefront/checkout-page.js';
import { checkoutValidationCopy, ko } from '../fixtures/storefront-data.js';

test('header actions wait for hydration and observable dialogs instead of forced retry clicks', async ({ page }) => {
  await page.setContent(`<header>
    <button data-testid="app-header-search-button" onclick="document.querySelector('#search').hidden=false;document.querySelector('#search input').focus()">Search</button>
    <button data-testid="app-header-cart-button" onclick="document.querySelector('#cart').hidden=false">Cart</button>
    <button data-testid="app-header-account-toggle-button" onclick="document.querySelector('#account').hidden=false">Account</button>
    <div role="dialog" aria-label="상품 검색" id="search" hidden><input data-testid="app-header-search-input"></div>
    <div role="dialog" id="cart" hidden>Cart Preview</div>
    <div data-testid="app-header-account-dropdown-guest" id="account" hidden>Account menu</div>
    </header><script>window.loading=true;window.polls=0;window.useNuxtApp=()=>{window.polls++;return {isHydrating:window.loading}};</script>`);
  const header = new HeaderComponent(page);
  const opening = header.openSearch();
  await page.waitForFunction(() => (window as unknown as { polls: number }).polls > 0);
  await expect(page.locator('#search')).toBeHidden();
  await page.evaluate(() => { (window as unknown as { loading: boolean }).loading = false; });
  await opening;
  await expect(page.getByTestId('app-header-search-input')).toBeFocused();
  await header.openCart();
  await expect(page.locator('#cart')).toBeVisible();
  await header.openAccountMenu();
  await expect(page.locator('#account')).toBeVisible();
});

test('blank checkout requires visible validation and OTP waits for its modal', async ({ page }) => {
  await page.route('**/*', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<form>
    <input type="email" required placeholder="${ko.checkoutEmailPlaceholder}" onblur="if(this.value)document.querySelector('.auth-verification-modal').hidden=false">
    <button>${ko.payNow}</button></form><div class="auth-verification-modal" hidden>Verify your email</div>
    <script>window.useNuxtApp=()=>({isHydrating:false});</script>` }));
  await page.goto('http://127.0.0.1:9/kr/checkout');
  const checkout = new CheckoutV2Page(page);
  await checkout.expectBlankSubmissionBlocked();
  await expect(page.locator('input:invalid')).toHaveCount(1);
  await checkout.fillGuestEmailAndAwaitOtpModal('synthetic@example.test');
  await expect(page.locator('.auth-verification-modal')).toBeVisible();
});

test('checkout recognizes visible required-field copy without depending on an error CSS class', async ({ page }) => {
  await page.route('**/*', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: `
    <input placeholder="${ko.checkoutEmailPlaceholder}">
    <p hidden id="feedback">${checkoutValidationCopy.requiredEmail}</p>
    <button onclick="document.querySelector('#feedback').hidden=false">${ko.payNow}</button>
    <script>window.useNuxtApp=()=>({isHydrating:false});</script>` }));
  await page.goto('http://127.0.0.1:9/kr/checkout');
  await expect(page.getByText(checkoutValidationCopy.requiredEmail, { exact: true })).toBeHidden();
  await new CheckoutV2Page(page).expectBlankSubmissionBlocked();
  await expect(page.getByText(checkoutValidationCopy.requiredEmail, { exact: true })).toBeVisible();
});
