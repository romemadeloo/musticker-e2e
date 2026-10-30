import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Settings } from './types';

export type RunRequest = {
  projectId: string;
  environment: string;
  suite: string;
  browserProject: string;
  customGrep?: string | null;
  trigger: 'manual' | 'schedule';
  scheduleId?: string | null;
};

// Creates a queued execution and asks GitHub Actions to run it. The workflow passes
// dashboard_run_id to the Playwright reporter, which then fills in this same row instead of creating
// a new one. Returns the execution id; on dispatch failure the row is marked cancelled and the error
// rethrown so the caller can show it.
export async function dispatchRun(supabase: SupabaseClient, request: RunRequest): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const { data: settings } = await supabase.from('settings').select('*').eq('project_id', request.projectId).maybeSingle<Settings>();

  if (!token) throw new Error('GITHUB_TOKEN is not set on the dashboard deployment.');
  if (!settings?.github_owner || !settings.github_repo) {
    throw new Error('Set the GitHub owner and repository in Settings before starting runs.');
  }
  if (request.suite === 'custom-grep' && !request.customGrep?.trim()) {
    throw new Error('A custom grep is required when the suite is custom-grep.');
  }

  const { data: execution, error } = await supabase
    .from('executions')
    .insert({
      project_id: request.projectId,
      environment_key: request.environment,
      browser_project: request.browserProject,
      suite: request.suite,
      grep: request.customGrep || null,
      trigger: request.trigger,
      schedule_id: request.scheduleId ?? null,
      status: 'queued',
      branch: settings.github_ref
    })
    .select('id')
    .single();
  if (error || !execution) throw new Error(`Could not create the execution: ${error?.message}`);

  const url = `https://api.github.com/repos/${settings.github_owner}/${settings.github_repo}/actions/workflows/${encodeURIComponent(settings.github_workflow)}/dispatches`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref: settings.github_ref,
      inputs: {
        environment: request.environment,
        suite: request.suite,
        browser_project: request.browserProject,
        custom_grep: request.customGrep ?? '',
        dashboard_run_id: execution.id
      }
    }),
    cache: 'no-store'
  });

  if (!response.ok) {
    const body = await response.text();
    await supabase.from('executions').update({ status: 'cancelled', finished_at: new Date().toISOString() }).eq('id', execution.id);
    throw new Error(`GitHub refused the dispatch (${response.status}): ${body.slice(0, 300)}`);
  }

  return execution.id;
}
