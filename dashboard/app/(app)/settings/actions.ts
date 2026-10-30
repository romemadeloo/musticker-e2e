'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BROWSER_PROJECTS, ENVIRONMENT_KEYS } from '@/lib/constants';
import { getCurrentProject } from '@/lib/project';
import { createClient } from '@/lib/supabase/server';

const name = /^[A-Za-z0-9_.-]+$/;

export async function saveSettings(formData: FormData) {
  const { project } = await getCurrentProject();
  const text = (key: string) => String(formData.get(key) ?? '').trim();

  const owner = text('github_owner');
  const repo = text('github_repo');
  const workflow = text('github_workflow') || 'manual-playwright.yml';
  const ref = text('github_ref') || 'production';
  const retention = Number(text('retention_days'));

  const problems = [
    owner && !name.test(owner) && 'GitHub owner',
    repo && !name.test(repo) && 'GitHub repository',
    !name.test(workflow) && 'Workflow file',
    !/^[A-Za-z0-9_./-]+$/.test(ref) && 'Git ref',
    !(ENVIRONMENT_KEYS as readonly string[]).includes(text('default_environment')) && 'Default environment',
    !(BROWSER_PROJECTS as readonly string[]).includes(text('default_browser')) && 'Default browser',
    !(Number.isInteger(retention) && retention >= 7 && retention <= 730) && 'Retention (7–730 days)'
  ].filter(Boolean);
  if (problems.length) redirect(`/settings?error=${encodeURIComponent(`Check: ${problems.join(', ')}`)}`);

  const supabase = await createClient();
  const { error } = await supabase.from('settings').upsert({
    project_id: project.id,
    github_owner: owner || null,
    github_repo: repo || null,
    github_workflow: workflow,
    github_ref: ref,
    default_environment: text('default_environment'),
    default_browser: text('default_browser'),
    retention_days: retention,
    notify_on_failure: formData.get('notify_on_failure') === 'on',
    updated_at: new Date().toISOString()
  });
  if (error) redirect(`/settings?error=${encodeURIComponent(error.message)}`);

  revalidatePath('/', 'layout');
  redirect('/settings?saved=1');
}
