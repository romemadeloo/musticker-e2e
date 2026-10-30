'use server';

import { redirect } from 'next/navigation';
import { CASE_STATUSES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export async function updateCase(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? 'active');
  if (!(CASE_STATUSES as readonly string[]).includes(status)) throw new Error('Unknown case state.');

  const supabase = await createClient();
  const { error } = await supabase
    .from('test_cases')
    .update({ status, notes: String(formData.get('notes') ?? '').trim() || null, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  redirect(`/cases/${id}?saved=1`);
}
