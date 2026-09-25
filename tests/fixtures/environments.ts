// Named storefront/API pairs for musticker's production and development/staging servers.
// Branch names match these keys 1:1 (see .github/workflows/smoke.yml), so CI can select an
// environment with E2E_ENVIRONMENT=${{ github.ref_name }} instead of per-branch conditionals.
export const environments = {
  production: {
    baseUrl: 'https://www.musticker.com/kr',
    apiBaseUrl: 'https://api.musticker.com/index.php'
  },
  'development-static': {
    baseUrl: 'https://dev-static-1.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-1-api.musticker.com/index.php'
  },
  // Verified reachable on 2026-08-24. No branch of this name exists, so unlike the keys around it
  // this one is selected explicitly via E2E_ENVIRONMENT or the manual-playwright workflow rather
  // than by a push.
  'development-static-2': {
    baseUrl: 'https://dev-static-2.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-2-api.musticker.com/index.php'
  },
  'development-1': {
    // dev.musticker.com did not resolve (DNS) on 2026-08-11, but both hosts answered on
    // 2026-08-24 and the pricing suite now runs here -- see tests/fixtures/pricing/.
    baseUrl: 'https://dev.musticker.com/kr',
    apiBaseUrl: 'https://dev-api.musticker.com/index.php'
  },
  'development-2': {
    baseUrl: 'https://dev-2.musticker.com/kr',
    apiBaseUrl: 'https://dev-2-api.musticker.com/index.php'
  },
  'development-3': {
    baseUrl: 'https://dev-3.musticker.com/kr',
    apiBaseUrl: 'https://dev-3-api.musticker.com/index.php'
  },
  'development-4': {
    baseUrl: 'https://dev-4.musticker.com/kr',
    apiBaseUrl: 'https://dev-4-api.musticker.com/index.php'
  }
} as const;

export type EnvironmentName = keyof typeof environments;

// Admin panel origins, only for the environments that have one. Kept apart from `environments`
// rather than added as a third field, because most servers have no admin panel we know of and an
// `adminBaseUrl: undefined` on each would read as "checked, none exists". Both verified live on
// 2026-09-25. The admin panel talks to the same API host as its storefront.
//
// Production's panel is live customer data: admin specs are read-only there, and every spec that
// changes an order refuses to run anywhere but development-static.
export const adminPanelUrls: Partial<Record<EnvironmentName, string>> = {
  production: 'https://admin-panel.musticker.com',
  'development-static': 'https://dev-static-1-admin-panel.musticker.com'
};

export function isEnvironmentName(value: string): value is EnvironmentName {
  return value in environments;
}
