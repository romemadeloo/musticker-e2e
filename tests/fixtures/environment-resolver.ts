import { environments, isEnvironmentName } from './environments.js';
import type { EnvironmentName } from './environments.js';

type Inputs = Record<string, string | undefined>;
function url(value: string, label: string): URL {
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error(`${label} must be an HTTP(S) URL without credentials, query or fragment.`);
  }
  return parsed;
}
const normalize = (value: string) => value.replace(/\/+$/, '');
function tier(host: string): string | undefined {
  if (/^(?:www\.|api\.|admin-panel\.)?musticker\.com$/.test(host)) return 'production';
  const dev = host.match(/^shared-dev-static-(?:sf|api|admin)(?:-([2-6]))?\.musticker\.com$/);
  if (dev) return `dev-${dev[1] || '1'}`;
  if (['localhost', '127.0.0.1', '[::1]'].includes(host)) return 'local';
  return undefined;
}
export function resolveEnvironment(input: Inputs) {
  const requested = input.E2E_ENVIRONMENT?.trim();
  if (requested && !isEnvironmentName(requested)) throw new Error(`Unsupported E2E_ENVIRONMENT "${requested}".`);
  const named = requested ? environments[requested as EnvironmentName] : undefined;
  const suppliedBase = input.BASE_URL?.trim();
  if (!named && !suppliedBase) throw new Error('Set E2E_ENVIRONMENT or BASE_URL explicitly. There is no implicit production target.');
  const base = url(suppliedBase || named!.baseUrl, 'BASE_URL');
  // Ticket servers often use the origin; storefront helpers require the locale prefix.
  if (base.hostname.endsWith('.musticker.com') && base.pathname === '/') base.pathname = '/kr';
  const inferred = Object.entries(environments).find(([, config]) => normalize(config.baseUrl) === normalize(base.href))?.[0] as EnvironmentName | undefined;
  const selected = named || (inferred ? environments[inferred] : undefined);
  const api = input.API_BASE_URL?.trim() || selected?.apiBaseUrl;
  const admin = input.ADMIN_BASE_URL?.trim() || selected?.adminPanel;
  for (const [label, value, expected] of [
    ['BASE_URL', base.href, named?.baseUrl],
    ['API_BASE_URL', api, named?.apiBaseUrl],
    ['ADMIN_BASE_URL', admin, named?.adminPanel],
  ]) {
    if (!value) continue;
    const parsed = url(value, label!);
    if (expected && normalize(parsed.href) !== normalize(new URL(expected).href)) throw new Error(`${label} conflicts with E2E_ENVIRONMENT=${requested}.`);
    const baseTier = tier(base.hostname);
    const targetTier = tier(parsed.hostname);
    if ((baseTier || targetTier) && baseTier !== targetTier) throw new Error(`${label} targets a different environment from BASE_URL.`);
    if (!baseTier && parsed.hostname !== base.hostname) throw new Error(`${label} must use the same custom host as BASE_URL.`);
  }
  if (input.PROMOTION_VALIDATION === 'true' && tier(base.hostname) === 'production') throw new Error('Promotion validation requires dev servers.');
  return { baseURL: normalize(base.href), apiURL: api ? normalize(new URL(api).href) : undefined, adminURL: admin ? normalize(new URL(admin).href) : undefined, name: (requested || inferred) as EnvironmentName | undefined };
}
