import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ko } from '../fixtures/storefront-data.js';

// Shared by the cart preview drawer's 사이즈 및 수량 수정 dialog and the full cart page's 사이즈 변경
// dialog. Both surface the individual-size choice as a ui-select listbox rather than the product
// page's visible pill row, and both label the custom option 맞춤 사이즈 (not the product page's
// 원하는 크기 입력). The drawer's dialog also carries a second trigger for quantity, so the size
// trigger is always the first one.
export async function enterCartDialogCustomSize(
  page: Page,
  dialog: Locator,
  widthMm: number,
  heightMm: number
): Promise<void> {
  await dialog.locator('button.cart-item-edit-select-trigger').first().click({ force: true });

  const listbox = page.getByRole('listbox').last();
  await expect(listbox).toBeVisible();
  await listbox.getByText(ko.cartCustomSize).first().click({ force: true });

  // Unlike the size-guide modal's `#sheet-width`/`#sheet-height`, the cart dialogs render
  // `.cart-item-edit-inline-input` pairs pre-filled with the line item's current size.
  const width = dialog.locator('.cart-item-edit-inline-input').first();
  await expect(width).toBeVisible();
  await width.fill(String(widthMm));

  const height = dialog.locator('.cart-item-edit-inline-input').last();
  await height.fill(String(heightMm));
  await height.blur();
}
