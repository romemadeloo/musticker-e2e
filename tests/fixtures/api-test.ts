import { test as base, expect, request } from '@playwright/test';
import { env, internalOriginKey } from './env.js';
import { INTERNAL_ORIGIN_HEADER } from './internal-origin.js';

// API checks never need a browser or UI login. A fresh context also keeps authorization tests
// anonymous even if an earlier test changes cookies in its own context.
export const test = base.extend({
  request: async ({}, use) => {
    const key = internalOriginKey();
    const api = await request.newContext({
      baseURL: env.API_BASE_URL,
      extraHTTPHeaders: {
        accept: 'application/json',
        origin: new URL(env.BASE_URL).origin,
        ...(key ? { [INTERNAL_ORIGIN_HEADER]: key } : {})
      }
    });
    try {
      await use(api);
    } finally {
      await api.dispose();
    }
  }
});

export { expect };
