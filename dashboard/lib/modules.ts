import { passRate } from './format';

// Workbook Areas by case-ID prefix, in workbook order (docs/CONVENTIONS.md). A module the table
// does not know (a folder fallback, or a new prefix) is listed after these under its own name.
export const MODULES: { code: string; label: string; folder?: string }[] = [
  { code: 'NAV', label: 'Smoke & core navigation', folder: 'navigation' },
  { code: 'DSC', label: 'Discovery & content', folder: 'discovery' },
  { code: 'CFG', label: 'Product configuration', folder: 'configuration' },
  { code: 'SHT', label: 'Sheet sticker size rules', folder: 'sheet-size-rules' },
  { code: 'CRT', label: 'Cart', folder: 'cart' },
  { code: 'CHK', label: 'Checkout & money path', folder: 'checkout' },
  { code: 'AUTH', label: 'Sign-in & registration', folder: 'auth' },
  { code: 'ACC', label: 'Account & order history', folder: 'account' },
  { code: 'INQ', label: 'Inquiry & validation', folder: 'inquiry' },
  { code: 'API', label: 'Public API', folder: 'api' },
  { code: 'UX', label: 'Accessibility & errors', folder: 'ux' },
  { code: 'SEC', label: 'Suite safety & resilience', folder: 'security' },
  { code: 'WAF', label: 'Suite safety (WAF)' },
  { code: 'ADMO', label: 'Admin — order processing', folder: 'orders' },
  { code: 'ADMA', label: 'Admin — access & orders', folder: 'access' },
  { code: 'ADM', label: 'Admin (legacy IDs)' }
];

export type ModuleStatRow = {
  module: string;
  tests: number;
  results: number;
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
  avg_duration_ms: number | null;
  last_run_at: string | null;
};

export type ModuleStat = ModuleStatRow & {
  code: string;
  label: string;
  rate: number | null;
  // Links to the cases in this module.
  href: string;
};

// Folds folder fallbacks into their module (storefront/cart → CRT) and orders like the workbook.
export function toModuleStats(rows: ModuleStatRow[]): ModuleStat[] {
  const merged = new Map<string, ModuleStatRow>();
  for (const raw of rows) {
    const known = MODULES.find((m) => m.code === raw.module || m.folder === raw.module);
    const code = known?.code ?? raw.module;
    const row = merged.get(code) ?? { ...raw, module: code, tests: 0, results: 0, passed: 0, failed: 0, flaky: 0, skipped: 0, avg_duration_ms: null, last_run_at: null };
    const executed = Number(raw.results) - Number(raw.skipped);
    const prevExecuted = row.results - row.skipped;
    if (raw.avg_duration_ms != null && executed > 0) {
      row.avg_duration_ms = Math.round(((row.avg_duration_ms ?? 0) * prevExecuted + raw.avg_duration_ms * executed) / (prevExecuted + executed));
    }
    row.tests += Number(raw.tests);
    row.results += Number(raw.results);
    row.passed += Number(raw.passed);
    row.failed += Number(raw.failed);
    row.flaky += Number(raw.flaky);
    row.skipped += Number(raw.skipped);
    row.last_run_at = [row.last_run_at, raw.last_run_at].filter(Boolean).sort().at(-1) ?? null;
    merged.set(code, row);
  }

  const order = (code: string) => {
    const i = MODULES.findIndex((m) => m.code === code);
    return i === -1 ? MODULES.length : i;
  };

  return [...merged.values()]
    .map((r) => {
      const known = MODULES.find((m) => m.code === r.module);
      return {
        ...r,
        code: r.module,
        label: known?.label ?? r.module,
        rate: passRate(r.passed, r.passed + r.failed + r.flaky),
        href: known ? `/cases?q=${encodeURIComponent(`MS-${r.module}-`)}` : `/suites?q=${encodeURIComponent(r.module)}`
      };
    })
    .sort((a, b) => order(a.code) - order(b.code) || a.code.localeCompare(b.code));
}

// Health band for a pass rate. Shown with the number and an icon, never by color alone.
export function rateTone(rate: number | null): 'good' | 'warning' | 'critical' | 'neutral' {
  if (rate == null) return 'neutral';
  if (rate >= 95) return 'good';
  if (rate >= 80) return 'warning';
  return 'critical';
}
