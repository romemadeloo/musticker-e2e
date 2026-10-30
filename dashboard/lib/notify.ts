import 'server-only';
import type { Execution } from './types';

// Posts a failed run to Slack. Best effort: a notification problem never fails ingest.
export async function notifyFailure(execution: Execution, projectName: string): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const target = [execution.suite, execution.environment_key, execution.browser_project].filter(Boolean).join(' · ');
  const text = [
    `:x: *${projectName}* run ${execution.status}: ${target || 'Playwright run'}`,
    `${execution.failed} failed, ${execution.flaky} flaky, ${execution.passed} passed of ${execution.total}`,
    `<${site}/executions/${execution.id}|Open in dashboard>${execution.ci_run_url ? ` · <${execution.ci_run_url}|CI run>` : ''}`
  ].join('\n');

  try {
    await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
  } catch (error) {
    console.warn('Slack notification failed', error);
  }
}
