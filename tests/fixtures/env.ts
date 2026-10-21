import { resolveEnvironment } from './environment-resolver.js';
import type { EnvironmentName } from './environments.js';

const resolved = resolveEnvironment(process.env);

export const env = {
  BASE_URL: resolved.baseURL,
  API_BASE_URL: resolved.apiURL,
  AUTH_TEST_EMAIL: process.env.AUTH_TEST_EMAIL,
  AUTH_TEST_PASSWORD: process.env.AUTH_TEST_PASSWORD,
  // WAF exemption keys issued by the site owner -- production and the static-* dev servers
  // sit behind separate WAFs with separate keys. Read these through internalOriginKey() rather than
  // directly; see the note there. Sent as the x-internal-origin header on first-party requests
  // only -- tests/fixtures/internal-origin.ts.
  // Trimmed because these arrive by copy-paste into a secrets UI, where a trailing newline or
  // space is easy to include and impossible to see. An HTTP header value carries that whitespace
  // verbatim, so an otherwise-correct key gets refused and looks exactly like a wrong one.
  INTERNAL_ORIGIN_KEY: process.env.INTERNAL_ORIGIN_KEY?.trim(),
  DEV_INTERNAL_ORIGIN_KEY: process.env.DEV_INTERNAL_ORIGIN_KEY?.trim()
};

// Validated environment identity. Conflicting URL overrides are rejected before any
// browser/API fixture is created; unknown explicit targets remain unregistered.
export const activeEnvironment: EnvironmentName | undefined = resolved.name;

/**
 * Which of the two internal-origin keys belongs to a given environment, by variable name.
 *
 * Split out as a pure function because it is the part that can quietly be wrong: handing the
 * production key to a dev server would put a production credential on a less-guarded host, and
 * nothing about the resulting run would look unusual. tests/e2e/storefront/security/ asserts this mapping.
 *
 * Undefined means "send no key" -- the honest answer for an unrecognised BASE_URL, where guessing
 * production would be the dangerous guess.
 */
export function internalOriginKeyVarFor(
  environment: EnvironmentName | undefined
): 'INTERNAL_ORIGIN_KEY' | 'DEV_INTERNAL_ORIGIN_KEY' | undefined {
  if (environment === 'production') {
    return 'INTERNAL_ORIGIN_KEY';
  }

  return environment?.startsWith('static-') ? 'DEV_INTERNAL_ORIGIN_KEY' : undefined;
}

/**
 * The internal-origin key for the environment this run is pointed at, or undefined when there is
 * none to send.
 *
 * Resolved here rather than by a ternary in each workflow, which is how the AUTH_TEST and
 * DEV_AUTH_TEST secrets are selected, so that which key goes to which host is decided in one place
 * that is tested. A stale production key sitting in a local .env therefore cannot reach a dev
 * server.
 *
 * Runs that resolve to no key fall back to the 403 retry ladder in navigation.ts, exactly as they
 * did before any key existed.
 */
export function internalOriginKey(): string | undefined {
  const variable = internalOriginKeyVarFor(activeEnvironment);

  return variable ? env[variable] : undefined;
}

/**
 * The admin panel origin for this run, or undefined when the environment has none.
 *
 * ADMIN_BASE_URL overrides, the same way BASE_URL does for the storefront. Undefined is the signal
 * for admin specs to skip -- there is deliberately no fallback guess, because the obvious guess is
 * production's panel.
 */
export function adminBaseUrl(): string | undefined {
  return resolved.adminURL;
}

export function appPath(relativePath = ''): string {
  const base = new URL(env.BASE_URL);
  const basePath = base.pathname.replace(/\/$/, '');
  const cleanPath = relativePath.replace(/^\.\//, '').replace(/^\//, '');

  return cleanPath ? `${basePath}/${cleanPath}` : basePath;
}

export function apiPath(relativePath: string): string {
  if (!env.API_BASE_URL) throw new Error('Set API_BASE_URL explicitly for this unregistered environment.');
  const base = new URL(env.API_BASE_URL);
  const cleanPath = relativePath.replace(/^\.\//, '').replace(/^\//, '');
  const basePath = base.pathname.replace(/\/$/, '');

  return `${base.origin}${basePath}/${cleanPath}`;
}
