import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import type { APIRequestContext } from '@playwright/test';

import { activeEnvironment, adminBaseUrl, apiPath } from './env.js';

/**
 * Admin sessions are captured once by a human (`npm run admin:login`) and reused, never created by
 * a test run. Two properties of the admin panel force that:
 *
 * - Login needs a verification code emailed to sales@musticker.com, a shared company inbox the
 *   suite has no access to -- unlike the storefront OTP, there is no mail.tm inbox to poll.
 * - One account allows one active session. A fresh login shows "Active Session Detected" and
 *   "Logout & Continue" signs out every other device -- so a suite that logged in per run would keep
 *   signing the QA engineer out of their own browser, and vice versa.
 *
 * With "Keep me signed in" ticked the session lasts about a week (per the site owner, 2026-09-25).
 * Signing in to the same environment's panel elsewhere ends the saved session; rerun admin:login.
 *
 * The state is per environment because each server keeps its own sessions. `.auth/` is gitignored --
 * these files hold a live admin session and must never be committed.
 */
export function adminStorageStatePath(environment = activeEnvironment): string {
  return fileURLToPath(new URL(`../../.auth/admin-${environment ?? 'unknown'}.json`, import.meta.url));
}

export function hasAdminSession(): boolean {
  return existsSync(adminStorageStatePath());
}

export const SKIP_WITHOUT_ADMIN_SESSION =
  'No saved admin session for this environment. Run `npm run admin:login` (with the same E2E_ENVIRONMENT) ' +
  'and enter the verification code sent to sales@musticker.com.';

/**
 * Whether the saved session is still accepted, asked of the API rather than inferred from the file's
 * age: a session ends early whenever someone signs in to the same panel elsewhere.
 *
 * `request` must be the admin browser context's request, so it carries that context's cookies.
 */
export async function isAdminSessionValid(request: APIRequestContext): Promise<boolean> {
  const origin = adminBaseUrl();
  const response = await request.get(apiPath('/sys/kr/auth/admin/me'), {
    headers: origin ? { origin, referer: `${origin}/` } : {}
  });

  if (!response.ok()) {
    return false;
  }

  // Like the storefront login, the API can answer 200 with `success: false`.
  const body = (await response.json().catch(() => ({}))) as { success?: boolean };

  return body.success === true;
}

export const SKIP_EXPIRED_ADMIN_SESSION =
  'The saved admin session was rejected by /auth/admin/me -- it expired, or someone signed in to this ' +
  'admin panel elsewhere (one session per account). Rerun `npm run admin:login`.';
