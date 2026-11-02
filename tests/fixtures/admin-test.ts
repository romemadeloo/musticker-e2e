import type { Page } from '@playwright/test';

import { AdminApi } from './admin-api.js';
import {
  SKIP_EXPIRED_ADMIN_SESSION,
  SKIP_WITHOUT_ADMIN_SESSION,
  adminStorageStatePath,
  hasAdminSession,
  isAdminSessionValid
} from './admin-auth.js';
import { test as e2eTest } from './e2e-test.js';
import { adminBaseUrl } from './env.js';

type AdminFixtures = {
  /**
   * A page in its own browser context, signed in to the admin panel from the saved session and with
   * the panel as its baseURL -- so `adminPage.goto('/orders')` works. Separate from `page` so a spec
   * can drive the storefront as a customer and the panel as staff side by side, each with its own
   * cookies.
   *
   * Skips the test (rather than failing it) when this environment has no panel, no saved session,
   * or a session the API no longer accepts -- none of those says anything about the product.
   *
   * Must never be recorded: the panel shows real customers' names and emails, and this repo's CI
   * artifacts are public. Video is only recorded for the built-in `context`, but failure screenshots
   * and traces cover every page and context in the worker (found 2026-10-14, when a failed run saved
   * a screenshot of the panel). So this fixture refuses to start unless the spec file turns both off
   * with a top-level `test.use({ screenshot: 'off', trace: 'off' })`.
   */
  adminPage: Page;
  adminApi: AdminApi;
};

function modeOf(option: string | { mode: string }): string {
  return typeof option === 'string' ? option : option.mode;
}

export const test = e2eTest.extend<AdminFixtures>({
  adminPage: async ({ browser, screenshot, trace }, use, testInfo) => {
    if (modeOf(screenshot) !== 'off' || modeOf(trace) !== 'off') {
      throw new Error(
        "Admin specs must not record the panel. Add test.use({ screenshot: 'off', trace: 'off' }) at the top of the spec file."
      );
    }

    const baseURL = adminBaseUrl();
    testInfo.skip(!baseURL, 'This environment has no admin panel in tests/fixtures/environments.ts.');
    testInfo.skip(!hasAdminSession(), SKIP_WITHOUT_ADMIN_SESSION);

    const context = await browser.newContext({
      baseURL,
      storageState: adminStorageStatePath(),
      locale: 'ko-KR',
      timezoneId: 'Asia/Seoul',
      viewport: { width: 1600, height: 1000 }
    });

    try {
      testInfo.skip(!(await isAdminSessionValid(context.request)), SKIP_EXPIRED_ADMIN_SESSION);
      await use(await context.newPage());
    } finally {
      // Pages first: on a failed test, Playwright writes error-context.md from the first page of
      // the first context to close, and that must be the customer's page, not this one.
      await Promise.all(context.pages().map((page) => page.close()));
      await context.close();
    }
  },

  adminApi: async ({ adminPage }, use) => {
    await use(new AdminApi(adminPage.context().request));
  }
});

export { expect } from './e2e-test.js';
