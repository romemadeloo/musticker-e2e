import { test, expect } from '../../fixtures/e2e-test.js';
import { expectNoNewAccessibilityViolations } from '../../fixtures/axe.js';
import { appPath } from '../../fixtures/env.js';
import { gotoStorefront } from '../../fixtures/navigation.js';
import { ko, v2Products } from '../../fixtures/storefront-data.js';

// MS-V2-023 checks five named controls and one Tab press. That catches nothing a rendering change
// would break, and nothing at all about the rest of the page. This runs the axe-core WCAG 2.1 AA
// ruleset over the six surfaces a shopper cannot avoid, so a regression anywhere in the markup is
// caught rather than only in the handful of controls someone thought to name.
//
// The two rules the storefront currently fails are recorded in tests/fixtures/axe.ts with what is
// behind each, so this lands green today and turns red on the *next* violation. They are open
// defects, not accepted behaviour.
//
// Each page waits on a real content anchor before scanning: axe reads the DOM as it finds it, and a
// scan that lands mid-hydration measures a page no shopper ever sees.
const scannedPages = [
  {
    name: 'home',
    path: './',
    ready: (page: import('@playwright/test').Page) =>
      expect(page.getByRole('heading', { name: ko.homeHero })).toBeVisible()
  },
  {
    name: 'sticker category',
    path: './stickers',
    ready: (page: import('@playwright/test').Page) =>
      expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  },
  {
    name: 'die-cut sticker product',
    path: v2Products.dieCutSticker.path,
    ready: (page: import('@playwright/test').Page) =>
      expect(page.getByTestId('product-category-options')).toBeVisible()
  },
  {
    name: 'FAQ',
    path: './faq',
    // The FAQ hero is not a heading element, so it is matched as text the way FaqPage does.
    ready: (page: import('@playwright/test').Page) =>
      expect(page.locator('body')).toContainText(ko.faqHero)
  },
  {
    name: 'login',
    path: './auth/login',
    ready: (page: import('@playwright/test').Page) => expect(page.getByTestId('auth-login-page')).toBeVisible()
  },
  {
    name: 'empty cart',
    path: './cart',
    ready: (page: import('@playwright/test').Page) => expect(page.getByTestId('cart-page')).toBeVisible()
  }
] as const;

test.describe('storefront v2 WCAG AA scan', { tag: ['@regression', '@a11y', '@production'] }, () => {
  test.use({ allowGuestUserMe401: true, allowKnownNuxtPayloadFailures: true });

  for (const scanned of scannedPages) {
    test(`MS-V2-106 ${scanned.name} has no new WCAG AA violations`, async ({ page }, testInfo) => {
      await gotoStorefront(page, appPath(scanned.path));
      await scanned.ready(page);

      await expectNoNewAccessibilityViolations(page, testInfo);
    });
  }
});
