#!/usr/bin/env node
/**
 * Builds a small JSON summary of a Playwright run from the Allure result files the suite already
 * writes (allure-playwright, one <uuid>-result.json per test attempt). QA Control Center downloads
 * it as the `qacc-summary` artifact to show pass/fail counts and which TC IDs failed, without
 * parsing the large HTML/Allure reports.
 *
 *   node scripts/ci/qacc-summary.mjs <allure-results-dir> <output.json>
 *
 * No dependencies, never fails the job: on any problem it writes what it can and exits 0.
 */
/* global console */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export const SCHEMA = 'qacc-summary/1';
const MAX_FAILED = 500;
const MAX_FLAKY = 200;

/**
 * @param {Array<{name?: string, fullName?: string, historyId?: string, status?: string,
 *   stop?: number, start?: number, statusDetails?: {message?: string}}>} results
 */
export function summarise(results) {
  // One entry per test: retries share a historyId; the last attempt is the outcome.
  const attempts = new Map();
  for (const r of results) {
    const key = r.historyId || r.fullName || r.name;
    if (!key || !r.name) continue;
    const list = attempts.get(key) ?? [];
    list.push(r);
    attempts.set(key, list);
  }

  const totals = { tests: 0, passed: 0, failed: 0, broken: 0, skipped: 0, flaky: 0 };
  const failed = [];
  const flaky = [];
  for (const list of attempts.values()) {
    list.sort((a, b) => (a.stop ?? a.start ?? 0) - (b.stop ?? b.start ?? 0));
    const last = list.at(-1);
    const status = ['passed', 'failed', 'broken', 'skipped'].includes(last.status) ? last.status : 'broken';
    totals.tests++;
    totals[status]++;
    if (status === 'failed' || status === 'broken') {
      failed.push({
        title: last.name,
        status,
        // Playwright messages carry terminal colour codes (ESC [ ... m); strip them.
        // eslint-disable-next-line no-control-regex
        message: (last.statusDetails?.message ?? '').replace(/\u001b\[[0-9;]*m/g, '').slice(0, 300),
      });
    } else if (status === 'passed' && list.some((a) => a.status === 'failed' || a.status === 'broken')) {
      totals.flaky++;
      flaky.push({ title: last.name });
    }
  }
  failed.sort((a, b) => a.title.localeCompare(b.title));
  flaky.sort((a, b) => a.title.localeCompare(b.title));
  return {
    schema: SCHEMA,
    generated_at: new Date().toISOString(),
    totals,
    failed: failed.slice(0, MAX_FAILED),
    flaky: flaky.slice(0, MAX_FLAKY),
    truncated: failed.length > MAX_FAILED || flaky.length > MAX_FLAKY,
  };
}

export function readResults(dir) {
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('-result.json'));
  } catch {
    return [];
  }
  const results = [];
  for (const file of files) {
    try {
      results.push(JSON.parse(readFileSync(join(dir, file), 'utf8')));
    } catch {
      // A truncated file (e.g. a killed shard) must not stop the summary.
    }
  }
  return results;
}

const [, script, dir, out] = process.argv;
// Only run when executed directly (not when imported by tests).
if (script && import.meta.url === pathToFileURL(script).href && dir && out) {
  const summary = summarise(readResults(dir));
  writeFileSync(out, JSON.stringify(summary, null, 1));
  const t = summary.totals;
  console.log(
    `qacc-summary: ${t.tests} tests, ${t.passed} passed, ${t.failed + t.broken} failed, ${t.flaky} flaky, ${t.skipped} skipped`,
  );
}
