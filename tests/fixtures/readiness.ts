import type { APIRequestContext } from '@playwright/test';

export type ReadinessTarget = {
  name: 'storefront' | 'api';
  url: string;
  expectedBuild?: string;
  buildHeader?: string;
};

export type ReadinessResult = {
  target: string;
  status: 'ready' | 'blocked';
  httpStatus?: number;
  build: 'verified' | 'unverified' | 'mismatch';
  durationMs: number;
  reason?: string;
};

// Never follow redirects: the internal-origin header must remain on the selected host.
// Store only classifications, never response bodies, request headers, or supplied secrets.
export async function checkReadiness(
  client: APIRequestContext, target: ReadinessTarget, timeoutMs = 15_000
): Promise<ReadinessResult> {
  const start = Date.now();
  const result: ReadinessResult = {
    target: target.name, status: 'blocked', build: 'unverified', durationMs: 0
  };
  try {
    const response = await client.get(target.url, { timeout: timeoutMs, maxRedirects: 0 });
    result.httpStatus = response.status();
    if (!response.ok()) throw new Error('HTTP readiness check failed');
    const contentType = response.headers()['content-type'] || '';
    if (target.name === 'storefront') {
      if (!contentType.includes('text/html') || !/<html[\s>]/i.test(await response.text())) {
        throw new Error('Expected a storefront HTML document');
      }
    } else {
      if (!contentType.includes('application/json')) throw new Error('Expected API JSON');
      const body = await response.json();
      if (body?.success !== true || !Array.isArray(body.data) || body.data.length === 0) {
        throw new Error('Expected successful nonempty navigation data');
      }
    }
    if (target.expectedBuild) {
      const actual = response.headers()[(target.buildHeader || 'x-build-sha').toLowerCase()];
      if (actual !== target.expectedBuild) {
        result.build = 'mismatch';
        throw new Error('Build identity missing or different from the expected build');
      }
      result.build = 'verified';
    }
    result.status = 'ready';
  } catch (error) {
    // Network exceptions can include URLs/headers. Only expose our fixed messages.
    const known = [
      'HTTP readiness check failed', 'Expected a storefront HTML document', 'Expected API JSON',
      'Expected successful nonempty navigation data', 'Build identity missing or different from the expected build'
    ];
    result.reason = error instanceof Error && known.includes(error.message)
      ? error.message : 'Request failed, timed out, or returned invalid JSON';
  }
  result.durationMs = Date.now() - start;
  return result;
}
