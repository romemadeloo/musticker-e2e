import { environments, isEnvironmentName } from './environments.js';
import type { EnvironmentConfig, EnvironmentName } from './environments.js';

const selectedEnvironment = resolveSelectedEnvironment();

export const env = {
  BASE_URL: process.env.BASE_URL ?? selectedEnvironment?.baseUrl ?? 'https://www.musticker.com/kr',
  API_BASE_URL: process.env.API_BASE_URL ?? selectedEnvironment?.apiBaseUrl,
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

// Which named environment this run is pointed at, for fixtures that hold per-environment data (the
// pricing registry, whose table ids differ per server). E2E_ENVIRONMENT is authoritative when set;
// otherwise BASE_URL is matched back against the registry, because the production-facing scripts
// (test:prod:*, test:regression, and the full-suite workflow) set BASE_URL instead.
//
// Undefined means "pointed somewhere not in the registry" -- an ad-hoc BASE_URL, say. Callers must
// treat that as unknown rather than assuming production: env-specific expectations cannot be
// asserted against a server we have no recorded data for.
export const activeEnvironment: EnvironmentName | undefined = resolveActiveEnvironmentName();

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
  const override = process.env.ADMIN_BASE_URL?.trim();

  if (override) {
    return override.replace(/\/+$/, '');
  }

  if (!activeEnvironment) {
    return undefined;
  }

  const environment: EnvironmentConfig = environments[activeEnvironment];

  return environment.adminPanel;
}

export function appPath(relativePath = ''): string {
  const base = new URL(env.BASE_URL);
  const basePath = base.pathname.replace(/\/$/, '');
  const cleanPath = relativePath.replace(/^\.\//, '').replace(/^\//, '');

  return cleanPath ? `${basePath}/${cleanPath}` : basePath;
}

export function apiPath(relativePath: string): string {
  const base = new URL(env.API_BASE_URL ?? defaultApiBaseUrl());
  const cleanPath = relativePath.replace(/^\.\//, '').replace(/^\//, '');
  const basePath = base.pathname.replace(/\/$/, '');

  return `${base.origin}${basePath}/${cleanPath}`;
}

function defaultApiBaseUrl(): string {
  const base = new URL(env.BASE_URL);
  const apiHost = base.hostname.startsWith('dev.') ? 'dev-api.musticker.com' : 'api.musticker.com';

  return `${base.protocol}//${apiHost}/index.php`;
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '').toLowerCase();
}

function resolveActiveEnvironmentName(): EnvironmentName | undefined {
  const requested = process.env.E2E_ENVIRONMENT;
  if (requested) {
    // Already validated by resolveSelectedEnvironment(), which throws on an unknown name.
    return requested as EnvironmentName;
  }

  const target = normalizeBaseUrl(env.BASE_URL);
  const names = Object.keys(environments) as EnvironmentName[];

  return names.find((name) => normalizeBaseUrl(environments[name].baseUrl) === target);
}

function resolveSelectedEnvironment(): EnvironmentConfig | undefined {
  const requested = process.env.E2E_ENVIRONMENT;
  if (!requested) {
    return undefined;
  }

  if (!isEnvironmentName(requested)) {
    throw new Error(
      `Unsupported E2E_ENVIRONMENT "${requested}". Use one of: ${Object.keys(environments).join(', ')}.`
    );
  }

  return environments[requested];
}
