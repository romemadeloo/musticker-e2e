// Mirrors the workflow_dispatch inputs of .github/workflows/manual-playwright.yml. GitHub rejects a
// value the workflow does not list, so keep these in step with it.
export const ENVIRONMENT_KEYS = ['production', 'qa', 'dev-1', 'dev-2', 'dev-3', 'dev-4', 'dev-5', 'dev-6'] as const;

export const SUITES = ['smoke', 'api', 'auth', 'regression', 'purchasing', 'validation', 'a11y', 'custom-grep'] as const;

export const BROWSER_PROJECTS = [
  'chromium-desktop',
  'firefox-desktop',
  'webkit-desktop',
  'chromium-mobile',
  'all-desktop'
] as const;

export const CASE_STATUSES = ['active', 'quarantined', 'retired'] as const;

export const CRON_PRESETS = [
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Daily 02:00', cron: '0 2 * * *' },
  { label: 'Weekdays 09:00', cron: '0 9 * * 1-5' },
  { label: 'Sundays 03:00', cron: '0 3 * * 0' }
] as const;

export const PROJECT_COOKIE = 'qa_project';
