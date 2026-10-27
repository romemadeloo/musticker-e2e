import { test, expect } from '@playwright/test';
import { qaEnvironmentChain, selectQaEnvironment } from '../fixtures/environment-fallback.js';
import type { EnvironmentName } from '../fixtures/environments.js';

const probeWith = (up: EnvironmentName[]) => {
  const probed: EnvironmentName[] = [];
  const probe = async (name: EnvironmentName) => {
    probed.push(name);
    return { ready: up.includes(name), detail: up.includes(name) ? 'HTTP 200' : 'HTTP 404' };
  };
  return { probe, probed };
};

test('the QA chain is dev-1 then dev-2 and never production', () => {
  expect(qaEnvironmentChain).toEqual(['dev-1', 'dev-2']);
  expect(qaEnvironmentChain).not.toContain('production');
});

test('a healthy main server is used without probing the backup', async () => {
  const { probe, probed } = probeWith(['dev-1', 'dev-2']);
  expect(await selectQaEnvironment(probe)).toMatchObject({ selected: 'dev-1', fellBack: false });
  expect(probed).toEqual(['dev-1']);
});

test('a down main server falls back to the backup and says so', async () => {
  const { probe } = probeWith(['dev-2']);
  const decision = await selectQaEnvironment(probe);
  expect(decision).toMatchObject({ selected: 'dev-2', fellBack: true });
  expect(decision.attempts.map((attempt) => attempt.ready)).toEqual([false, true]);
});

test('with every server down the main one is kept so readiness blocks the run', async () => {
  const { probe } = probeWith([]);
  expect(await selectQaEnvironment(probe)).toMatchObject({ selected: 'dev-1', fellBack: false });
});
