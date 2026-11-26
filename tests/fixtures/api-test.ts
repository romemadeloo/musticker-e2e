import { test as base, expect, request } from '@playwright/test';
import { env, internalOriginHeader, internalOriginKey } from './env.js';

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
        ...(key ? { [internalOriginHeader()]: key } : {})
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
