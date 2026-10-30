import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, EmptyState, PageHeader, ResultBar, StatTile, TableWrap, TextLink } from '@/components/ui';
import { PrintButton } from '@/components/print-button';
import { StatusBadge } from '@/components/status-badge';
import { formatDateTime, formatDuration, formatPercent, passRate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { Execution, TestCase, TestResult, TestSuite } from '@/lib/types';

export const dynamic = 'force-dynamic';

type Row = TestResult & { test_cases: Pick<TestCase, 'case_id' | 'title' | 'file' | 'suite_id'> | null };

const isFailure = (s: string) => s === 'failed' || s === 'timedOut' || s === 'interrupted';

export default async function RunReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: execution } = await supabase.from('executions').select('*').eq('id', id).maybeSingle<Execution>();
  if (!execution) notFound();

  const [resultsRes, suitesRes, projectRes, previousRes] = await Promise.all([
    supabase.from('test_results').select('*, test_cases(case_id,title,file,suite_id)').eq('execution_id', id).limit(5000),
    supabase.from('test_suites').select('id,title,area').eq('project_id', execution.project_id),
    supabase.from('projects').select('name').eq('id', execution.project_id).single(),
    // The previous finished run on the same target, for "new failures".
    supabase
      .from('executions')
      .select('id')
      .eq('project_id', execution.project_id)
      .eq('environment_key', execution.environment_key ?? '')
      .eq('suite', execution.suite ?? '')
      .lt('created_at', execution.created_at)
      .not('status', 'in', '(queued,running,cancelled)')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
  ]);

  const results = (resultsRes.data ?? []) as Row[];
  const suites = new Map(((suitesRes.data ?? []) as Pick<TestSuite, 'id' | 'title' | 'area'>[]).map((s) => [s.id, s]));
  const failures = results.filter((r) => isFailure(r.status));
  const flaky = results.filter((r) => r.status === 'flaky');

  let previouslyFailing = new Set<string>();
  if (previousRes.data) {
    const { data: prev } = await supabase
      .from('test_results')
      .select('test_case_id,status')
      .eq('execution_id', previousRes.data.id)
      .in('status', ['failed', 'timedOut', 'interrupted']);
    previouslyFailing = new Set((prev ?? []).map((p) => p.test_case_id as string));
  }
  const newFailures = previousRes.data ? failures.filter((f) => !previouslyFailing.has(f.test_case_id)).length : null;

  const bySuite = new Map<string, { title: string; area: string | null; passed: number; failed: number; flaky: number; skipped: number }>();
  for (const r of results) {
    const suite = r.test_cases?.suite_id ? suites.get(r.test_cases.suite_id) : undefined;
    const key = suite?.id ?? 'none';
    const row = bySuite.get(key) ?? { title: suite?.title ?? 'Unassigned', area: suite?.area ?? null, passed: 0, failed: 0, flaky: 0, skipped: 0 };
    if (isFailure(r.status)) row.failed++;
    else if (r.status === 'flaky') row.flaky++;
    else if (r.status === 'skipped') row.skipped++;
    else row.passed++;
    bySuite.set(key, row);
  }

  return (
    <>
      <div className="no-print mb-2 text-sm">
        <TextLink href="/reports">← Reports</TextLink>
      </div>
      <PageHeader
        title={`Test report — ${projectRes.data?.name ?? ''}`}
        description={`${execution.suite ?? 'run'} on ${execution.environment_key ?? '?'} (${execution.browser_project ?? '?'}) · ${formatDateTime(execution.started_at ?? execution.created_at)}`}
        actions={
          <>
            <PrintButton />
            <a className="btn" href={`/api/reports/${execution.id}/csv`}>
              Download CSV
            </a>
            <Link className="btn" href={`/executions/${execution.id}`}>
              Execution
            </Link>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <StatTile label="Outcome" value={<StatusBadge status={execution.status} />} />
        <StatTile label="Pass rate" value={formatPercent(passRate(execution.passed, execution.passed + execution.failed + execution.flaky))} />
        <StatTile label="Tests" value={execution.total} hint={`${execution.skipped} skipped`} />
        <StatTile label="Failed" value={execution.failed} hint={newFailures == null ? 'no previous run' : `${newFailures} new since last run`} />
        <StatTile label="Flaky" value={execution.flaky} />
        <StatTile label="Duration" value={formatDuration(execution.duration_ms)} />
      </div>
      <div className="mb-6">
        <ResultBar passed={execution.passed} flaky={execution.flaky} failed={execution.failed} skipped={execution.skipped} />
      </div>

      <Card title={`Failures (${failures.length})`} className="mb-6">
        {failures.length ? (
          <ul className="divide-y divide-[var(--border)]">
            {failures.map((r) => (
              <li key={r.id} className="px-4 py-3 text-sm">
                <div className="flex flex-wrap items-baseline gap-2">
                  <StatusBadge status={r.status} />
                  {r.test_cases?.case_id && <span className="font-mono text-xs text-muted">{r.test_cases.case_id}</span>}
                  <span className="font-medium">{r.test_cases?.title}</span>
                  {previousRes.data && !previouslyFailing.has(r.test_case_id) && <span className="tag">new</span>}
                </div>
                <div className="font-mono text-xs text-muted">
                  {r.test_cases?.file} · {r.browser_project}
                </div>
                {r.error_message && <pre className="mt-1.5 font-mono text-xs whitespace-pre-wrap text-critical-text">{r.error_message.slice(0, 800)}</pre>}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No failures" />
        )}
      </Card>

      {flaky.length > 0 && (
        <Card title={`Flaky — passed on retry (${flaky.length})`} className="mb-6">
          <ul className="divide-y divide-[var(--border)]">
            {flaky.map((r) => (
              <li key={r.id} className="px-4 py-2.5 text-sm">
                {r.test_cases?.case_id && <span className="mr-2 font-mono text-xs text-muted">{r.test_cases.case_id}</span>}
                {r.test_cases?.title} <span className="text-xs text-muted">· {r.retries} retries</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="By suite">
        <TableWrap>
          <table className="data-table">
            <thead>
              <tr>
                <th>Suite</th>
                <th className="num">Passed</th>
                <th className="num">Failed</th>
                <th className="num">Flaky</th>
                <th className="num">Skipped</th>
                <th className="num">Pass rate</th>
              </tr>
            </thead>
            <tbody>
              {[...bySuite.values()]
                .sort((a, b) => b.failed - a.failed || a.title.localeCompare(b.title))
                .map((s) => (
                  <tr key={s.title + s.area}>
                    <td>
                      {s.title}
                      {s.area && <span className="ml-1.5 text-xs text-muted">{s.area}</span>}
                    </td>
                    <td className="num">{s.passed}</td>
                    <td className="num">{s.failed}</td>
                    <td className="num">{s.flaky}</td>
                    <td className="num">{s.skipped}</td>
                    <td className="num">{formatPercent(passRate(s.passed, s.passed + s.failed + s.flaky))}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableWrap>
      </Card>
      <p className="mt-4 text-xs text-muted">
        Generated {formatDateTime(new Date())} · commit {execution.commit_sha?.slice(0, 10) ?? '—'} · {execution.branch ?? ''}
      </p>
    </>
  );
}
