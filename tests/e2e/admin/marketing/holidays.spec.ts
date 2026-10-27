import type { AdminApi } from '../../../fixtures/admin-api.js';
import { QA_RECORD_PREFIX } from '../../../fixtures/admin-data.js';
import { expect, test } from '../../../fixtures/admin-test.js';
import { activeEnvironment } from '../../../fixtures/env.js';
import { AdminHolidaysPage } from '../../../pom/admin/admin-holidays-page.js';

// The panel shows real customers' names and emails, and CI artifacts are public -- see adminPage.
test.use({ screenshot: 'off', trace: 'off' });

/** Two months out, so the test holiday never lands on a date anyone is ordering for today. */
function testDate(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + 2, 15);
  return date;
}

const longDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/**
 * Marketing > Holidays: staff add the days production and shipping stop. Explored by hand on
 * dev-1, 2026-10-27 (create, edit, cancelled and confirmed delete).
 *
 * Writes to the shared server, so every holiday is named with QA_RECORD_PREFIX and the run's id,
 * never affects production or shipping, and is deleted again -- through the UI as the last step of
 * the test, and through the API afterwards in case the test stopped before it got there.
 */
test.describe('Holidays', { tag: ['@admin', '@regression'] }, () => {
  test.skip(activeEnvironment === 'production', 'Creates and deletes holidays; never on production.');

  // One name per test, never per file: CI runs this file's tests in parallel, and when they shared a
  // name, a test that finished first had its afterEach delete the holiday another test was still
  // editing (CI, 2026-10-27). The search is a substring match, so results are also matched exactly.
  const holidayName = () => `${QA_RECORD_PREFIX} holiday ${process.env.E2E_RUN_ID?.slice(0, 8) ?? 'local'} ${test.info().testId.slice(-8)}`;
  const holidaysNamed = async (adminApi: AdminApi, name: string) =>
    (await adminApi.holidays(name)).filter((holiday) => holiday.name === name);

  test.afterEach(async ({ adminApi }) => {
    for (const leftover of await holidaysNamed(adminApi, holidayName())) {
      await adminApi.deleteQaHoliday(leftover, QA_RECORD_PREFIX);
    }
  });

  test('MS-ADM-010 a holiday can be added, edited, and deleted after confirmation', async ({ adminPage, adminApi }) => {
    const name = holidayName();
    const holidays = new AdminHolidaysPage(adminPage);
    const date = testDate();
    await holidays.goto();

    await test.step('add', async () => {
      await holidays.openAddForm();
      await holidays.fill({ name, date, type: 'Public', affectsProduction: false, affectsShipping: false, notes: 'QA e2e' });
      await holidays.saveAndExpectClosed();

      await expect(holidays.row(name)).toBeVisible();
      await expect.poll(() => holidays.rowCells(name)).toEqual([name, longDate(date), 'Public', 'No', 'No', 'QA e2e']);
      const [saved] = await holidaysNamed(adminApi, name);
      expect(saved).toMatchObject({ name, type: 'public', affects_production: false, affects_shipping: false, notes: 'QA e2e' });
    });

    await test.step('edit', async () => {
      await holidays.openEditForm(name);
      await holidays.fill({ type: 'Special', notes: 'QA e2e edited' });
      await holidays.saveAndExpectClosed();

      await expect(holidays.row(name)).toContainText('Special');
      await expect.poll(async () => (await holidaysNamed(adminApi, name))[0]?.type).toBe('special');
    });

    await test.step('"No, Thanks" keeps it', async () => {
      await holidays.requestDelete(name);
      await holidays.answerDelete(false);
      await expect(holidays.row(name)).toBeVisible();
    });

    await test.step('"Yes, I\'m Sure" deletes it', async () => {
      await holidays.requestDelete(name);
      await holidays.answerDelete(true);
      await expect(holidays.row(name)).toHaveCount(0);
      await expect.poll(async () => (await holidaysNamed(adminApi, name)).length).toBe(0);
    });
  });

  test('MS-ADM-011 saving a blank holiday says which fields are missing', async ({ adminPage, adminApi }) => {
    // DEFECT (found 2026-10-27): the API answers with "The name field is required." and four more
    // field errors, and the panel shows none of them -- Save just appears to do nothing. Remove this
    // line once the form shows the errors.
    test.fail(true, 'DEFECT admin Holidays: validation errors from /holiday/add are not shown');

    const holidays = new AdminHolidaysPage(adminPage);
    await holidays.goto();
    await holidays.openAddForm();
    await holidays.save();

    await expect(holidays.panel, 'the form stays open for correction').toBeVisible();
    await expect
      .poll(() => adminApi.holidays(''), { message: 'nothing is created' })
      .not.toContainEqual(expect.objectContaining({ name: '' }));
    await expect(holidays.panel.getByText(/required/i).first(), 'the missing fields are named').toBeVisible({ timeout: 3_000 });
  });

  test('MS-ADM-012 holiday row actions are named for assistive technology', async ({ adminPage }) => {
    // DEFECT (found 2026-10-27): edit and delete are icon-only buttons with no text, aria-label or
    // title, so a screen reader announces each as just "button". Remove this line once they are named.
    test.fail(true, 'DEFECT admin Holidays: row action buttons have no accessible name');

    const holidays = new AdminHolidaysPage(adminPage);
    await holidays.goto();
    const firstRow = holidays.rows.first();
    await expect(firstRow).toBeVisible();

    await expect(firstRow.getByRole('button', { name: /edit/i })).toBeVisible({ timeout: 3_000 });
    await expect(firstRow.getByRole('button', { name: /delete/i })).toBeVisible({ timeout: 3_000 });
  });
});
