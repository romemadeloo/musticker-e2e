import { test, expect } from '../../../fixtures/api-test.js';
import { apiPath } from '../../../fixtures/env.js';
import { unregisteredLogin } from '../../../fixtures/storefront-data.js';

// These requests deliberately fail authentication; they do not create users or send email.
// The deployed API reports both validation and credential rejection as HTTP 200, so checking
// status alone would miss a broken backend. Verified on production on 2026-10-23.
test.describe('API auth validation', { tag: ['@api', '@regression', '@production'] }, () => {
  test('MS-API-007 malformed login data returns field-level validation errors', async ({ request }) => {
    const response = await request.post(apiPath('/sys/kr/auth/login'), {
      data: { email: 'not-an-email', password: '', remember_me: true }
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
      success: false,
      data: { email: expect.any(Array), password: expect.any(Array) }
    });
    expect((await request.get(apiPath('/sys/kr/user/me'))).status()).toBe(401);
  });

  test('MS-API-008 invalid credentials return an explicit rejection without authenticating', async ({ request }) => {
    const response = await request.post(apiPath('/sys/kr/auth/login'), {
      data: { ...unregisteredLogin, remember_me: true }
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ success: false, data: { code: 'invalid_credentials' } });
    expect((await request.get(apiPath('/sys/kr/user/me'))).status()).toBe(401);
  });
});
