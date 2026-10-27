import type { EnvironmentName } from './environments.js';

/**
 * `E2E_ENVIRONMENT=qa` means "the QA team's main test server, or its backup if the main one is
 * down" -- in that order. Everything else names one server and gets exactly that server: PR checks
 * and post-deploy smoke test the server a branch deploys to, and falling back there would report a
 * green run for a server that was never tested.
 *
 * Dev servers only. Falling back onto production would turn a dev outage into a production run.
 */
export const QA_ENVIRONMENT_ALIAS = 'qa';
export const qaEnvironmentChain = ['dev-1', 'dev-2'] as const satisfies readonly EnvironmentName[];

export type EnvironmentProbe = (name: EnvironmentName) => Promise<{ ready: boolean; detail: string }>;

export type FallbackDecision = {
  selected: EnvironmentName;
  attempts: { environment: EnvironmentName; ready: boolean; detail: string }[];
  fellBack: boolean;
};

/**
 * The first ready server in the chain. When none is ready the primary is returned anyway, so the
 * global readiness check blocks the run with its usual report instead of this guessing further.
 */
export async function selectQaEnvironment(
  probe: EnvironmentProbe,
  chain: readonly EnvironmentName[] = qaEnvironmentChain
): Promise<FallbackDecision> {
  const attempts: FallbackDecision['attempts'] = [];

  for (const environment of chain) {
    const { ready, detail } = await probe(environment);
    attempts.push({ environment, ready, detail });
    if (ready) {
      return { selected: environment, attempts, fellBack: environment !== chain[0] };
    }
  }

  return { selected: chain[0], attempts, fellBack: false };
}
