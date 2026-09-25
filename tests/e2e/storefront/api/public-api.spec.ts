import { test, expect, type APIResponse } from '@playwright/test';

import { apiPath } from '../../fixtures/env.js';

type JsonRecord = Record<string, unknown>;

test.describe('storefront public API smoke', { tag: ['@api', '@smoke', '@production'] }, () => {
  test('MS-V2-036 navigation categories API returns public category data', async ({ request }) => {
    const payload = await expectJsonResponse(request.get(apiPath('/sys/kr/navigation/categories')));

    expect(hasObjectOrArrayPayload(payload), 'navigation categories payload should contain data').toBe(true);
    expect(JSON.stringify(payload), 'navigation categories should include known product category slugs').toMatch(
      /stickers|roll-stickers|sheet-stickers/
    );
  });

  test('MS-V2-037 inquiry types API returns selectable inquiry metadata', async ({ request }) => {
    const payload = await expectJsonResponse(request.get(apiPath('/sys/kr/inquiry/types')));

    expect(hasObjectOrArrayPayload(payload), 'inquiry types payload should contain data').toBe(true);
  });

  test('MS-V2-038 anonymous user session API rejects unauthenticated users safely', async ({ request }) => {
    const response = await request.get(apiPath('/sys/kr/user/me'));

    expect(response.status()).toBe(401);
    expect(await safeResponseText(response), 'anonymous user/me response should not expose a server error').not.toMatch(
      /stack|trace|exception|sql/i
    );
  });
});

async function expectJsonResponse(responsePromise: Promise<APIResponse>): Promise<unknown> {
  const response = await responsePromise;

  expect(response.ok(), `${response.status()} ${response.url()}`).toBe(true);
  expect(response.headers()['content-type'] ?? '', `${response.url()} should return JSON`).toContain('application/json');

  return response.json();
}

function hasObjectOrArrayPayload(payload: unknown): boolean {
  if (Array.isArray(payload)) {
    return payload.length > 0;
  }

  if (!isJsonRecord(payload)) {
    return false;
  }

  return Object.keys(payload).length > 0;
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function safeResponseText(response: APIResponse): Promise<string> {
  return response.text().catch(() => '');
}
