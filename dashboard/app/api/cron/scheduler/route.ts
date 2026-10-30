import { NextResponse } from 'next/server';
import { isDue } from '@/lib/cron';
import { dispatchRun } from '@/lib/github';
import { hasBearer } from '@/lib/secrets';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Schedule, Settings } from '@/lib/types';

// Vercel Cron (vercel.json, every 15 minutes) calls this with `Authorization: Bearer $CRON_SECRET`.
// It dispatches every due schedule, marks runs stuck in queued/running as interrupted, and applies
// each project's retention.
export const maxDuration = 60;

const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

export async function GET(request: Request) {
  if (!hasBearer(request, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const dispatched: { schedule: string; executionId?: string; error?: string }[] = [];

  const { data: schedules } = await supabase.from('schedules').select('*').eq('enabled', true);
  for (const schedule of (schedules ?? []) as Schedule[]) {
    const lastRun = schedule.last_run_at ? new Date(schedule.last_run_at) : null;
    if (!isDue(schedule.cron, schedule.timezone, lastRun, new Date(schedule.created_at), now)) continue;

    // Claim the occurrence before dispatching so an overlapping tick cannot start it twice.
    const claim = supabase.from('schedules').update({ last_run_at: now.toISOString() }).eq('id', schedule.id);
    const { data: claimed } = await (schedule.last_run_at ? claim.eq('last_run_at', schedule.last_run_at) : claim.is('last_run_at', null))
      .select('id')
      .maybeSingle();
    if (!claimed) continue;

    try {
      const executionId = await dispatchRun(supabase, {
        projectId: schedule.project_id,
        environment: schedule.environment_key,
        suite: schedule.suite,
        browserProject: schedule.browser_project,
        customGrep: schedule.custom_grep,
        trigger: 'schedule',
        scheduleId: schedule.id
      });
      await supabase.from('schedules').update({ last_execution_id: executionId }).eq('id', schedule.id);
      dispatched.push({ schedule: schedule.name, executionId });
    } catch (error) {
      dispatched.push({ schedule: schedule.name, error: error instanceof Error ? error.message : String(error) });
    }
  }

  // A run whose reporter never sent `end` (cancelled job, crashed runner) would otherwise spin forever.
  const { count: stale } = await supabase
    .from('executions')
    .update({ status: 'interrupted', finished_at: now.toISOString() }, { count: 'exact' })
    .in('status', ['queued', 'running'])
    .lt('created_at', new Date(now.getTime() - STALE_AFTER_MS).toISOString());

  let pruned = 0;
  const { data: settings } = await supabase.from('settings').select('project_id,retention_days');
  for (const s of (settings ?? []) as Pick<Settings, 'project_id' | 'retention_days'>[]) {
    const cutoff = new Date(now.getTime() - s.retention_days * 86_400_000).toISOString();
    const { count } = await supabase.from('executions').delete({ count: 'exact' }).eq('project_id', s.project_id).lt('created_at', cutoff);
    pruned += count ?? 0;
  }

  return NextResponse.json({ dispatched, staleMarkedInterrupted: stale ?? 0, pruned });
}
