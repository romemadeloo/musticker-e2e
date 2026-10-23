import { environments } from './environments.js';

// Host patterns shared by the response/console guard (e2e-test.ts) and the navigation retry
// (navigation.ts). Kept in one place so the dev-environment naming scheme cannot drift between
// them -- environments.ts is the source of truth for the hosts these must cover.

// Build role-specific host patterns from the registry, including production and all shared devs.
const escapeHost = (value: string) => new URL(value).hostname.replace(/\./g, '\\.');
export const DEV_API_HOST = `(?:${Object.values(environments).map(({ apiBaseUrl }) => escapeHost(apiBaseUrl)).join('|')})`;
export const DEV_STOREFRONT_HOST = `(?:${Object.values(environments).map(({ baseUrl }) => escapeHost(baseUrl)).join('|')})`;

// Any musticker.com origin at all -- storefront, static asset host, and API, on every environment.
// Deliberately broader than the two patterns above: it scopes the internal-origin header
// (internal-origin.ts) to first-party traffic, so the decision about where a secret may be sent
// cannot drift out of step with a newly added subdomain.
//
// The dots are escaped deliberately. An unescaped `.` here would be a wildcard, and `foomusticker`
// `.com` -- a domain anyone can register -- would match and be sent the key.
export function isMustickerHost(hostname: string): boolean {
  return /(?:^|\.)musticker\.com$/i.test(hostname);
}
