// Named storefront/API/admin-panel origins for musticker's production and dev-static servers. Branch names match these keys 1:1 (see .github/workflows/smoke.yml), so CI can select an
// environment with E2E_ENVIRONMENT=${{ github.ref_name }} instead of per-branch conditionals.
// The development-1..4 servers (dev., dev-2..4.) were retired from the suite on 2026-09-25 in favour
// of static-1..8; comments elsewhere that say "verified on development-N" record where a fact was
// observed at the time.
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
  }
} as const satisfies Record<string, EnvironmentConfig>;

export type EnvironmentName = keyof typeof environments;

export function isEnvironmentName(value: string): value is EnvironmentName {
  return value in environments;
}
