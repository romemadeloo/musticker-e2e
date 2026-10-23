import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarise } from '../ci/qacc-summary.mjs';

test('recovered retries lower the first-attempt rate; skips do not inflate it', () => {
  const summary = summarise([
    { historyId: 'a', name: 'a', status: 'passed', start: 0, stop: 10 },
    { historyId: 'b', name: 'b', status: 'passed', start: 30, stop: 50 },
    { historyId: 'b', name: 'b', status: 'failed', start: 10, stop: 20 },
    { historyId: 'c', name: 'c', status: 'broken', start: 20, stop: 30 },
    { historyId: 'd', name: 'd', status: 'skipped' }
  ]);
  assert.deepEqual(summary.totals, { tests: 4, passed: 2, failed: 0, broken: 1, skipped: 1, flaky: 1 });
  assert.deepEqual(summary.metrics, {
    attempts: 5, retries: 1, first_attempt_passed: 1, executed: 3,
    first_attempt_pass_rate: 33.33, attempt_duration_ms: 50, run_span_ms: 50
  });
  assert.deepEqual(summary.flaky, [{ title: 'b', attempts: 2, retries: 1 }]);
});

test('missing results and all-skipped runs have no pass-rate claim', () => {
  assert.equal(summarise([]).data_status, 'no_results');
  assert.equal(summarise([]).metrics.first_attempt_pass_rate, null);
  assert.equal(summarise([{ name: 'skipped', status: 'skipped' }]).metrics.first_attempt_pass_rate, null);
});

test('failed final attempts count retries without classifying the test as recovered flaky', () => {
  const summary = summarise([
    { name: 'failure', status: 'failed', start: 0, stop: 20 },
    { name: 'failure', status: 'failed', start: 30, stop: 50 }
  ]);
  assert.equal(summary.metrics.retries, 1);
  assert.equal(summary.metrics.first_attempt_pass_rate, 0);
  assert.equal(summary.totals.flaky, 0);
  assert.equal(summary.totals.failed, 1);
});
