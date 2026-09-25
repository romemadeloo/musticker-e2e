// Named storefront/API/admin-panel origins for musticker's production and development/staging
// servers. Branch names match these keys 1:1 (see .github/workflows/smoke.yml), so CI can select an
// environment with E2E_ENVIRONMENT=${{ github.ref_name }} instead of per-branch conditionals.
export type EnvironmentConfig = {
  baseUrl: string;
  apiBaseUrl: string;
  // Only on servers whose admin panel we know. Absent means admin specs skip there -- it is not
  // "checked, none exists". The panel talks to the same API host as its storefront.
  //
  // Production's panel is live customer data: admin specs are read-only there, and every spec that
  // changes an order refuses to run anywhere but static-1.
  adminPanel?: string;
};

export const environments = {
  production: {
    baseUrl: 'https://www.musticker.com/kr',
    apiBaseUrl: 'https://api.musticker.com/index.php',
    adminPanel: 'https://admin-panel.musticker.com'
  },
  // The dev-static-N servers, one branch per server (static-1 ... static-8). All eight storefronts and
  // admin panels answered on 2026-09-25. static-1 and static-2 were previously named
  // development-static and development-static-2.
  'static-1': {
    baseUrl: 'https://dev-static-1.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-1-api.musticker.com/index.php',
    adminPanel: 'https://dev-static-1-admin-panel.musticker.com'
  },
  'static-2': {
    baseUrl: 'https://dev-static-2.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-2-api.musticker.com/index.php',
    adminPanel: 'https://dev-static-2-admin-panel.musticker.com'
  },
  'static-3': {
    baseUrl: 'https://dev-static-3.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-3-api.musticker.com/index.php',
    adminPanel: 'https://dev-static-3-admin-panel.musticker.com'
  },
  'static-4': {
    baseUrl: 'https://dev-static-4.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-4-api.musticker.com/index.php',
    adminPanel: 'https://dev-static-4-admin-panel.musticker.com'
  },
  'static-5': {
    baseUrl: 'https://dev-static-5.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-5-api.musticker.com/index.php',
    adminPanel: 'https://dev-static-5-admin-panel.musticker.com'
  },
  'static-6': {
    baseUrl: 'https://dev-static-6.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-6-api.musticker.com/index.php',
    adminPanel: 'https://dev-static-6-admin-panel.musticker.com'
  },
  'static-7': {
    baseUrl: 'https://dev-static-7.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-7-api.musticker.com/index.php',
    adminPanel: 'https://dev-static-7-admin-panel.musticker.com'
  },
  'static-8': {
    baseUrl: 'https://dev-static-8.musticker.com/kr',
    apiBaseUrl: 'https://dev-static-8-api.musticker.com/index.php',
    adminPanel: 'https://dev-static-8-admin-panel.musticker.com'
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
} as const satisfies Record<string, EnvironmentConfig>;

export type EnvironmentName = keyof typeof environments;

export function isEnvironmentName(value: string): value is EnvironmentName {
  return value in environments;
}
