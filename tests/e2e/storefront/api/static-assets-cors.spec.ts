import { test, expect, request } from '@playwright/test';

import { env } from '../../../fixtures/env.js';

const STATIC_HOST = 'https://static.musticker.com';

// Browsers fetch fonts in CORS mode, so a font served without Access-Control-Allow-Origin is
// blocked outright -- images and video are not, which is why only fonts are listed. These are the
// files the vinyl-lettering configurator loads (seen on dev-1, 2026-10-27).
const corsFonts = [
  '/fonts/lettering/NanumGothicBold.woff2',
  '/fonts/lettering/NanumGothicBold.woff',
  '/fonts/lettering/segoe-ui.ttf'
];

// CloudFront caches one object per Accept-Encoding variant, and each variant can be cached with or
// without CORS headers. Checking only one would miss the variant real browsers ask for.
const encodings = {
  identity: 'identity',
  gzip: 'gzip',
  browser: 'gzip, deflate, br, zstd'
} as const;

/**
 * The CDN half of what MS-CFG-024 checks in the browser, minus the browser: when this fails, the
 * cause is the CDN's CORS configuration, not the lettering page.
 */
test.describe('Static asset CORS', { tag: ['@api', '@smoke', '@production'] }, () => {
  for (const path of corsFonts) {
    for (const [variant, acceptEncoding] of Object.entries(encodings)) {
      // The woff2 browser variant was cached without CORS headers on 2026-10-27; fixed on the CDN by
      // 2026-10-30 (Access-Control-Allow-Origin: *), so every variant is expected to pass again.
      test(`MS-API-009 ${path} carries CORS headers for the storefront (${variant} encoding)`, async () => {
        const storefrontOrigin = new URL(env.BASE_URL).origin;
        const cdn = await request.newContext({
          extraHTTPHeaders: { origin: storefrontOrigin, 'accept-encoding': acceptEncoding }
        });

        try {
          const response = await cdn.get(`${STATIC_HOST}${path}`, { maxRedirects: 0 });

          expect(response.status(), `${path} status`).toBe(200);
          expect(
            [storefrontOrigin, '*'],
            `${path} must allow ${storefrontOrigin}, or the browser blocks the font`
          ).toContain(response.headers()['access-control-allow-origin']);
        } finally {
          await cdn.dispose();
        }
      });
    }
  }
});
