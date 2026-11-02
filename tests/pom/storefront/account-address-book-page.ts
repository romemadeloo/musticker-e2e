import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { accountCopy, accountMenuSections } from '../../fixtures/storefront-data.js';
import { AccountShell } from './account-shell.js';

// One request per address type; the page renders all three groups.
const ADDRESS_REQUESTS = ['shipping', 'drop', 'billing'].map((type) => new RegExp(`/sys/kr/user-address[?]type=${type}`));

const copy = accountCopy.addressBook;

/**
 * `/kr/account/address-book` -- the member's saved addresses, grouped by type (배송지 주소 first).
 *
 * Verified live against dev-1 on 2026-11-02. Each card is `account-address-book-item-<type>-<n>`
 * with a `…-menu-<type>-<n>-button` that opens 주소 수정 / 삭제 / 기본 배송지로 설정
 * (`…-menu-<type>-<n>-edit|delete|default`). 새 주소 추가 opens `account-address-book-add-modal`.
 *
 * The add form's 저장 posts to `POST /sys/kr/user-address` even when every field is blank and only
 * then shows the field errors, so nothing here presses 저장: the dialog is checked and cancelled.
 */
export class AccountAddressBookPage {
  readonly page: Page;
  readonly shell: AccountShell;
  readonly root: Locator;
  readonly title: Locator;
  readonly addButton: Locator;
  readonly shippingSection: Locator;
  readonly addDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shell = new AccountShell(page);
    this.root = page.getByTestId('account-address-book-page');
    this.title = page.getByTestId('account-address-book-title');
    this.addButton = page.getByTestId('account-address-book-add-button');
    this.shippingSection = page.getByTestId('account-address-book-section-shipping');
    this.addDialog = page.getByRole('dialog', { name: copy.addDialogHeading });
  }

  async goto(): Promise<void> {
    await this.shell.goto(accountMenuSections.find((section) => section.key === 'address-book')!, ADDRESS_REQUESTS);
    await expect(this.title).toHaveText(copy.heading);
  }

  /** Saved address cards of every type; the menu buttons share the prefix, so they are excluded. */
  addressCards(): Locator {
    return this.page.locator('[data-testid^="account-address-book-item-"]:not([data-testid*="-menu-"])');
  }

  shippingCards(): Locator {
    return this.page.locator('[data-testid^="account-address-book-item-shipping-"]:not([data-testid*="-menu-"])');
  }

  /** Opens a card's menu: card `…-item-shipping-0` pairs with `…-item-menu-shipping-0-button`. */
  async openMenu(card: Locator): Promise<Locator> {
    const cardId = (await card.getAttribute('data-testid'))!;
    const menuId = cardId.replace('account-address-book-item-', 'account-address-book-item-menu-');
    await this.page.getByTestId(`${menuId}-button`).click();
    const menu = this.page.getByTestId(menuId);
    await expect(menu).toBeVisible();
    return menu;
  }

  async openAddDialog(): Promise<void> {
    await this.addButton.click();
    await expect(this.addDialog).toBeVisible();
  }

  async cancelAddDialog(): Promise<void> {
    await this.addDialog.getByRole('button', { name: copy.cancelButton, exact: true }).click();
    await expect(this.addDialog).toBeHidden();
  }
}
