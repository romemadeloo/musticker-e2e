import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Waits until a form's client-side handlers are actually bound.
 *
 * Nuxt serves these pages fully rendered, so every control is visible and enabled well before Vue
 * finishes hydrating them. A click that lands in that window hits an inert element: it focuses the
 * button and does nothing else. On the auth forms that shows up as a submit which neither validates
 * nor calls the API -- the test then fails on a missing validation message that the app would have
 * rendered a second later. Measured on the dev storefront, the gap is consistently around 1.2s.
 *
 * Nuxt exposed no hydration flag on the builds this was written against (no `isHydrating`, no `data-v-app`, and the
 * production Vue build keeps `__vnode` off the DOM nodes), so interactivity is established
 * behaviourally instead: a password visibility toggle is a purely client-side control whose effect
 * is directly observable on the input's `type`. Once it responds, the surrounding form is bound too.
 *
 * The toggle is left exactly as it was found, so callers can use this before asserting on masking.
 */
export async function waitForPasswordFormInteractive(toggleButton: Locator, passwordInput: Locator): Promise<void> {
  await expect(passwordInput).toHaveAttribute('type', 'password');

  await expect(async () => {
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text', { timeout: 1_000 });
  }).toPass({ timeout: 20_000 });

  await toggleButton.click();
  await expect(passwordInput).toHaveAttribute('type', 'password');
}

/**
 * Waits until Nuxt has finished hydrating the page. Since early October 2026 the storefront exposes
 * `useNuxtApp()` on `window` (production and dev-1), whose `isHydrating` turns false once the
 * page's handlers are bound -- on a heavy production page that was about 11 s after navigation. The
 * mounted root's `__vue_app__` is the fallback for a build that does not expose it (the dev storefront
 * did not, which is why the form helper above works behaviourally).
 */
export async function waitForNuxtHydration(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const nuxtApp = (window as { useNuxtApp?: () => { isHydrating?: boolean } }).useNuxtApp;

      if (typeof nuxtApp === 'function') {
        try {
          return nuxtApp().isHydrating === false;
        } catch {
          // Called outside a Nuxt context on some builds; fall through to the mount check.
        }
      }

      return Boolean((document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__);
    },
    undefined,
    { timeout: 30_000 }
  );
}
