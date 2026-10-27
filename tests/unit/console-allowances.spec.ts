import { test, expect } from '@playwright/test';
import { consoleAllowances } from '../fixtures/console-allowances.js';

const today = new Date().toISOString().slice(0, 10);

for (const [option, allowance] of Object.entries(consoleAllowances)) {
  test(`${option} is justified and, if a workaround, still within its review date`, () => {
    expect(allowance.reason.trim(), `${option} needs a reason`).not.toBe('');
    if (allowance.kind !== 'workaround') return;

    expect(allowance.reviewBy, `${option} reviewBy must be YYYY-MM-DD`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(
      allowance.reviewBy >= today,
      `${option} passed its review date ${allowance.reviewBy}. Re-run the specs that use it without the ` +
        'option: if the noise is gone, delete the option; if not, link a ticket and set a new reviewBy.'
    ).toBe(true);
  });
}
