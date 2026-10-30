'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BROWSER_PROJECTS, ENVIRONMENT_KEYS, SUITES } from '@/lib/constants';
import { validateCron } from '@/lib/cron';
import { dispatchRun } from '@/lib/github';
import { getCurrentProject } from '@/lib/project';
import { createClient } from '@/lib/supabase/server';
import type { Schedule } from '@/lib/types';

function fail(message: string): never {
  redirect(`/scheduler?error=${encodeURIComponent(message)}`);
}

export async function saveSchedule(formData: FormData) {
  const { project } = await getCurrentProject();
  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const cron = String(formData.get('cron') ?? '').trim();
  const timezone = String(formData.get('timezone') ?? 'Asia/Seoul').trim();
  const environment = String(formData.get('environment') ?? '');
  const suite = String(formData.get('suite') ?? '');
  const browser = String(formData.get('browser_project') ?? '');
  const customGrep = String(formData.get('custom_grep') ?? '').trim() || null;

  if (!name) fail('Give the schedule a name.');
  const cronError = validateCron(cron, timezone);
  if (cronError) fail(`Invalid cron or timezone: ${cronError}`);
  if (!(ENVIRONMENT_KEYS as readonly string[]).includes(environment)) fail('Unknown environment.');
  if (!(SUITES as readonly string[]).includes(suite)) fail('Unknown suite.');
  if (!(BROWSER_PROJECTS as readonly string[]).includes(browser)) fail('Unknown browser project.');
  if (suite === 'custom-grep' && !customGrep) fail('A custom grep is required when the suite is custom-grep.');

  const row = {
    project_id: project.id,
    name,
    cron,
    timezone,
    environment_key: environment,
    suite,
    browser_project: browser,
    custom_grep: suite === 'custom-grep' ? customGrep : null,
    enabled: formData.get('enabled') === 'on',
    updated_at: new Date().toISOString()
  };

  const supabase = await createClient();
  // A new or edited schedule starts counting from now, so it never fires for occurrences in the past.
  const { error } = id
    ? await supabase.from('schedules').update({ ...row, last_run_at: new Date().toISOString() }).eq('id', id)
    : await supabase.from('schedules').insert(row);
  if (error) fail(error.message);

  revalidatePath('/scheduler');
  redirect('/scheduler?saved=1');
}

export async function toggleSchedule(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const enabled = formData.get('enabled') === 'true';
  const supabase = await createClient();
  // Re-enabling starts from now instead of catching up on what was missed while disabled.
  await supabase
    .from('schedules')
    .update({ enabled, ...(enabled ? { last_run_at: new Date().toISOString() } : {}), updated_at: new Date().toISOString() })
    .eq('id', id);
  revalidatePath('/scheduler');
}

export async function deleteSchedule(formData: FormData) {
  const supabase = await createClient();
  await supabase.from('schedules').delete().eq('id', String(formData.get('id') ?? ''));
  revalidatePath('/scheduler');
}

export async function runScheduleNow(formData: FormData) {
  const supabase = await createClient();
  const { data: schedule } = await supabase.from('schedules').select('*').eq('id', String(formData.get('id') ?? '')).maybeSingle<Schedule>();
  if (!schedule) fail('Schedule not found.');

  let executionId: string;
  try {
    executionId = await dispatchRun(supabase, {
      projectId: schedule.project_id,
      environment: schedule.environment_key,
      suite: schedule.suite,
      browserProject: schedule.browser_project,
      customGrep: schedule.custom_grep,
      trigger: 'schedule',
      scheduleId: schedule.id
    });
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
  await supabase.from('schedules').update({ last_execution_id: executionId }).eq('id', schedule.id);
  redirect(`/executions/${executionId}?dispatched=1`);
}
