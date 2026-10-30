'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Only same-site paths, so the login form cannot be used as an open redirect.
function safeNext(value: FormDataEntryValue | null): string {
  const next = String(value ?? '/');
  return next.startsWith('/') && !next.startsWith('//') ? next : '/';
}

export async function signIn(formData: FormData) {
  const next = safeNext(formData.get('next'));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? '')
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}
