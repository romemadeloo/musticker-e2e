import { test, expect } from '@playwright/test';
import { assertDevE2EReady } from '../fixtures/dev-e2e-preflight.js';
import { spawnSync } from 'node:child_process';

const ready = {
  environment: 'dev-1', storefrontURL: 'https://shared-dev-static-sf.musticker.com/kr',
  apiURL: 'https://shared-dev-static-api.musticker.com/index.php',
  cleanupURL: 'https://shared-dev-static-api.musticker.com/qa/users',
  sandboxEnabled: 'true', paymentEnabled: 'true', authEnabled: 'true',
  email: 'synthetic@example.test', password: 'synthetic-only'
};

test('destructive E2E refuses production even when all flags are enabled', () => {
  expect(() => assertDevE2EReady({ ...ready, environment: 'production' })).toThrow(/registered dev/);
  expect(() => assertDevE2EReady({ ...ready, environment: undefined })).toThrow(/registered dev/);
});

test('sandbox confirmation, execution flags and credentials are mandatory', () => {
  expect(() => assertDevE2EReady({ ...ready, sandboxEnabled: 'false' })).toThrow(/sandbox/);
  expect(() => assertDevE2EReady({ ...ready, paymentEnabled: 'false' })).toThrow(/flags/);
  expect(() => assertDevE2EReady({ ...ready, authEnabled: 'false' })).toThrow(/flags/);
  expect(() => assertDevE2EReady({ ...ready, password: '' })).toThrow(/credentials/);
});

test('cleanup must be configured on the same dev API origin', () => {
  expect(() => assertDevE2EReady({ ...ready, cleanupURL: undefined })).toThrow(/cleanup|DELETE_ENDPOINT/);
  expect(() => assertDevE2EReady({ ...ready, cleanupURL: 'https://api.musticker.com/qa/users' })).toThrow(/match/);
  expect(() => assertDevE2EReady({ ...ready, apiURL: 'https://shared-dev-static-api-2.musticker.com' })).toThrow(/match the selected/);
  expect(() => assertDevE2EReady(ready)).not.toThrow();
});

test('the configured dev E2E tier excludes admin despite project-level filters', () => {
  const result = spawnSync(process.execPath, [
    'node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.dev-e2e.config.ts', '--list', '--reporter=json'
  ], {
    env: {
      ...process.env, E2E_ENVIRONMENT: 'dev-1', BASE_URL: '', API_BASE_URL: '', ADMIN_BASE_URL: '',
      E2E_BROWSER_PROJECT: 'chromium-desktop', RUN_PAYMENT_E2E: 'true', RUN_AUTH_DESTRUCTIVE_E2E: 'true',
      DEV_PAYMENT_SANDBOX_ENABLED: 'true', TEST_DATA_USER_DELETE_ENDPOINT: ready.cleanupURL,
      AUTH_TEST_EMAIL: ready.email, AUTH_TEST_PASSWORD: ready.password, ALLURE_RESULTS_DIR: ''
    },
    encoding: 'utf8'
  });
  expect(result.status, result.stderr).toBe(0);
  type Suite = { specs: { title: string; tags: string[] }[]; suites?: Suite[] };
  const collect = (suites: Suite[]): Suite['specs'] => suites.flatMap(suite => [...suite.specs, ...collect(suite.suites || [])]);
  const specs = collect(JSON.parse(result.stdout).suites);
  expect(specs).toHaveLength(5);
  expect(specs.some(spec => spec.title.startsWith('MS-ADMO-'))).toBe(false);
  expect(specs.every(spec => spec.tags.some(tag => tag.replace(/^@/, '') === 'destructive'))).toBe(true);
});
