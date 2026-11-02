import { test, expect } from '../../../fixtures/e2e-test.js';
import { SKIP_WITHOUT_MEMBER_CREDENTIALS, hasMemberCredentials } from '../../../fixtures/member-auth.js';
import { accountCopy } from '../../../fixtures/storefront-data.js';
import { AccountAddressBookPage } from '../../../pom/storefront/account-address-book-page.js';

const copy = accountCopy.addressBook;

// /kr/account/address-book, verified live against dev-1 on 2026-11-02 with a member holding one
// default shipping address.
//
// Read-only: the add form is opened and cancelled, never saved (its 저장 posts even when blank),
// and the card menu is opened without choosing anything from it.
test.describe('Address book', { tag: ['@regression', '@production', '@auth', '@credentialed'] }, () => {
  test.use({
    asMember: true,
    allowGuestUserMe401: true,
    allowExpectedAuthFailures: true,
    allowKnownNuxtPayloadFailures: true
  });

  test.skip(!hasMemberCredentials(), SKIP_WITHOUT_MEMBER_CREDENTIALS);

  test('MS-ACC-012 saved addresses show a name, phone and address, with one marked 기본 배송', async ({ page }) => {
    const addressBook = new AccountAddressBookPage(page);
    await addressBook.goto();

    const count = await addressBook.addressCards().count();
    test.skip(count === 0, 'MS-ACC-012 needs a member with at least one saved address.');

    const cards = addressBook.addressCards();
    for (let index = 0; index < count; index += 1) {
      const card = cards.nth(index);
      await expect(card, `address card ${index} shows no phone number`).toContainText(/\d{2,3}-?\d{3,4}-?\d{4}/);
      // A Korean street address carries a 5-digit postcode. The card runs it straight into the next
      // line's text ("… 7 05315Rome Inc."), so digit lookarounds rather than word boundaries.
      await expect(card, `address card ${index} shows no postcode`).toContainText(/(?<!\d)\d{5}(?!\d)/);
    }

    const shipping = await addressBook.shippingCards().count();
    test.skip(shipping === 0, 'MS-ACC-012 checks the default only among shipping addresses, and there are none.');
    await expect(addressBook.shippingCards().filter({ hasText: copy.defaultBadge })).toHaveCount(1);
  });

  test('MS-ACC-013 새 주소 추가 opens the address form, and 취소 closes it without adding anything', async ({ page }) => {
    const addressBook = new AccountAddressBookPage(page);
    await addressBook.goto();
    const before = await addressBook.addressCards().count();

    await addressBook.openAddDialog();
    const dialog = addressBook.addDialog;
    await expect(dialog.getByRole('textbox', { name: copy.nameField, exact: true })).toBeEditable();
    // The postcode is filled only by the address search, never typed.
    await expect(dialog.getByRole('textbox', { name: copy.postcodeField, exact: true })).toBeDisabled();
    await expect(dialog.getByRole('button', { name: copy.findAddressButton, exact: true })).toBeVisible();
    await expect(dialog.getByRole('button', { name: copy.saveButton, exact: true })).toBeVisible();

    await addressBook.cancelAddDialog();
    await expect(addressBook.addressCards()).toHaveCount(before);
  });

  test('MS-ACC-014 an address card\'s menu offers edit, delete and make-default', async ({ page }) => {
    const addressBook = new AccountAddressBookPage(page);
    await addressBook.goto();

    const count = await addressBook.addressCards().count();
    test.skip(count === 0, 'MS-ACC-014 needs a member with at least one saved address.');

    const menu = await addressBook.openMenu(addressBook.addressCards().first());
    await expect(menu.getByRole('button')).toHaveText([...copy.menuItems]);
  });
});
