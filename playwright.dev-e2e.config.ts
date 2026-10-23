import { defineConfig } from '@playwright/test';
import base from './playwright.config.js';
import { activeEnvironment, env } from './tests/fixtures/env.js';
import { assertDevE2EReady } from './tests/fixtures/dev-e2e-preflight.js';

assertDevE2EReady({
  environment: activeEnvironment,
  storefrontURL: env.BASE_URL,
  apiURL: env.API_BASE_URL,
  cleanupURL: process.env.TEST_DATA_USER_DELETE_ENDPOINT,
  sandboxEnabled: process.env.DEV_PAYMENT_SANDBOX_ENABLED,
  paymentEnabled: process.env.RUN_PAYMENT_E2E,
  authEnabled: process.env.RUN_AUTH_DESTRUCTIVE_E2E,
  email: env.AUTH_TEST_EMAIL,
  password: env.AUTH_TEST_PASSWORD
});

process.env.REQUIRE_TEST_DATA_CLEANUP = 'true';

export default defineConfig({
  ...base,
  testMatch: '**/storefront/**/*.spec.ts',
  grep: /@destructive/,
  workers: 1,
  retries: 0,
  outputDir: 'test-results/dev-e2e'
});
