'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PROJECT_COOKIE } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export async function createProject(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!name || !slug) redirect('/projects?error=Name+and+slug+are+required');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name,
      slug,
      description: String(formData.get('description') ?? '').trim() || null,
      repo_url: String(formData.get('repo_url') ?? '').trim() || null
    })
    .select('id')
    .single();
  if (error || !data) redirect(`/projects?error=${encodeURIComponent(error?.message ?? 'Could not create the project')}`);

  await supabase.from('settings').insert({ project_id: data.id });
  (await cookies()).set(PROJECT_COOKIE, data.id, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
  revalidatePath('/', 'layout');
  redirect('/projects?created=1');
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  const supabase = await createClient();
  const { data: project } = await supabase.from('projects').select('slug').eq('id', id).single();
  if (!project || confirm !== project.slug) redirect('/projects?error=Type+the+project+slug+to+confirm+deletion');

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) redirect(`/projects?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/', 'layout');
  redirect('/projects');
}
