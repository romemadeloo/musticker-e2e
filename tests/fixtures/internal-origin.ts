import type { Page } from '@playwright/test';

import { internalOriginHeader, internalOriginKey } from './env.js';
import { isMustickerHost } from './hosts.js';

/**
 * Sends the WAF exemption key on every musticker.com request the browser makes.
 *
 * The storefront sits behind a WAF that rate-limits our CI egress IP under full-suite load, which
 * surfaces as bare 403s on documents and on their subresources (see navigation.ts). This header is
 * the exemption the site owner issued for CI; the retry ladder in navigation.ts stays as the safety
 * net for runs without it.
 *
 * Applied per-route rather than through `extraHTTPHeaders` because that option is context-wide, and
 * a production page load also talks to Google, DoubleClick and Naver -- 12 third-party hosts as of
 * 2026-08-28. The key must never be sent to any of them, so only musticker.com origins are
 * intercepted and every other request is left untouched.
 *
 * A no-op when the key is unset, which is the default locally and for dev-environment runs.
 */
export async function applyInternalOriginHeader(page: Page): Promise<void> {
  const key = internalOriginKey();
  const header = internalOriginHeader();

  if (!key) {
    return;
  }

  // Context-scoped rather than page-scoped: the KakaoPay flow opens a popup, and that page needs
  // the header too.
  await page.context().route(
    (url) => isMustickerHost(url.hostname),
    async (route) => {
      // allHeaders() rather than headers(): continue() replaces the header set outright, so an
      // incomplete copy would silently drop headers the browser had already put on the request.
      const headers = await route.request().allHeaders();

      await route.continue({ headers: { ...headers, [header]: key } });
    }
  );
}
