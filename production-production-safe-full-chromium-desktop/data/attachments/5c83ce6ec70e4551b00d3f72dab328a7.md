# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/public-api.spec.ts >> storefront public API smoke >> MS-V2-037 inquiry types API returns selectable inquiry metadata
- Location: tests/e2e/api/public-api.spec.ts:17:3

# Error details

```
Error: 403 https://api.musticker.com/index.php/sys/kr/inquiry/types

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  1  | import { test, expect, type APIResponse } from '@playwright/test';
  2  | 
  3  | import { apiPath } from '../../fixtures/env.js';
  4  | 
  5  | type JsonRecord = Record<string, unknown>;
  6  | 
  7  | test.describe('storefront public API smoke', { tag: ['@api', '@smoke', '@production'] }, () => {
  8  |   test('MS-V2-036 navigation categories API returns public category data', async ({ request }) => {
  9  |     const payload = await expectJsonResponse(request.get(apiPath('/sys/kr/navigation/categories')));
  10 | 
  11 |     expect(hasObjectOrArrayPayload(payload), 'navigation categories payload should contain data').toBe(true);
  12 |     expect(JSON.stringify(payload), 'navigation categories should include known product category slugs').toMatch(
  13 |       /stickers|roll-stickers|sheet-stickers/
  14 |     );
  15 |   });
  16 | 
  17 |   test('MS-V2-037 inquiry types API returns selectable inquiry metadata', async ({ request }) => {
  18 |     const payload = await expectJsonResponse(request.get(apiPath('/sys/kr/inquiry/types')));
  19 | 
  20 |     expect(hasObjectOrArrayPayload(payload), 'inquiry types payload should contain data').toBe(true);
  21 |   });
  22 | 
  23 |   test('MS-V2-038 anonymous user session API rejects unauthenticated users safely', async ({ request }) => {
  24 |     const response = await request.get(apiPath('/sys/kr/user/me'));
  25 | 
  26 |     expect(response.status()).toBe(401);
  27 |     expect(await safeResponseText(response), 'anonymous user/me response should not expose a server error').not.toMatch(
  28 |       /stack|trace|exception|sql/i
  29 |     );
  30 |   });
  31 | });
  32 | 
  33 | async function expectJsonResponse(responsePromise: Promise<APIResponse>): Promise<unknown> {
  34 |   const response = await responsePromise;
  35 | 
> 36 |   expect(response.ok(), `${response.status()} ${response.url()}`).toBe(true);
     |                                                                   ^ Error: 403 https://api.musticker.com/index.php/sys/kr/inquiry/types
  37 |   expect(response.headers()['content-type'] ?? '', `${response.url()} should return JSON`).toContain('application/json');
  38 | 
  39 |   return response.json();
  40 | }
  41 | 
  42 | function hasObjectOrArrayPayload(payload: unknown): boolean {
  43 |   if (Array.isArray(payload)) {
  44 |     return payload.length > 0;
  45 |   }
  46 | 
  47 |   if (!isJsonRecord(payload)) {
  48 |     return false;
  49 |   }
  50 | 
  51 |   return Object.keys(payload).length > 0;
  52 | }
  53 | 
  54 | function isJsonRecord(value: unknown): value is JsonRecord {
  55 |   return typeof value === 'object' && value !== null && !Array.isArray(value);
  56 | }
  57 | 
  58 | async function safeResponseText(response: APIResponse): Promise<string> {
  59 |   return response.text().catch(() => '');
  60 | }
  61 | 
```