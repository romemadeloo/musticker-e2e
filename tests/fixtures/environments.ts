// Named storefront/API pairs for musticker's production and development/staging servers.
// Branch names match these keys 1:1 (see .github/workflows/smoke.yml), so CI can select an
// environment with E2E_ENVIRONMENT=${{ github.ref_name }} instead of per-branch conditionals.
export const environments = {
  production: {
    baseUrl: 'https://www.musticker.com/kr',
    apiBaseUrl: 'https://api.musticker.com/index.php'
  },
  // The dev-static-N servers, one branch per server (static-1 ... static-8). All eight storefronts and
  // admin panels answered on 2026-09-25. static-1 and static-2 were previously named
  // development-static and development-static-2.
  'static-1': {
    baseUrl: 'https://dev-static-1.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-1-api.musticker.com/index.php'
  },
  'static-2': {
    baseUrl: 'https://dev-static-2.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-2-api.musticker.com/index.php'
  },
  'static-3': {
    baseUrl: 'https://dev-static-3.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-3-api.musticker.com/index.php'
  },
  'static-4': {
    baseUrl: 'https://dev-static-4.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-4-api.musticker.com/index.php'
  },
  'static-5': {
    baseUrl: 'https://dev-static-5.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-5-api.musticker.com/index.php'
  },
  'static-6': {
    baseUrl: 'https://dev-static-6.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-6-api.musticker.com/index.php'
  },
  'static-7': {
    baseUrl: 'https://dev-static-7.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-7-api.musticker.com/index.php'
  },
  'static-8': {
    baseUrl: 'https://dev-static-8.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-8-api.musticker.com/index.php'
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
// `adminBaseUrl: undefined` on each would read as "checked, none exists". Production and every
// dev-static-N panel verified live on 2026-09-25. The admin panel talks to the same API host as its
// storefront.
//
// Production's panel is live customer data: admin specs are read-only there, and every spec that
// changes an order refuses to run anywhere but static-1.
export const adminPanelUrls: Partial<Record<EnvironmentName, string>> = {
  production: 'https://admin-panel.musticker.com',
  'static-1': 'https://dev-static-1-admin-panel.musticker.com',
  'static-2': 'https://dev-static-2-admin-panel.musticker.com',
  'static-3': 'https://dev-static-3-admin-panel.musticker.com',
  'static-4': 'https://dev-static-4-admin-panel.musticker.com',
  'static-5': 'https://dev-static-5-admin-panel.musticker.com',
  'static-6': 'https://dev-static-6-admin-panel.musticker.com',
  'static-7': 'https://dev-static-7-admin-panel.musticker.com',
  'static-8': 'https://dev-static-8-admin-panel.musticker.com'
};

export function isEnvironmentName(value: string): value is EnvironmentName {
  return value in environments;
}
