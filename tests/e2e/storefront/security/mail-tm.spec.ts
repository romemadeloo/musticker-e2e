// The mail.tm inbox generator in tests/fixtures/mail-tm.ts, which registration, password rotation and
// guest checkout all depend on to receive their OTP.
//
// MS-SEC-005 talks to the live API on purpose: mail.tm is a free, no-SLA service, and when it changes
// its contract (domains, account creation, token auth) every OTP-gated test fails at once with an error
// that reads like a storefront bug. This case fails first, and names the dependency. The OTP cases are
// pure logic and touch no network.
//
// Uses the plain Playwright fixture: nothing here talks to the storefront, and the project's API
// fixture would attach storefront headers (the internal-origin key among them) to a third-party host.
import { test, expect } from '@playwright/test';

import { createMailTmAccount, extractOtpCode, waitForMailTmMessage } from '../../../fixtures/mail-tm.js';

const MAIL_TM_BASE_URL = 'https://api.mail.tm';

test.describe('mail.tm inbox generator', { tag: ['@security'] }, () => {
  test('MS-SEC-005 a generated inbox is a unique, empty mailbox its own token can read', async ({ request }) => {
    const domains = await request.get(`${MAIL_TM_BASE_URL}/domains`);
    expect(domains.ok(), 'mail.tm /domains must answer').toBe(true);
    const activeDomains = ((await domains.json())['hydra:member'] as Array<{ domain: string; isActive: boolean }>)
      .filter((domain) => domain.isActive)
      .map((domain) => domain.domain);

    const account = await createMailTmAccount();
    const auth = { Authorization: `Bearer ${account.token}` };

    try {
      expect(account.address).toMatch(/^musticker-e2e-\d+-[a-z0-9]+@/);
      expect(activeDomains, 'the inbox must sit on a domain mail.tm lists as active').toContain(
        account.address.split('@')[1]
      );

      const me = await request.get(`${MAIL_TM_BASE_URL}/me`, { headers: auth });
      expect(me.ok(), 'the token must authorize the account it was issued for').toBe(true);
      expect((await me.json()).address).toBe(account.address);

      const messages = await request.get(`${MAIL_TM_BASE_URL}/messages`, { headers: auth });
      expect((await messages.json())['hydra:member']).toEqual([]);

      // An empty inbox must time out with the fixture's own message, not hang or return a stray mail.
      await expect(waitForMailTmMessage(account, () => true, 1_000)).rejects.toThrow(/Timed out after 1000ms/);
    } finally {
      // The fixture never deletes its inboxes; this one is removed so the check leaves nothing behind.
      const me = await request.get(`${MAIL_TM_BASE_URL}/me`, { headers: auth });
      if (me.ok()) {
        await request.delete(`${MAIL_TM_BASE_URL}/accounts/${(await me.json()).id}`, { headers: auth });
      }
    }
  });

  test('MS-SEC-006 the OTP is read past the copyright year, wherever the year appears', () => {
    const message = { id: 'm1', subject: '인증 요청', text: '© Copyright 2026 Musticker. 인증번호: 4821' };

    expect(extractOtpCode(message)).toBe('4821');
  });

  test('MS-SEC-007 a message with only a copyright year has no OTP and says so', () => {
    const message = { id: 'm2', subject: '주문 안내', text: '© Copyright 2026 Musticker.' };

    expect(() => extractOtpCode(message)).toThrow(/Could not find an OTP code in mail.tm message "주문 안내"/);
  });
});
