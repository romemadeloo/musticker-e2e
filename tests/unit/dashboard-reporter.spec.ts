import { test, expect } from '@playwright/test';
import { caseIdOf, statusOf, suiteLabel } from '../reporters/dashboard-reporter.js';

test('dashboard reporter reads the workbook case ID from a test title', () => {
  expect(caseIdOf('MS-CRT-001 adds a sticker to the cart')).toBe('MS-CRT-001');
  expect(caseIdOf('MS-AUTH-020: registers a member')).toBe('MS-AUTH-020');
  expect(caseIdOf('header actions wait for hydration')).toBeNull();
});

test('dashboard reporter records the final outcome, not the attempt', () => {
  const outcome = (o: ReturnType<Parameters<typeof statusOf>[0]['outcome']>) => ({ outcome: () => o });

  expect(statusOf(outcome('expected'), { status: 'passed' })).toBe('passed');
  expect(statusOf(outcome('expected'), { status: 'skipped' })).toBe('skipped');
  expect(statusOf(outcome('skipped'), { status: 'skipped' })).toBe('skipped');
  expect(statusOf(outcome('flaky'), { status: 'passed' })).toBe('flaky');
  expect(statusOf(outcome('unexpected'), { status: 'failed' })).toBe('failed');
  expect(statusOf(outcome('unexpected'), { status: 'timedOut' })).toBe('timedOut');
  expect(statusOf(outcome('unexpected'), { status: 'interrupted' })).toBe('interrupted');
  // test.fail() that unexpectedly passed
  expect(statusOf(outcome('unexpected'), { status: 'passed' })).toBe('failed');
});

test('dashboard reporter labels the suite from CI input or the npm script', () => {
  expect(suiteLabel({ DASHBOARD_SUITE: 'regression', npm_lifecycle_event: 'test:smoke' })).toBe('regression');
  expect(suiteLabel({ npm_lifecycle_event: 'test:smoke' })).toBe('smoke');
  expect(suiteLabel({ npm_lifecycle_event: 'typecheck' })).toBeNull();
  expect(suiteLabel({})).toBeNull();
});
