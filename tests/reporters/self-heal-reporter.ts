import fs from 'node:fs';
import path from 'node:path';

import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

import { selfHealAnnotationType } from '../fixtures/self-heal-annotation.js';

// Rolls the `self-healed` annotations from tests/fixtures/self-heal.ts up into one list per run, so
// copy drift is reported even though the tests it touched passed. Each distinct drift is listed once
// with the tests that hit it; retries of the same test are counted once.
//
// Written to the console, to test-results/self-heal-report.md, and -- on GitHub Actions -- to the job
// summary, which is where a sharded run's shards meet.
export default class SelfHealReporter implements Reporter {
  private readonly testsByHeal = new Map<string, Set<string>>();

  onTestEnd(test: TestCase, result: TestResult): void {
    for (const annotation of result.annotations) {
      if (annotation.type !== selfHealAnnotationType || !annotation.description) {
        continue;
      }

      const tests = this.testsByHeal.get(annotation.description) ?? new Set<string>();
      tests.add(test.titlePath().slice(1).join(' > '));
      this.testsByHeal.set(annotation.description, tests);
    }
  }

  onEnd(): void {
    if (this.testsByHeal.size === 0) {
      return;
    }

    const report = this.renderMarkdown();
    console.warn(`\n${report}`);

    const outputFile = path.join('test-results', 'self-heal-report.md');
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, report, 'utf8');

    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`, 'utf8');
    }
  }

  printsToStdio(): boolean {
    return false;
  }

  private renderMarkdown(): string {
    const lines = [
      `### Self-healed locators (${this.testsByHeal.size})`,
      '',
      'These tests passed by falling back to a stable identifier because the expected storefront copy',
      'was not found. Update the fixture (usually tests/fixtures/storefront-data.ts) to the text below,',
      'then confirm with `SELF_HEAL=off`.',
      ''
    ];

    for (const [heal, tests] of [...this.testsByHeal].sort(([a], [b]) => a.localeCompare(b))) {
      lines.push(`- ${heal} -- ${tests.size} test${tests.size === 1 ? '' : 's'}`);
      for (const title of [...tests].slice(0, 5)) {
        lines.push(`  - ${title}`);
      }
      if (tests.size > 5) {
        lines.push(`  - ...and ${tests.size - 5} more`);
      }
    }

    return `${lines.join('\n')}\n`;
  }
}
