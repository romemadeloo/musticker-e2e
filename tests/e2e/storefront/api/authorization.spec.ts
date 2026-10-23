import { test, expect } from '../../../fixtures/api-test.js';
import { apiPath } from '../../../fixtures/env.js';

const protectedResources = [
  { id: 'MS-API-004', name: 'profile overview', path: '/sys/kr/profile/overview' },
  { id: 'MS-API-005', name: 'saved addresses', path: '/sys/kr/user-address' },
  { id: 'MS-API-006', name: 'points balance', path: '/sys/kr/user-point/points' }
] as const;

test.describe('API authorization', { tag: ['@api', '@regression', '@production'] }, () => {
  for (const resource of protectedResources) {
    test(`${resource.id} anonymous requests cannot read ${resource.name}`, async ({ request }) => {
      const response = await request.get(apiPath(resource.path));
      expect(response.status()).toBe(401);
      expect(response.headers()['content-type']).toContain('application/json');
      const body = await response.json();
      expect(body).toMatchObject({ success: false, data: null, message: expect.any(String) });
      expect(body.message.length).toBeGreaterThan(0);
      expect(JSON.stringify(body)).not.toMatch(/SQLSTATE|stack trace|<html/i);
    });
  }
});
