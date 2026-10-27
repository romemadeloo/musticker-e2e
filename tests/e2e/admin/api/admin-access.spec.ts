import { test, expect } from '../../../fixtures/api-test.js';

import { adminBaseUrl, apiPath } from '../../../fixtures/env.js';

/**
 * The admin API must refuse anyone without an admin session -- the panel's pages hide behind a
 * login redirect, but the data behind them is only as safe as these endpoints. Needs no admin
 * session, so it runs everywhere the API contracts do, production included: every request is
 * anonymous and refused, and the one write is an empty body that could not create anything even if
 * it were accepted.
 *
 * Endpoints read off the panel's own traffic on dev-1, 2026-10-27.
 */
const readEndpoints = [
  '/sys/kr/auth/admin/me',
  '/sys/kr/orders/admin/list?order_date&search_key&page=1&order_tab=BP&sort_column&sort_direction',
  '/sys/kr/orders/admin/list/count?order_date&search_key&page=1&order_tab=BP',
  '/sys/kr/orders/admin/order-tabs',
  '/sys/kr/orders/admin/details/1',
  '/sys/kr/customer?role=all&search&sort_column=date_added&sort_direction=desc&per_page=10&page=1',
  '/sys/kr/dashboard/customers',
  '/sys/kr/holiday/all?search&page=1&per_page=10'
];

test.describe('Admin API access', { tag: ['@api', '@admin', '@security', '@smoke', '@production'] }, () => {
  test.skip(!adminBaseUrl(), 'This environment has no admin panel in tests/fixtures/environments.ts.');

  for (const endpoint of readEndpoints) {
    test(`MS-ADM-001 anonymous GET ${endpoint.split('?')[0]} is refused`, async ({ request }) => {
      const response = await request.get(apiPath(endpoint), { headers: { origin: adminBaseUrl()! } });

      expect(response.status(), 'an anonymous admin request must be refused with 401').toBe(401);
      expect(await response.json()).toMatchObject({ success: false, message: 'Unauthenticated.', data: null });
    });
  }

  test('MS-ADM-001 anonymous POST /sys/kr/holiday/add is refused before validation', async ({ request }) => {
    const response = await request.post(apiPath('/sys/kr/holiday/add'), {
      headers: { origin: adminBaseUrl()! },
      data: {}
    });

    // 401, not the 200 + validation errors an admin gets for the same empty body: authentication has
    // to come first, or the endpoint is describing its schema to anyone who asks.
    expect(response.status()).toBe(401);
    expect(await response.json()).toMatchObject({ success: false, message: 'Unauthenticated.' });
  });
});
