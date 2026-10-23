import { defineConfig } from '@playwright/test';
import base from './playwright.config.js';

export default defineConfig({
  ...base,
  testMatch: '**/api/*.spec.ts',
  projects: [{ name: 'api' }],
  workers: 1,
  retries: 0,
  outputDir: 'test-results/api'
});
