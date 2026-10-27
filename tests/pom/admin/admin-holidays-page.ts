import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { holidayCopy } from '../../fixtures/admin-data.js';
import { waitForNuxtHydration } from '../../fixtures/hydration.js';

export type HolidayForm = {
  name: string;
  /** A day in the calendar's current month or later, reached with the month arrows. */
  date: Date;
  type: 'Public' | 'Special';
  affectsProduction?: boolean;
  affectsShipping?: boolean;
  notes?: string;
};

/**
 * `/holidays` -- Marketing > Holidays. Holidays push production and shipping dates out, so specs
 * only ever create ones in the future with both "affects" boxes unticked.
 *
 * The form is a slide-in panel. Its date input is readonly and opened through its label: typed text is taken as calendar keyboard
 * navigation and moves the selection, so a date is always picked from the v-calendar grid, whose day
 * buttons are named like "Tuesday, Dec 29, 2026". The row actions are two unlabelled icon buttons
 * (edit, then delete) and are found by position -- see MS-ADM-012.
 */
export class AdminHolidaysPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly panel: Locator;
  readonly rows: Locator;
  readonly deleteDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: holidayCopy.addHoliday });
    this.panel = page.locator('.m-slide-modal__panel');
    this.rows = page.locator('main tbody tr.m-dt-row').filter({ visible: true });
    this.deleteDialog = page.locator('.modal-container').filter({ hasText: holidayCopy.deleteHeading });
  }

  /**
   * Waits for hydration and the first list response: the server-rendered Add Holiday button is
   * visible before its handler is bound, and a click in that window opens nothing (dev-1,
   * 2026-10-27).
   */
  async goto(): Promise<void> {
    const firstList = this.page.waitForResponse((response) => /\/holiday\/all\?/.test(response.url()));
    await this.page.goto('/holidays');
    await expect(this.addButton).toBeVisible();
    await waitForNuxtHydration(this.page);
    await firstList;
  }

  row(name: string): Locator {
    return this.rows.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async openAddForm(): Promise<void> {
    await this.addButton.click();
    await expect(this.panel).toBeVisible();
  }

  async openEditForm(name: string): Promise<void> {
    await this.row(name).getByRole('button').nth(0).click();
    await expect(this.panel).toBeVisible();
    await expect(this.panel.locator('#name')).toHaveValue(name);
  }

  async fill(form: Partial<HolidayForm>): Promise<void> {
    if (form.name !== undefined) await this.panel.locator('#name').fill(form.name);
    if (form.date) await this.pickDate(form.date);
    if (form.type) {
      await this.panel.locator('.m-select-dropdown .m-select-btn a').click();
      await this.panel.locator('li.m-dropdown-option a').filter({ hasText: form.type }).click();
      await expect(this.panel.locator('.m-select-btn-txt')).toHaveText(form.type);
    }
    if (form.affectsProduction !== undefined) await this.setAffects('Production', form.affectsProduction);
    if (form.affectsShipping !== undefined) await this.setAffects('Shipping', form.affectsShipping);
    if (form.notes !== undefined) await this.panel.locator('#notes').fill(form.notes);
  }

  async save(): Promise<void> {
    await this.panel.getByRole('button', { name: holidayCopy.save }).click();
  }

  async saveAndExpectClosed(): Promise<void> {
    await this.save();
    await expect(this.panel).toBeHidden();
  }

  async requestDelete(name: string): Promise<void> {
    await this.row(name).getByRole('button').nth(1).click();
    await expect(this.deleteDialog).toBeVisible();
  }

  async answerDelete(confirm: boolean): Promise<void> {
    await this.deleteDialog
      .getByRole('button', { name: confirm ? holidayCopy.confirmDelete : holidayCopy.keepIt })
      .click();
    await expect(this.deleteDialog).toBeHidden();
  }

  /** The row's cells: name, date, type, affects production, affects shipping, notes. */
  async rowCells(name: string): Promise<string[]> {
    const cells = await this.row(name).locator('td').allInnerTexts();
    return cells.slice(0, 6).map((cell) => cell.trim());
  }

  private async pickDate(date: Date): Promise<void> {
    // The field's label covers the calendar icon and takes the click; clicking it opens the picker.
    await this.panel.locator('label[for="holiday-date"]').click();
    const calendar = this.page.locator('.m-calendar').filter({ visible: true });
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    // v-calendar's day class, not the day's name: the panel is localised by the browser locale
    // (ko-KR in the suite, so the header reads "10월 2026" and day names are Korean).
    const target = calendar.locator(`.vc-day.id-${date.getFullYear()}-${mm}-${dd} .vc-day-content`);

    // The picker opens on the current month. Step exactly as many months as needed, waiting for the
    // header to change each time: a click during the slide animation would skip a month, and
    // mid-slide the calendar holds two headers (hence first()).
    const now = new Date();
    const steps = (date.getFullYear() - now.getFullYear()) * 12 + date.getMonth() - now.getMonth();
    expect(steps, 'holiday dates are picked from this month onwards').toBeGreaterThanOrEqual(0);
    const header = calendar.locator('.m-calendar__title');

    for (let step = 1; step <= steps; step++) {
      const before = await header.first().innerText();
      await calendar.locator('.vc-arrow.vc-next').first().click();
      await expect(header).toHaveCount(1);
      await expect(header).not.toHaveText(before);
    }

    await target.click();
    await expect(this.panel.locator('#holiday-date')).toHaveValue(`${mm} / ${dd} / ${date.getFullYear()}`);
  }

  private async setAffects(label: 'Production' | 'Shipping', checked: boolean): Promise<void> {
    const box = this.panel.locator('label.m-checkbox-label').filter({ hasText: label });
    if ((await box.locator('input').isChecked()) !== checked) await box.click();
    await expect(box.locator('input')).toBeChecked({ checked });
  }
}
