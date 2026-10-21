import { defineConfig } from '@playwright/test';

// Hermetic framework/POM tests: no app server, production defaults, or account teardown.
process.env.E2E_ENVIRONMENT = '';
process.env.BASE_URL = 'http://127.0.0.1:9/kr';
process.env.API_BASE_URL = 'http://127.0.0.1:9/api';
process.env.ADMIN_BASE_URL = 'http://127.0.0.1:9/admin';
process.env.INTERNAL_ORIGIN_KEY = '';
process.env.DEV_INTERNAL_ORIGIN_KEY = '';
export default defineConfig({ testDir: './tests/unit', workers: 1, retries: 0, reporter: 'list', outputDir: 'test-results/framework' });
