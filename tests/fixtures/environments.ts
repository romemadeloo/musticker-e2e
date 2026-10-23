// Production and six Dev-Shared targets in ap-northeast-2.
// Keep dev-N keys aligned with CI branch names; dev-N maps to Dev-Shared #N.
export type EnvironmentConfig = {
  baseUrl: string;
  apiBaseUrl: string;
  // Only on servers whose admin panel we know. Absent means admin specs skip there -- it is not
  // "checked, none exists". The panel talks to the same API host as its storefront.
  //
  // Production's panel is live customer data: admin specs are read-only there, and every spec that
  // changes an order refuses to run anywhere but dev-1.
  adminPanel?: string;
};

export const environments = {
  production: {
    baseUrl: 'https://www.musticker.com/kr',
    apiBaseUrl: 'https://api.musticker.com/index.php',
    adminPanel: 'https://admin-panel.musticker.com'
  },
  // Dev-Shared #1 has no numeric hostname suffix.
  'dev-1': {
    baseUrl: 'https://shared-dev-static-sf.musticker.com/kr',
    apiBaseUrl: 'https://shared-dev-static-api.musticker.com/index.php',
    adminPanel: 'https://shared-dev-static-admin.musticker.com'
  },
  'dev-2': {
    baseUrl: 'https://shared-dev-static-sf-2.musticker.com/kr',
    apiBaseUrl: 'https://shared-dev-static-api-2.musticker.com/index.php',
    adminPanel: 'https://shared-dev-static-admin-2.musticker.com'
  },
  'dev-3': {
    baseUrl: 'https://shared-dev-static-sf-3.musticker.com/kr',
    apiBaseUrl: 'https://shared-dev-static-api-3.musticker.com/index.php',
    adminPanel: 'https://shared-dev-static-admin-3.musticker.com'
  },
  'dev-4': {
    baseUrl: 'https://shared-dev-static-sf-4.musticker.com/kr',
    apiBaseUrl: 'https://shared-dev-static-api-4.musticker.com/index.php',
    adminPanel: 'https://shared-dev-static-admin-4.musticker.com'
  },
  'dev-5': {
    baseUrl: 'https://shared-dev-static-sf-5.musticker.com/kr',
    apiBaseUrl: 'https://shared-dev-static-api-5.musticker.com/index.php',
    adminPanel: 'https://shared-dev-static-admin-5.musticker.com'
  },
  'dev-6': {
    baseUrl: 'https://shared-dev-static-sf-6.musticker.com/kr',
    apiBaseUrl: 'https://shared-dev-static-api-6.musticker.com/index.php',
    adminPanel: 'https://shared-dev-static-admin-6.musticker.com'
  }
} as const satisfies Record<string, EnvironmentConfig>;

export type EnvironmentName = keyof typeof environments;

export function isEnvironmentName(value: string): value is EnvironmentName {
  return value in environments;
}
