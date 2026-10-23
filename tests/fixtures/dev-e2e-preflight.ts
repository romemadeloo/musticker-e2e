import { cleanupEndpoint } from './cleanup-scope.js';
import { environments, isEnvironmentName } from './environments.js';

type DevE2EInput = {
  environment?: string;
  storefrontURL: string;
  apiURL?: string;
  cleanupURL?: string;
  sandboxEnabled?: string;
  paymentEnabled?: string;
  authEnabled?: string;
  email?: string;
  password?: string;
};

export function assertDevE2EReady(input: DevE2EInput): void {
  if (!/^dev-[1-6]$/.test(input.environment || '')) throw new Error('Full E2E requires a registered dev-1 through dev-6 target.');
  if (input.sandboxEnabled !== 'true') throw new Error('Set DEV_PAYMENT_SANDBOX_ENABLED=true only after confirming the target uses sandbox payments.');
  if (input.paymentEnabled !== 'true' || input.authEnabled !== 'true') throw new Error('Full E2E requires both payment and destructive-auth flags enabled.');
  if (!input.email || !input.password) throw new Error('Full E2E requires the seeded dev member credentials.');
  if (!input.apiURL || !input.cleanupURL) throw new Error('Full E2E requires a dev API and TEST_DATA_USER_DELETE_ENDPOINT.');
  if (!isEnvironmentName(input.environment!)) throw new Error('Unknown dev target.');
  const target = environments[input.environment!];
  if (new URL(input.storefrontURL).origin !== new URL(target.baseUrl).origin ||
      new URL(input.apiURL).origin !== new URL(target.apiBaseUrl).origin) {
    throw new Error('Full E2E URLs must match the selected dev environment.');
  }
  cleanupEndpoint(input.cleanupURL, {
    runId: 'preflight',
    storefrontOrigin: new URL(input.storefrontURL).origin,
    apiOrigin: new URL(input.apiURL).origin
  });
}
