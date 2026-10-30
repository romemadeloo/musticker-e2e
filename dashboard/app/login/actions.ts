'use server';

import { headers } from 'next/headers';
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

export async function sendMagicLink(formData: FormData) {
  const next = safeNext(formData.get('next'));
  const origin = (await headers()).get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: String(formData.get('email') ?? ''),
    options: { shouldCreateUser: false, emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` }
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect('/login?sent=1');
}
