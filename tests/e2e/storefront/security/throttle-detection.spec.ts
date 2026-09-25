// The WAF-throttle detection in tests/fixtures/navigation.ts, exercised hermetically.
//
// Every request is fulfilled from inside the test, so this touches no server and is deterministic.
// It exists because the logic it covers is invisible when broken: a subresource block that goes
// undetected does not error, it just lets the caller fail later on missing content, which is
// exactly how three production incidents were misread as product bugs before the detection existed.
//
// Uses the plain Playwright fixture rather than the project's guarded `test`: the guard asserts on
// unexpected 403s, and manufacturing 403s is the whole point here.
import { test, expect } from '@playwright/test';

import { appPath } from '../../fixtures/env.js';
import { gotoStorefront, throttleRetryAttempts } from '../../fixtures/navigation.js';

// The shell the WAF lets through: a 200 document whose assets are then refused.
const shellHtml = `<!doctype html>
<html lang="ko"><head>
<link rel="stylesheet" href="/_nuxt/a.css">
<script src="/_nuxt/a.js"></script>
<script src="/_nuxt/b.js"></script>
<script src="/_nuxt/c.js"></script>
</head><body><div id="__nuxt"></div></body></html>`;

test.describe('WAF throttle detection', { tag: ['@security'] }, () => {
  test('MS-WAF-001 a subresource 403 storm is reported as throttling, not as missing content', async ({ page }) => {
    let documentRequests = 0;

    await page.route('**/*', async (route) => {
      if (route.request().resourceType() === 'document') {
        documentRequests += 1;
        await route.fulfill({ status: 200, contentType: 'text/html', body: shellHtml });
        return;
      }

      await route.fulfill({ status: 403, contentType: 'text/plain', body: 'Forbidden' });
    });

    await expect(gotoStorefront(page, appPath('./stickers/die-cut-sticker'))).rejects.toThrow(
      /assets were refused/
    );

    // The point of detecting it at all: the navigation is retried rather than handed back as a
    // healthy 200. This walks the full ladder, so it also sleeps every rung -- ~54s of the 60s
    // per-test timeout, and it only fits because waitOutBlock hands the slept time back to the
    // deadline. Verified by running it with `--timeout=20000`, which still passes; drop the
    // extension and it fails at 20s. Asserted against the ladder's own length so widening it stays
    // a one-line change in navigation.ts.
    expect(documentRequests, 'a subresource block must be retried, not accepted as a 200').toBe(
      throttleRetryAttempts
    );
  });

  test('MS-WAF-002 a clean page is returned untouched', async ({ page }) => {
    let documentRequests = 0;

    await page.route('**/*', async (route) => {
      if (route.request().resourceType() === 'document') {
        documentRequests += 1;
        await route.fulfill({ status: 200, contentType: 'text/html', body: shellHtml });
        return;
      }

      await route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
    });

    const response = await gotoStorefront(page, appPath('./stickers/die-cut-sticker'));

    expect(response?.status()).toBe(200);
    expect(documentRequests, 'a healthy page must not be retried').toBe(1);
  });

  test('MS-WAF-003 one refused asset is left alone, not relabelled as throttling', async ({ page }) => {
    // Below subresourceBlockThreshold. A single 403 asset is a real finding and must reach the
    // caller (and the guard) as itself rather than being swallowed by a retry ladder.
    let documentRequests = 0;

    await page.route('**/*', async (route) => {
      if (route.request().resourceType() === 'document') {
        documentRequests += 1;
        await route.fulfill({ status: 200, contentType: 'text/html', body: shellHtml });
        return;
      }

      const isTheOneBadAsset = route.request().url().endsWith('/a.css');

      await route.fulfill({
        status: isTheOneBadAsset ? 403 : 200,
        contentType: 'text/plain',
        body: isTheOneBadAsset ? 'Forbidden' : ''
      });
    });

    const response = await gotoStorefront(page, appPath('./stickers/die-cut-sticker'));

    expect(response?.status()).toBe(200);
    expect(documentRequests, 'a single refused asset must not trigger the retry ladder').toBe(1);
  });
});
