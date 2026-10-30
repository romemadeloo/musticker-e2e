'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentProject } from '@/lib/project';
import { createClient } from '@/lib/supabase/server';

function url(value: FormDataEntryValue | null): string | null {
  const v = String(value ?? '').trim();
  if (!v) return null;
  try {
    const parsed = new URL(v);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error();
    return v;
  } catch {
    redirect(`/environments?error=${encodeURIComponent(`Not a valid http(s) URL: ${v}`)}`);
  }
}

export async function saveEnvironment(formData: FormData) {
  const { project } = await getCurrentProject();
  const id = String(formData.get('id') ?? '');
  const key = String(formData.get('key') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  if (!key || !name) redirect('/environments?error=Key+and+name+are+required');

  const row = {
    project_id: project.id,
    key,
    name,
    base_url: url(formData.get('base_url')),
    api_url: url(formData.get('api_url')),
    admin_url: url(formData.get('admin_url')),
    is_production: formData.get('is_production') === 'on',
    description: String(formData.get('description') ?? '').trim() || null
  };

  const supabase = await createClient();
  const { error } = id ? await supabase.from('environments').update(row).eq('id', id) : await supabase.from('environments').insert(row);
  if (error) redirect(`/environments?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/environments');
  redirect('/environments');
}

export async function deleteEnvironment(formData: FormData) {
  const supabase = await createClient();
  await supabase.from('environments').delete().eq('id', String(formData.get('id') ?? ''));
  revalidatePath('/environments');
}

// A GET of the storefront from Vercel's network. The production WAF may answer 403 to
// datacenter IPs, which says nothing about whether customers can reach it — the card says so.
export async function checkHealth(formData: FormData) {
  const supabase = await createClient();
  const { data: env } = await supabase.from('environments').select('id,base_url').eq('id', String(formData.get('id') ?? '')).maybeSingle();
  if (!env?.base_url) return;

  const started = Date.now();
  let status = 0;
  try {
    const response = await fetch(env.base_url, { method: 'GET', redirect: 'follow', cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    status = response.status;
  } catch {
    status = 0;
  }

  await supabase
    .from('environments')
    .update({ last_health_status: status, last_health_latency_ms: Date.now() - started, last_health_checked_at: new Date().toISOString() })
    .eq('id', env.id);
  revalidatePath('/environments');
}
