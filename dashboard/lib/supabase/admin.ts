import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Service-role client for CI ingest and the scheduler cron. It bypasses RLS, so only routes that
// authenticate their caller themselves (ingest token, cron secret) may use it.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.');
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
