import Link from 'next/link';
import { Card, EmptyState, PageHeader, StatTile, TextLink } from '@/components/ui';
import { LineTrend, OutcomeBars } from '@/components/charts';
import { ExecutionsTable } from '@/components/executions-table';
import { StatusBadge } from '@/components/status-badge';
import { nextRuns } from '@/lib/cron';
import { formatDateTime, formatDuration, formatPercent, formatRelative } from '@/lib/format';
import { getCurrentProject } from '@/lib/project';
import { sinceDay, toDaySeries, totals } from '@/lib/stats';
import { createClient } from '@/lib/supabase/server';
import type { CaseStat, DailyStat, Environment, Execution, Schedule } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { project } = await getCurrentProject();
  const supabase = await createClient();

  const [recent, daily, caseCount, flakyCases, flakyCount, schedules, environments, envRuns] = await Promise.all([
    supabase.from('executions').select('*').eq('project_id', project.id).order('created_at', { ascending: false }).limit(8),
    supabase.from('v_daily_stats').select('*').eq('project_id', project.id).gte('day', sinceDay(14)),
    supabase.from('test_cases').select('id', { count: 'exact', head: true }).eq('project_id', project.id).eq('status', 'active'),
    supabase.from('v_case_stats').select('*').eq('project_id', project.id).gt('flaky', 0).order('flaky', { ascending: false }).limit(5),
    supabase.from('v_case_stats').select('test_case_id', { count: 'exact', head: true }).eq('project_id', project.id).gt('flaky', 0),
    supabase.from('schedules').select('*').eq('project_id', project.id).eq('enabled', true),
    supabase.from('environments').select('*').eq('project_id', project.id).order('key'),
    supabase
      .from('executions')
      .select('environment_key,status,created_at,id')
      .eq('project_id', project.id)
      .not('status', 'in', '(queued,running)')
      .order('created_at', { ascending: false })
      .limit(200)
  ]);

  const executions = (recent.data ?? []) as Execution[];
  const series = toDaySeries((daily.data ?? []) as DailyStat[], 14);
  const week = totals(series.slice(-7));
  const lastRun = executions.find((e) => !['queued', 'running'].includes(e.status));
  const finishedDurations = executions.filter((e) => e.duration_ms != null).map((e) => e.duration_ms!);
  const avgDuration = finishedDurations.length ? Math.round(finishedDurations.reduce((a, b) => a + b, 0) / finishedDurations.length) : null;

  const lastByEnv = new Map<string, { status: string; created_at: string; id: string }>();
  for (const r of envRuns.data ?? []) {
    if (r.environment_key && !lastByEnv.has(r.environment_key)) lastByEnv.set(r.environment_key, r);
  }

  const upcoming = ((schedules.data ?? []) as Schedule[])
    .map((s) => ({ schedule: s, next: nextRuns(s.cron, s.timezone, 1)[0] }))
    .filter((u) => u.next)
    .sort((a, b) => a.next.getTime() - b.next.getTime())
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`${project.name} — health of the Playwright suite at a glance.`}
        actions={
          <Link href="/executions?run=1" className="btn btn-primary">
            Run tests
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile
          label="Last run"
          value={lastRun ? <StatusBadge status={lastRun.status} /> : '—'}
          hint={lastRun ? `${lastRun.suite ?? 'run'} on ${lastRun.environment_key ?? '?'} · ${formatRelative(lastRun.started_at ?? lastRun.created_at)}` : 'No runs yet'}
        />
        <StatTile label="Pass rate (7 days)" value={formatPercent(week.passRate)} hint={`${week.runs} runs`} />
        <StatTile label="Active test cases" value={caseCount.count ?? 0} />
        <StatTile label="Flaky tests (30 days)" value={flakyCount.count ?? 0} hint="passed only on retry" />
        <StatTile label="Avg run duration" value={formatDuration(avgDuration)} hint="last 8 runs" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="Pass rate, last 14 days">
          <div className="p-3">
            <LineTrend data={series} dataKey="passRate" unit="%" domain={[0, 100]} label="Pass rate" />
          </div>
        </Card>
        <Card title="Outcomes per day">
          <div className="p-3">
            <OutcomeBars data={series} />
          </div>
        </Card>
      </div>

      <Card title="Recent executions" actions={<TextLink href="/executions">View all</TextLink>} className="mb-6">
        {executions.length ? (
          <ExecutionsTable executions={executions} compact />
        ) : (
          <EmptyState title="No executions yet">
            Add the dashboard reporter to the Playwright config and set DASHBOARD_URL and DASHBOARD_INGEST_TOKEN — see Settings.
          </EmptyState>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Environments" actions={<TextLink href="/environments">Manage</TextLink>} className="lg:col-span-1">
          <ul className="divide-y divide-[var(--border)]">
            {((environments.data ?? []) as Environment[]).map((env) => {
              const last = lastByEnv.get(env.key);
              return (
                <li key={env.id} className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm">
                  <span className="min-w-0 truncate">
                    {env.name}
                    {env.is_production && <span className="ml-1.5 tag">prod</span>}
                  </span>
                  {last ? (
                    <Link href={`/executions/${last.id}`} title={formatDateTime(last.created_at)}>
                      <StatusBadge status={last.status} />
                    </Link>
                  ) : (
                    <span className="text-xs text-muted">no runs</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="Flaky tests" actions={<TextLink href="/analytics">Analytics</TextLink>}>
          {flakyCases.data?.length ? (
            <ul className="divide-y divide-[var(--border)]">
              {((flakyCases.data ?? []) as CaseStat[]).map((c) => (
                <li key={c.test_case_id} className="px-4 py-2.5 text-sm">
                  <Link href={`/cases/${c.test_case_id}`} className="line-clamp-1 hover:underline">
                    {c.title}
                  </Link>
                  <div className="text-xs text-muted">
                    flaky {c.flaky} of {c.runs} runs
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No flaky tests in 30 days" />
          )}
        </Card>

        <Card title="Upcoming scheduled runs" actions={<TextLink href="/scheduler">Scheduler</TextLink>}>
          {upcoming.length ? (
            <ul className="divide-y divide-[var(--border)]">
              {upcoming.map(({ schedule, next }) => (
                <li key={schedule.id} className="px-4 py-2.5 text-sm">
                  <div className="font-medium">{schedule.name}</div>
                  <div className="text-xs text-muted">
                    {schedule.suite} on {schedule.environment_key} · {formatDateTime(next)} ({formatRelative(next.toISOString())})
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No enabled schedules" />
          )}
        </Card>
      </div>
    </>
  );
}
