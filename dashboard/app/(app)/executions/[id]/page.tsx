import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { Card, EmptyState, Notice, PageHeader, ResultBar, StatTile, TableWrap, TextLink } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { formatDateTime, formatDuration, formatPercent, passRate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { Execution, TestCase, TestResult } from '@/lib/types';
import { cancelExecution, deleteExecution } from '../actions';

export const dynamic = 'force-dynamic';

type Row = TestResult & { test_cases: Pick<TestCase, 'id' | 'case_id' | 'title' | 'file' | 'line'> | null };

const ORDER: Record<string, number> = { failed: 0, timedOut: 0, interrupted: 1, flaky: 2, passed: 3, skipped: 4 };
const FILTERS = [
  { key: '', label: 'All' },
  { key: 'failed', label: 'Failed' },
  { key: 'flaky', label: 'Flaky' },
  { key: 'passed', label: 'Passed' },
  { key: 'skipped', label: 'Skipped' }
];

export default async function ExecutionDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ show?: string; dispatched?: string }>;
}) {
  const { id } = await params;
  const { show = '', dispatched } = await searchParams;
  const supabase = await createClient();
  const { data: execution } = await supabase.from('executions').select('*').eq('id', id).maybeSingle<Execution>();
  if (!execution) notFound();

  const { data } = await supabase
    .from('test_results')
    .select('*, test_cases(id,case_id,title,file,line)')
    .eq('execution_id', id)
    .limit(5000);
  const all = ((data ?? []) as Row[]).sort(
    (a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9) || (a.test_cases?.case_id ?? '').localeCompare(b.test_cases?.case_id ?? '')
  );
  const matches = (r: Row) =>
    !show || (show === 'failed' ? ['failed', 'timedOut', 'interrupted'].includes(r.status) : r.status === show);
  const results = all.filter(matches);
  const active = execution.status === 'queued' || execution.status === 'running';

  return (
    <>
      <div className="mb-2 text-sm">
        <TextLink href="/executions">← Executions</TextLink>
      </div>
      <PageHeader
        title={`${execution.suite ?? 'Run'} on ${execution.environment_key ?? 'unknown'}`}
        description={`${execution.browser_project ?? ''} · ${execution.trigger} · ${formatDateTime(execution.started_at ?? execution.created_at)}`}
        actions={
          <>
            {execution.ci_run_url && (
              <a className="btn" href={execution.ci_run_url} target="_blank" rel="noreferrer">
                CI run <ExternalLink size={13} aria-hidden />
              </a>
            )}
            {execution.report_url && (
              <a className="btn" href={execution.report_url} target="_blank" rel="noreferrer">
                HTML report <ExternalLink size={13} aria-hidden />
              </a>
            )}
            <Link className="btn" href={`/reports/${execution.id}`}>
              Report
            </Link>
            {active && (
              <form action={cancelExecution}>
                <input type="hidden" name="id" value={execution.id} />
                <button className="btn" type="submit">
                  Mark cancelled
                </button>
              </form>
            )}
          </>
        }
      />

      {dispatched && active && (
        <Notice>
          Dispatched to GitHub Actions. The run fills in here once the workflow starts and the reporter checks in — refresh to update.
        </Notice>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <StatTile label="Status" value={<StatusBadge status={execution.status} />} hint={execution.shards_total > 1 ? `${execution.shards_done}/${execution.shards_total} shards` : undefined} />
        <StatTile label="Pass rate" value={formatPercent(passRate(execution.passed, execution.passed + execution.failed + execution.flaky))} />
        <StatTile label="Passed" value={execution.passed} />
        <StatTile label="Failed" value={execution.failed} />
        <StatTile label="Flaky" value={execution.flaky} />
        <StatTile label="Duration" value={formatDuration(execution.duration_ms)} hint={`${execution.skipped} skipped`} />
      </div>

      <Card className="mb-6">
        <div className="grid gap-x-8 gap-y-2 p-4 text-sm md:grid-cols-2">
          <Meta label="Branch" value={execution.branch} />
          <Meta label="Commit" value={execution.commit_sha?.slice(0, 10)} mono />
          <Meta label="Grep" value={execution.grep} mono />
          <Meta label="External ID" value={execution.external_id} mono />
          <div className="md:col-span-2">
            <ResultBar passed={execution.passed} flaky={execution.flaky} failed={execution.failed} skipped={execution.skipped} />
          </div>
        </div>
      </Card>

      <Card
        title={`Results (${results.length})`}
        actions={
          <nav className="flex flex-wrap gap-1 text-xs">
            {FILTERS.map((f) => (
              <Link
                key={f.key}
                href={f.key ? `/executions/${id}?show=${f.key}` : `/executions/${id}`}
                className={`rounded px-2 py-1 ${show === f.key ? 'bg-[var(--surface-2)] font-semibold' : 'text-ink-2 hover:bg-[var(--surface-2)]'}`}
              >
                {f.label}
              </Link>
            ))}
          </nav>
        }
      >
        {results.length ? (
          <TableWrap>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Result</th>
                  <th>Test</th>
                  <th>Browser</th>
                  <th className="num">Retries</th>
                  <th className="num">Duration</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td className="whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </td>
                    <td>
                      <Link href={`/cases/${r.test_case_id}`} className="hover:underline">
                        {r.test_cases?.case_id && <span className="mr-1.5 font-mono text-xs text-muted">{r.test_cases.case_id}</span>}
                        {r.test_cases?.title ?? 'Unknown test'}
                      </Link>
                      <div className="font-mono text-xs text-muted">
                        {r.test_cases?.file}
                        {r.test_cases?.line ? `:${r.test_cases.line}` : ''}
                      </div>
                      {r.error_message && (
                        <details className="mt-1.5">
                          <summary className="cursor-pointer text-xs text-critical-text">
                            {r.error_message.split('\n')[0].slice(0, 160)}
                          </summary>
                          <pre className="mt-1 max-h-80 overflow-auto rounded bg-[var(--surface-2)] p-2 font-mono text-xs whitespace-pre-wrap">
                            {r.error_stack ?? r.error_message}
                          </pre>
                        </details>
                      )}
                      {r.attachments.length > 0 && (
                        <div className="mt-1 text-xs text-muted">Attachments: {r.attachments.map((a) => a.name).join(', ')}</div>
                      )}
                    </td>
                    <td className="text-ink-2">{r.browser_project}</td>
                    <td className="num">{r.retries}</td>
                    <td className="num">{formatDuration(r.duration_ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <EmptyState title={active ? 'Waiting for results…' : 'No results in this view'} />
        )}
      </Card>

      <details className="no-print mt-6 text-sm">
        <summary className="cursor-pointer text-xs text-muted">Delete this execution</summary>
        <form action={deleteExecution} className="mt-2">
          <input type="hidden" name="id" value={execution.id} />
          <button className="btn btn-danger" type="submit">
            Delete execution and its results
          </button>
        </form>
      </details>
    </>
  );
}

function Meta({ label, value, mono }: { label: string; value: string | null | undefined; mono?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className="w-24 shrink-0 text-muted">{label}</span>
      <span className={`min-w-0 break-all ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</span>
    </div>
  );
}
