import Link from 'next/link';
import { Card, EmptyState, PageHeader, StatTile, TableWrap } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { formatDateTime, formatDuration, formatPercent, passRate } from '@/lib/format';
import { getCurrentProject } from '@/lib/project';
import { sinceDay, toDaySeries, totals } from '@/lib/stats';
import { createClient } from '@/lib/supabase/server';
import type { DailyStat, Execution } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const { project } = await getCurrentProject();
  const supabase = await createClient();

  const [daily, runsRes] = await Promise.all([
    supabase.from('v_daily_stats').select('*').eq('project_id', project.id).gte('day', sinceDay(14)),
    supabase
      .from('executions')
      .select('*')
      .eq('project_id', project.id)
      .not('status', 'in', '(queued,running,cancelled)')
      .order('created_at', { ascending: false })
      .limit(40)
  ]);
  const series = toDaySeries((daily.data ?? []) as DailyStat[], 14);
  const thisWeek = totals(series.slice(-7));
  const lastWeek = totals(series.slice(0, 7));
  const delta = thisWeek.passRate != null && lastWeek.passRate != null ? Math.round((thisWeek.passRate - lastWeek.passRate) * 10) / 10 : null;
  const runs = (runsRes.data ?? []) as Execution[];

  return (
    <>
      <PageHeader title="Reports" description="Week-over-week summary and a shareable, printable report for every finished run." />

      <Card title="Last 7 days vs the 7 before" className="mb-6">
        <div className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-4">
          <StatTile
            label="Pass rate"
            value={formatPercent(thisWeek.passRate)}
            hint={delta == null ? `previous ${formatPercent(lastWeek.passRate)}` : `${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)} pts vs ${formatPercent(lastWeek.passRate)}`}
          />
          <StatTile label="Runs" value={thisWeek.runs} hint={`previous ${lastWeek.runs}`} />
          <StatTile label="Failures" value={thisWeek.failed} hint={`previous ${lastWeek.failed}`} />
          <StatTile label="Flaky results" value={thisWeek.flaky} hint={`previous ${lastWeek.flaky}`} />
        </div>
      </Card>

      <Card title="Run reports">
        {runs.length ? (
          <TableWrap>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Run</th>
                  <th>Status</th>
                  <th>Environment</th>
                  <th className="num">Pass rate</th>
                  <th className="num">Failed</th>
                  <th className="num">Duration</th>
                  <th>Export</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <Link href={`/reports/${e.id}`} className="text-accent hover:underline">
                        {e.suite ?? 'run'} · {formatDateTime(e.started_at ?? e.created_at)}
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={e.status} />
                    </td>
                    <td>{e.environment_key ?? '—'}</td>
                    <td className="num">{formatPercent(passRate(e.passed, e.passed + e.failed + e.flaky))}</td>
                    <td className="num">{e.failed}</td>
                    <td className="num">{formatDuration(e.duration_ms)}</td>
                    <td>
                      <a className="text-accent hover:underline" href={`/api/reports/${e.id}/csv`}>
                        CSV
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <EmptyState title="No finished runs yet" />
        )}
      </Card>
    </>
  );
}
