import Link from 'next/link';
import { CircleCheckBig, Shuffle, XCircle } from 'lucide-react';
import { Card, EmptyState, TextLink, ToneTile } from '@/components/ui';
import { OutcomeGauge, TrendCard } from '@/components/charts';
import { ExecutionsTable } from '@/components/executions-table';
import { HeroArt } from '@/components/hero-art';
import { ModuleRings } from '@/components/module-health';
import { toModuleStats, type ModuleStatRow } from '@/lib/modules';
import { StatusBadge } from '@/components/status-badge';
import { nextRuns } from '@/lib/cron';
import { formatDateTime, formatDuration, formatPercent, formatRelative } from '@/lib/format';
import { getCurrentProject } from '@/lib/project';
import { sinceDay, toDaySeries, totals } from '@/lib/stats';
import { createClient } from '@/lib/supabase/server';
import type { CaseStat, DailyStat, Environment, Execution, Schedule } from '@/lib/types';

export const dynamic = 'force-dynamic';

function delta(current: number | null, previous: number | null, unit = '') {
  if (current == null || previous == null) return 'no previous week';
  const d = Math.round((current - previous) * 10) / 10;
  return `${d > 0 ? '+' : ''}${d}${unit} vs last week`;
}

export default async function DashboardPage() {
  const { project } = await getCurrentProject();
  const supabase = await createClient();

  const [auth, recent, daily, caseCount, flakyCases, schedules, environments, envRuns, moduleRows] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('executions').select('*').eq('project_id', project.id).order('created_at', { ascending: false }).limit(8),
    supabase.from('v_daily_stats').select('*').eq('project_id', project.id).gte('day', sinceDay(14)),
    supabase.from('test_cases').select('id', { count: 'exact', head: true }).eq('project_id', project.id).eq('status', 'active'),
    supabase.from('v_case_stats').select('*').eq('project_id', project.id).gt('flaky', 0).order('flaky', { ascending: false }).limit(5),
    supabase.from('schedules').select('*').eq('project_id', project.id).eq('enabled', true),
    supabase.from('environments').select('*').eq('project_id', project.id).order('key'),
    supabase
      .from('executions')
      .select('environment_key,status,created_at,id')
      .eq('project_id', project.id)
      .not('status', 'in', '(queued,running)')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase.rpc('module_stats', { p_project_id: project.id, p_since: `${sinceDay(14)}T00:00:00+09:00` })
  ]);

  const modules = toModuleStats((moduleRows.data ?? []) as ModuleStatRow[]);
  const executions = (recent.data ?? []) as Execution[];
  const series = toDaySeries((daily.data ?? []) as DailyStat[], 14);
  const all = totals(series);
  const week = totals(series.slice(-7));
  const lastWeek = totals(series.slice(0, 7));
  const skipped = series.reduce((a, p) => a + p.skipped, 0);
  const durations = executions.filter((e) => e.duration_ms != null).map((e) => e.duration_ms!);
  const avgDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;
  const name = (auth.data.user?.email ?? '').split('@')[0].split(/[._-]/)[0] || 'there';

  const lastByEnv = new Map<string, { status: string; created_at: string; id: string }>();
  for (const r of envRuns.data ?? []) {
    if (r.environment_key && !lastByEnv.has(r.environment_key)) lastByEnv.set(r.environment_key, r);
  }

  const upcoming = ((schedules.data ?? []) as Schedule[])
    .map((s) => ({ schedule: s, next: nextRuns(s.cron, s.timezone, 1)[0] }))
    .filter((u) => u.next)
    .sort((a, b) => a.next.getTime() - b.next.getTime())
    .slice(0, 4);

  const lastRun = executions.find((e) => !['queued', 'running'].includes(e.status));

  return (
    <>
      <div className="mb-7 grid gap-6 md:grid-cols-3 2xl:grid-cols-[1.8fr_1fr_1fr_1fr]">
        <section className="hero animate-rise min-h-[250px] p-7 md:col-span-3 2xl:col-span-1">
          <HeroArt />
          <div className="relative max-w-[60%] max-sm:max-w-full">
            <h1 className="text-[26px] leading-tight font-extrabold">
              Welcome back, <span className="capitalize">{name}</span>!
            </h1>
            <p className="mt-1.5 text-[15px] font-semibold text-white/85">Here&apos;s how {project.name} is doing.</p>
          </div>
          <div className="relative mt-7 inline-flex flex-wrap items-center gap-6 rounded-[20px] bg-white/15 px-6 py-4 backdrop-blur-sm">
            <div>
              <div className="text-[26px] leading-none font-extrabold">{caseCount.count ?? 0}</div>
              <div className="mt-1 text-sm font-semibold text-white/85">Active tests</div>
            </div>
            <div className="h-10 w-px bg-white/25" aria-hidden />
            <div>
              <div className="text-[26px] leading-none font-extrabold">{formatDuration(avgDuration)}</div>
              <div className="mt-1 text-sm font-semibold text-white/85">Avg run</div>
            </div>
          </div>
          {lastRun && (
            <Link href={`/executions/${lastRun.id}`} className="relative mt-5 flex w-fit items-center gap-2 text-sm font-bold text-white/90 hover:text-white">
              Last run: {lastRun.suite ?? 'run'} on {lastRun.environment_key} · {formatRelative(lastRun.started_at ?? lastRun.created_at)} →
            </Link>
          )}
        </section>

        <div className="animate-rise" style={{ ['--i' as string]: 1 }}>
          <ToneTile
            tone="rose"
            href="/executions?status=failed"
            icon={<XCircle size={26} />}
            value={week.failed}
            delta={delta(week.failed, lastWeek.runs ? lastWeek.failed : null)}
            label="Failures (7d)"
          />
        </div>
        <div className="animate-rise" style={{ ['--i' as string]: 2 }}>
          <ToneTile tone="violet" href="/analytics" icon={<Shuffle size={24} />} value={week.flaky} delta={delta(week.flaky, lastWeek.runs ? lastWeek.flaky : null)} label="Flaky (7d)" />
        </div>
        <div className="animate-rise" style={{ ['--i' as string]: 3 }}>
          <ToneTile
            tone="green"
            href="/reports"
            icon={<CircleCheckBig size={26} />}
            value={formatPercent(week.passRate)}
            delta={delta(week.passRate, lastWeek.passRate, ' pts')}
            label="Pass rate (7d)"
          />
        </div>
      </div>

      <div className="mb-7 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendCard data={series} passRate={formatPercent(all.passRate)} runs={all.runs} avgDuration={formatDuration(avgDuration)} />
        </div>
        <OutcomeGauge passed={all.passed} flaky={all.flaky} failed={all.failed} skipped={skipped} />
      </div>

      <Card
        title="Module health"
        actions={<TextLink href="/analytics">Pass rate by module →</TextLink>}
        className="mb-7"
      >
        <p className="-mt-2 px-6 pb-4 text-xs font-semibold text-[var(--muted)]">Pass rate per workbook area, last 14 days, all environments</p>
        <ModuleRings modules={modules} />
      </Card>

      <div className="mb-7 grid gap-6 lg:grid-cols-3">
        <Card title="Recent executions" actions={<TextLink href="/executions">View all</TextLink>} className="lg:col-span-2">
          {executions.length ? (
            <ExecutionsTable executions={executions} compact />
          ) : (
            <EmptyState title="No executions yet">Start one with Run tests, or set DASHBOARD_URL for the Playwright reporter.</EmptyState>
          )}
        </Card>

        <Card title="Environments" actions={<TextLink href="/environments">Manage</TextLink>}>
          <ul className="space-y-1 px-3 pb-4">
            {((environments.data ?? []) as Environment[]).map((env) => {
              const last = lastByEnv.get(env.key);
              return (
                <li key={env.id} className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-2)]">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-xs font-extrabold text-accent">
                      {env.key === 'production' ? 'PRD' : env.key.replace('dev-', 'D').toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">{env.name}</span>
                      <span className="block text-xs text-[var(--muted)]">{last ? formatRelative(last.created_at) : 'no runs yet'}</span>
                    </span>
                  </span>
                  {last && (
                    <Link href={`/executions/${last.id}`} title={formatDateTime(last.created_at)}>
                      <StatusBadge status={last.status} />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Flaky tests" actions={<TextLink href="/analytics">Analytics</TextLink>}>
          {flakyCases.data?.length ? (
            <ul className="space-y-1 px-3 pb-4">
              {((flakyCases.data ?? []) as CaseStat[]).map((c) => (
                <li key={c.test_case_id}>
                  <Link href={`/cases/${c.test_case_id}`} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-[var(--surface-2)]">
                    <span className="min-w-0">
                      <span className="line-clamp-1 text-sm font-bold">{c.title}</span>
                      <span className="text-xs text-[var(--muted)]">{c.case_id ?? c.file}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[var(--warning-soft)] px-2.5 py-1 text-xs font-bold text-warning-text">
                      {c.flaky}/{c.runs} runs
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No flaky tests in 30 days" />
          )}
        </Card>

        <Card title="Upcoming scheduled runs" actions={<TextLink href="/scheduler">Scheduler</TextLink>}>
          {upcoming.length ? (
            <ul className="space-y-1 px-3 pb-4">
              {upcoming.map(({ schedule, next }) => (
                <li key={schedule.id} className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-[var(--surface-2)]">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{schedule.name}</span>
                    <span className="text-xs text-[var(--muted)]">
                      {schedule.suite} on {schedule.environment_key} · {formatDateTime(next)}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-accent">{formatRelative(next.toISOString())}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No enabled schedules">
              Turn one on under <Link href="/scheduler" className="font-bold text-accent">Scheduler</Link>.
            </EmptyState>
          )}
        </Card>
      </div>
    </>
  );
}
