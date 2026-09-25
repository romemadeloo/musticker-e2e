import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { request } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

import { apiPath, env, internalOriginKey } from './env.js';
import { INTERNAL_ORIGIN_HEADER } from './internal-origin.js';

export type MemberStorageState = Awaited<ReturnType<APIRequestContext['storageState']>>;

/**
 * Where the seeded member session is parked. `.auth/` is gitignored -- this file holds a live
 * session cookie and must never be committed. It exists for debugging (and so a failed run leaves
 * something inspectable behind); tests read the state through the `asMember` fixture option, not
 * from this path, so a grep-filtered run that never seeds it still behaves correctly.
 */
export const MEMBER_STORAGE_STATE_PATH = fileURLToPath(new URL('../../.auth/member.json', import.meta.url));

export const SKIP_WITHOUT_MEMBER_CREDENTIALS = 'Set AUTH_TEST_EMAIL and AUTH_TEST_PASSWORD to run.';

export function hasMemberCredentials(): boolean {
  return Boolean(env.AUTH_TEST_EMAIL && env.AUTH_TEST_PASSWORD);
}

/**
 * Authenticates the seeded member against the API and returns a storage state a browser context can
 * be built from, rather than driving the login form.
 *
 * The form route costs ~15s per test and depends on Nuxt hydration landing before the submit (see
 * tests/fixtures/hydration.ts), which made login a single point of failure for every test that
 * merely needed to *be* logged in. `POST /sys/kr/auth/login` answers in well under a second and
 * sets one `*_customer_token` cookie scoped to `.musticker.com`, so the same state works on the
 * storefront host. Verified against development-1 on 2026-08-27.
 *
 * Tests that exercise logging in itself (MS-V2-034, MS-V2-035, MS-V2-094) still go through the UI
 * -- that is the behaviour under test there.
 */
export async function seedMemberStorageState(): Promise<MemberStorageState> {
  if (!hasMemberCredentials()) {
    throw new Error('seedMemberStorageState() called without AUTH_TEST_EMAIL/AUTH_TEST_PASSWORD.');
  }

  const storefrontOrigin = new URL(env.BASE_URL).origin;
  const originKey = internalOriginKey();
  const api = await request.newContext({
    // Safe to set context-wide here, unlike on a browser context: this context only ever talks
    // to the musticker API, so the key cannot reach a third-party host.
    extraHTTPHeaders: {
      ...(originKey ? { [INTERNAL_ORIGIN_HEADER]: originKey } : {}),
      origin: storefrontOrigin,
      referer: `${env.BASE_URL.replace(/\/$/, '')}/auth/login`
    }
  });

  try {
    const loginUrl = apiPath('/sys/kr/auth/login');
    const response = await api.post(loginUrl, {
      data: {
        email: env.AUTH_TEST_EMAIL,
        password: env.AUTH_TEST_PASSWORD,
        // Rejected as a required field if omitted, and `true` is what the form sends when the
        // shopper leaves 로그인 상태 유지 ticked -- which is what keeps the cookie usable for a run.
        remember_me: true
      }
    });

    // The endpoint reports a refused login as HTTP 200 with `success: false` (the same trap
    // documented in tests/fixtures/pricing/README.md), so the status alone proves nothing.
    const body = (await response.json()) as { success?: boolean; message?: string };

    if (response.status() !== 200 || body.success !== true) {
      throw new Error(
        [
          `Could not authenticate AUTH_TEST_EMAIL against ${loginUrl}.`,
          `HTTP ${response.status()}, success=${String(body.success)}, message=${body.message ?? '(none)'}.`,
          'Check the credentials belong to the environment under test -- each static-* server',
          'has its own user database, so a production account will not log in on a dev host.'
        ].join('\n')
      );
    }

    mkdirSync(dirname(MEMBER_STORAGE_STATE_PATH), { recursive: true });
    const state = await api.storageState({ path: MEMBER_STORAGE_STATE_PATH });

    if (!state.cookies.length) {
      throw new Error(
        `Login to ${loginUrl} reported success but set no cookies, so there is no session to reuse.`
      );
    }

    return state;
  } finally {
    await api.dispose();
  }
}
