import 'dotenv/config';

import { defineConfig } from '@playwright/test';

// `npm run admin:login` -- a one-off, human-in-the-loop capture of an admin panel session, kept out
// of playwright.config.ts so no suite run can ever pick it up. See admin-login.setup.ts.
export default defineConfig({
  testDir: '.',
  testMatch: 'admin-login.setup.ts',
  // Long enough for a person to fetch the code from the sales@ inbox.
  timeout: 10 * 60_000,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    headless: false,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    viewport: { width: 1400, height: 900 },
    // Nothing from this run may be kept: the page holds a live admin login.
    trace: 'off',
    video: 'off',
    screenshot: 'off'
  }
});
