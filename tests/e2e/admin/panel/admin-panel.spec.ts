import { adminSections } from '../../../fixtures/admin-data.js';
import { expect, test } from '../../../fixtures/admin-test.js';
import { activeEnvironment } from '../../../fixtures/env.js';
import { AdminOrderDetailPage } from '../../../pom/admin/admin-order-detail-page.js';
import { AdminOrdersPage } from '../../../pom/admin/admin-orders-page.js';

// The panel shows real customers' names and emails, and CI artifacts are public -- see adminPage.
test.use({ screenshot: 'off', trace: 'off' });

/**
 * The admin panel's pages and the numbers on them, against the admin API that feeds them. Explored
 * by hand on dev-1, 2026-10-27, which is where every expectation here was read.
 *
 * Read-only apart from MS-ADM-007, which flips an order's priority star and flips it back.
 */
test.describe('Admin panel', { tag: ['@admin', '@regression'] }, () => {
  for (const { path, heading } of adminSections) {
    test(`MS-ADM-003 ${path} opens on "${heading}"`, async ({ adminPage }) => {
      await adminPage.goto(path);

      await expect(adminPage).toHaveURL((url) => url.pathname === path);
      await expect(adminPage.locator('main').getByText(heading, { exact: true }).first()).toBeVisible();
    });
  }

  test('MS-ADM-004 every order status tab shows the count the API holds for it', async ({ adminPage, adminApi }) => {
    const orders = new AdminOrdersPage(adminPage);
    await orders.goto();

    const tabs = await adminApi.orderTabs();
    expect(tabs.map((tab) => tab.code), 'the panel shows the six order tabs').toEqual(['BP', 'FP', 'SP', 'CP', 'CC', 'PA']);

    for (const tab of tabs) {
      await expect(orders.statusTab(tab.name), `${tab.name} tab`).toBeVisible();
      // Polled together: an order can change status on a shared server between the two reads.
      await expect
        .poll(async () => (await orders.tabCount(tab.name)) - (await adminApi.orderTabCount(tab.code)), {
          message: `${tab.name} (${tab.code}) badge against orders/admin/list/count`
        })
        .toBe(0);
    }
  });

  test('MS-ADM-004 selecting a status tab lists that tab’s orders', async ({ adminPage, adminApi }) => {
    const orders = new AdminOrdersPage(adminPage);
    await orders.goto();
    const [tab] = (await adminApi.orderTabs()).filter((candidate) => candidate.code === 'FP');

    await orders.selectTab(tab.name, tab.code);
    const expected = (await adminApi.ordersInTab(tab.code)).map((order) => order.order_number);
    test.skip(expected.length === 0, `${tab.name} holds no orders on this server`);

    await expect(orders.visibleRows()).toHaveCount(expected.length);
    await expect(orders.visibleRows().first()).toContainText(expected[0]);
  });

  test('MS-ADM-005 customer segments add up and match the dashboard', async ({ adminPage, adminApi }) => {
    const segments = await adminApi.customerSegments();
    expect(segments.all, 'All = Members + Non-members').toBe(segments.member + segments.nonmember);

    await adminPage.goto('/customers');
    const main = adminPage.locator('main');
    await expect(main.getByRole('button', { name: `All Customers ${segments.all}` })).toBeVisible();
    await expect(main.getByRole('button', { name: `Members ${segments.member}`, exact: true })).toBeVisible();
    await expect(main.getByRole('button', { name: `Non-members ${segments.nonmember}` })).toBeVisible();
    await expect(main.getByText(new RegExp(`Showing 1-\\d+ of ${segments.all} entries`))).toBeVisible();

    await adminPage.goto('/dashboard');
    await expect(adminPage.locator('main')).toContainText(new RegExp(`Total Customers\\s*${segments.all}\\b`));
  });

  test('MS-ADM-006 searching an invoice number lists that order alone and opens it', async ({ adminPage, adminApi }) => {
    const [order] = await adminApi.ordersInTab('BP');
    test.skip(!order, '제작 전 holds no orders on this server');

    const orders = new AdminOrdersPage(adminPage);
    await orders.goto();
    await orders.search(order.order_number);
    await expect(orders.visibleRows()).toHaveCount(1);
    await expect(orders.visibleRows()).toContainText(order.customer_details.email);

    await orders.visibleRows().getByText(order.order_number, { exact: true }).click();
    await expect(adminPage, 'the detail page is the searched order').toHaveURL(new RegExp(`/orders/${order.id}$`));
    await expect(new AdminOrderDetailPage(adminPage).title).toContainText(order.order_number);
  });

  test('MS-ADM-007 the priority star is saved on the order and can be cleared', async ({ adminPage, adminApi }) => {
    test.skip(activeEnvironment === 'production', 'Changes an order flag; never on production.');
    const [order] = await adminApi.ordersInTab('BP');
    test.skip(!order, '제작 전 holds no orders on this server');

    const starred = async () => (await adminApi.findOrder(order.order_number)).is_starred;
    const original = await starred();
    const orders = new AdminOrdersPage(adminPage);
    await orders.goto();
    await orders.search(order.order_number);

    try {
      await orders.starIcon(order.order_number).click();
      await expect.poll(starred, { message: 'the star is saved on the order' }).toBe(original ? 0 : 1);

      await orders.goto();
      await orders.search(order.order_number);
      await orders.starIcon(order.order_number).click();
      await expect.poll(starred, { message: 'clicking again clears it' }).toBe(original);
    } finally {
      // Leave the shared order as it was found, whichever step failed.
      if ((await starred()) !== original) {
        await orders.goto();
        await orders.search(order.order_number);
        await orders.starIcon(order.order_number).click();
      }
    }
  });
});
