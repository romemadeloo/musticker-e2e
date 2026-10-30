'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PROJECT_COOKIE } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export async function selectProject(formData: FormData) {
  const projectId = String(formData.get('projectId') ?? '');
  (await cookies()).set(PROJECT_COOKIE, projectId, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
  revalidatePath('/', 'layout');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
