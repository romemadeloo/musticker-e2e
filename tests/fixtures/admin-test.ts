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
   * Deliberately not recorded: the panel shows real customers' names and emails, and this repo's
   * CI artifacts are public. A context created here is outside Playwright's screenshot/video/trace
   * options, which only instrument the built-in `context`.
   */
  adminPage: Page;
  adminApi: AdminApi;
};

export const test = e2eTest.extend<AdminFixtures>({
  adminPage: async ({ browser }, use, testInfo) => {
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
      await context.close();
    }
  },

  adminApi: async ({ adminPage }, use) => {
    await use(new AdminApi(adminPage.context().request));
  }
});

export { expect } from './e2e-test.js';
