import Link from 'next/link';
import { Card, EmptyState, PageHeader, StatTile, TableWrap } from '@/components/ui';
import { LineTrend, OutcomeBars } from '@/components/charts';
import { ModuleTable } from '@/components/module-health';
import { ENVIRONMENT_KEYS } from '@/lib/constants';
import { toModuleStats, type ModuleStatRow } from '@/lib/modules';
import { formatDuration, formatPercent, passRate } from '@/lib/format';
import { getCurrentProject } from '@/lib/project';
import { sinceDay, toDaySeries, totals } from '@/lib/stats';
import { createClient } from '@/lib/supabase/server';
import type { CaseStat, DailyStat, Execution, TestSuite } from '@/lib/types';

export const dynamic = 'force-dynamic';

const RANGES = [7, 30, 90] as const;

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string; env?: string }> }) {
  const params = await searchParams;
  const days = RANGES.find((r) => String(r) === params.days) ?? 30;
  const env = params.env && (ENVIRONMENT_KEYS as readonly string[]).includes(params.env) ? params.env : '';

  const { project } = await getCurrentProject();
  const supabase = await createClient();
  const since = sinceDay(days);

  let dailyQuery = supabase.from('v_daily_stats').select('*').eq('project_id', project.id).gte('day', since);
  let runsQuery = supabase
    .from('executions')
    .select('browser_project,passed,failed,flaky,skipped,duration_ms')
    .eq('project_id', project.id)
    .not('status', 'in', '(queued,running,cancelled)')
    .gte('created_at', `${since}T00:00:00+09:00`);
  if (env) {
    dailyQuery = dailyQuery.eq('environment_key', env);
    runsQuery = runsQuery.eq('environment_key', env);
  }

  const [daily, runs, caseStats, suites, moduleRows] = await Promise.all([
    dailyQuery,
    runsQuery,
    supabase.from('v_case_stats').select('*').eq('project_id', project.id).gt('runs', 0),
    supabase.from('test_suites').select('id,title,file,area').eq('project_id', project.id),
    supabase.rpc('module_stats', { p_project_id: project.id, p_since: `${since}T00:00:00+09:00`, p_environment: env || null })
  ]);
  const modules = toModuleStats((moduleRows.data ?? []) as ModuleStatRow[]);

  const series = toDaySeries((daily.data ?? []) as DailyStat[], days);
  const sum = totals(series);
  const stats = (caseStats.data ?? []) as CaseStat[];

  const flaky = stats.filter((s) => s.flaky > 0).sort((a, b) => b.flaky / b.runs - a.flaky / a.runs).slice(0, 10);
  const failing = stats.filter((s) => s.failed > 0).sort((a, b) => b.failed - a.failed).slice(0, 10);
  const slowest = stats.filter((s) => s.avg_duration_ms != null).sort((a, b) => b.avg_duration_ms! - a.avg_duration_ms!).slice(0, 10);

  const suiteById = new Map(((suites.data ?? []) as Pick<TestSuite, 'id' | 'title' | 'file' | 'area'>[]).map((s) => [s.id, s]));
  const bySuite = new Map<string, { title: string; area: string | null; passed: number; failed: number; flaky: number }>();
  for (const s of stats) {
    const suite = s.suite_id ? suiteById.get(s.suite_id) : undefined;
    const key = suite?.id ?? 'none';
    const row = bySuite.get(key) ?? { title: suite?.title ?? 'Unassigned', area: suite?.area ?? null, passed: 0, failed: 0, flaky: 0 };
    row.passed += Number(s.passed);
    row.failed += Number(s.failed);
    row.flaky += Number(s.flaky);
    bySuite.set(key, row);
  }
  const suiteRows = [...bySuite.entries()]
    .map(([id, r]) => ({ id, ...r, rate: passRate(r.passed, r.passed + r.failed + r.flaky) }))
    .sort((a, b) => (a.rate ?? 101) - (b.rate ?? 101))
    .slice(0, 12);

  const byBrowser = new Map<string, { runs: number; passed: number; failed: number; flaky: number; duration: number }>();
  for (const r of (runs.data ?? []) as Pick<Execution, 'browser_project' | 'passed' | 'failed' | 'flaky' | 'duration_ms'>[]) {
    const key = r.browser_project ?? 'unknown';
    const row = byBrowser.get(key) ?? { runs: 0, passed: 0, failed: 0, flaky: 0, duration: 0 };
    row.runs += 1;
    row.passed += r.passed;
    row.failed += r.failed;
    row.flaky += r.flaky;
    row.duration += r.duration_ms ?? 0;
    byBrowser.set(key, row);
  }

  const totalDuration = series.reduce((acc, p) => acc + (p.avgDurationMin ?? 0) * p.runs, 0);

  return (
    <>
      <PageHeader title="Analytics" description="Trends, flakiness and hot spots across Playwright runs." />

      <form className="no-print mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="label" htmlFor="days">
            Range
          </label>
          <select id="days" name="days" defaultValue={String(days)} className="input">
            {RANGES.map((r) => (
              <option key={r} value={r}>
                Last {r} days
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="env">
            Environment
          </label>
          <select id="env" name="env" defaultValue={env} className="input">
            <option value="">All environments</option>
            {ENVIRONMENT_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <button className="btn" type="submit">
          Apply
        </button>
      </form>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Runs" value={sum.runs} />
        <StatTile label="Pass rate" value={formatPercent(sum.passRate)} hint="flaky counts as not passed" />
        <StatTile label="Failures" value={sum.failed} hint={`${sum.flaky} flaky`} />
        <StatTile label="Runner time" value={formatDuration(Math.round(totalDuration * 60_000))} hint="sum of run durations" />
      </div>

      <Card
        title="Pass rate by module"
        actions={<span className="text-xs font-semibold text-[var(--muted)]">Workbook areas · last {days} days{env ? ` · ${env}` : ''}</span>}
        className="mb-6"
      >
        <ModuleTable modules={modules} />
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="Pass rate">
          <div className="p-3">
            <LineTrend data={series} dataKey="passRate" unit="%" domain={[0, 100]} label="Pass rate" />
          </div>
        </Card>
        <Card title="Outcomes per day">
          <div className="p-3">
            <OutcomeBars data={series} />
          </div>
        </Card>
        <Card title="Average run duration (minutes)">
          <div className="p-3">
            <LineTrend data={series} dataKey="avgDurationMin" unit="m" label="Average duration" />
          </div>
        </Card>
        <Card title="By browser project">
          {byBrowser.size ? (
            <TableWrap>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th className="num">Runs</th>
                    <th className="num">Pass rate</th>
                    <th className="num">Failed</th>
                    <th className="num">Flaky</th>
                    <th className="num">Avg duration</th>
                  </tr>
                </thead>
                <tbody>
                  {[...byBrowser.entries()].map(([name, r]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td className="num">{r.runs}</td>
                      <td className="num">{formatPercent(passRate(r.passed, r.passed + r.failed + r.flaky))}</td>
                      <td className="num">{r.failed}</td>
                      <td className="num">{r.flaky}</td>
                      <td className="num">{formatDuration(Math.round(r.duration / r.runs))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          ) : (
            <EmptyState title="No runs in this range" />
          )}
        </Card>
      </div>

      <p className="mb-3 text-xs text-muted">Per-test tables below cover the last 30 days across all environments.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <RankTable title="Flakiest tests" rows={flaky} metric={(s) => `${s.flaky}/${s.runs} runs`} share={(s) => s.flaky / s.runs} color="var(--warning)" />
        <RankTable title="Most failures" rows={failing} metric={(s) => `${s.failed}/${s.runs} runs`} share={(s) => s.failed / s.runs} color="var(--critical)" />
        <RankTable
          title="Slowest tests"
          rows={slowest}
          metric={(s) => formatDuration(s.avg_duration_ms)}
          share={(s) => (s.avg_duration_ms ?? 0) / (slowest[0]?.avg_duration_ms || 1)}
          color="var(--series-1)"
        />
        <Card title="Weakest suites">
          {suiteRows.length ? (
            <TableWrap>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Suite</th>
                    <th className="num">Pass rate</th>
                    <th className="num">Failed</th>
                    <th className="num">Flaky</th>
                  </tr>
                </thead>
                <tbody>
                  {suiteRows.map((s) => (
                    <tr key={s.id}>
                      <td>
                        {s.id === 'none' ? s.title : <Link href={`/suites/${s.id}`} className="hover:underline">{s.title}</Link>}
                        {s.area && <div className="text-xs text-muted">{s.area}</div>}
                      </td>
                      <td className="num">{formatPercent(s.rate)}</td>
                      <td className="num">{s.failed}</td>
                      <td className="num">{s.flaky}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          ) : (
            <EmptyState title="No results yet" />
          )}
        </Card>
      </div>
    </>
  );
}

function RankTable({
  title,
  rows,
  metric,
  share,
  color
}: {
  title: string;
  rows: CaseStat[];
  metric: (s: CaseStat) => string;
  share: (s: CaseStat) => number;
  color: string;
}) {
  return (
    <Card title={title}>
      {rows.length ? (
        <ul className="divide-y divide-[var(--border)]">
          {rows.map((s) => (
            <li key={s.test_case_id} className="px-4 py-2.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <Link href={`/cases/${s.test_case_id}`} className="line-clamp-1 min-w-0 hover:underline">
                  {s.title}
                </Link>
                <span className="shrink-0 text-xs tabular-nums text-ink-2">{metric(s)}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded bg-[var(--surface-2)]">
                <div className="h-1.5 rounded" style={{ width: `${Math.max(2, Math.min(100, share(s) * 100))}%`, background: color }} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Nothing to show" />
      )}
    </Card>
  );
}
