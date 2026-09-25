// Where the internal-origin key is allowed to go. The key is a WAF exemption issued for CI, and
// tests/fixtures/internal-origin.ts decides which requests carry it purely from isMustickerHost().
// A production page load also talks to 12 third-party hosts (Google, DoubleClick, Naver as of
// 2026-08-28), so that predicate is the only thing standing between a secret and an analytics
// vendor.
//
// It is asserted here rather than left to review because the failure is silent and the near-miss is
// easy: dropping the backslashes to `/(?:^|.)musticker.com$/` still passes every real hostname
// while also matching `foomusticker.com`, a domain anyone can register.
import { test, expect } from '@playwright/test';

import { internalOriginKeyVarFor } from '../../fixtures/env.js';
import { isMustickerHost } from '../../fixtures/hosts.js';

test.describe('internal-origin header scope', { tag: ['@security'] }, () => {
  test('MS-SEC-001 first-party musticker hosts are in scope', () => {
    for (const hostname of [
      'musticker.com',
      'www.musticker.com',
      'static.musticker.com',
      'api.musticker.com',
      'dev.musticker.com',
      'dev-3.musticker.com',
      'dev-static-1-api.musticker.com'
    ]) {
      expect(isMustickerHost(hostname), `${hostname} must receive the header`).toBe(true);
    }
  });

  test('MS-SEC-002 third-party and look-alike hosts are out of scope', () => {
    for (const hostname of [
      // Real third parties observed on a production product page.
      'www.google.com',
      'www.googletagmanager.com',
      'analytics.google.com',
      'ad.doubleclick.net',
      'googleads.g.doubleclick.net',
      'wcs.naver.com',
      'wcs.pstatic.net',
      'nam.veta.naver.com',
      // Look-alikes an unescaped dot would wrongly admit.
      'foomusticker.com',
      'notmusticker.com',
      'mustickerAcom',
      // Suffix attack: our domain as a prefix of someone else's.
      'musticker.com.evil.net'
    ]) {
      expect(isMustickerHost(hostname), `${hostname} must NOT receive the header`).toBe(false);
    }
  });

  // Production and the development-* servers have separate WAFs and separate keys. Sending the
  // production key to a dev host would put a production credential on a less-guarded server, and
  // the run would look completely normal while doing it -- so the mapping is pinned here.
  test('MS-SEC-003 each environment resolves to its own key', () => {
    expect(internalOriginKeyVarFor('production')).toBe('INTERNAL_ORIGIN_KEY');

    for (const environment of [
      'development-static',
      'development-static-2',
      'development-1',
      'development-2',
      'development-3',
      'development-4'
    ] as const) {
      expect(internalOriginKeyVarFor(environment), `${environment} must use the dev key`).toBe(
        'DEV_INTERNAL_ORIGIN_KEY'
      );
    }
  });

  test('MS-SEC-004 an unrecognised environment gets no key at all', () => {
    // undefined is what env.ts resolves a BASE_URL outside the registry to. Guessing production
    // there would be the dangerous guess, so the answer has to be "send nothing".
    expect(internalOriginKeyVarFor(undefined)).toBeUndefined();
  });
});
