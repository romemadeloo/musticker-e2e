import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, EmptyState, Notice, PageHeader, StatTile, TableWrap, Tags, TextLink } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { CASE_STATUSES } from '@/lib/constants';
import { formatDateTime, formatDuration, formatPercent, passRate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { CaseStat, Execution, TestCase, TestResult, TestSuite } from '@/lib/types';
import { updateCase } from './actions';

export const dynamic = 'force-dynamic';

type ResultRow = TestResult & { executions: Pick<Execution, 'id' | 'environment_key' | 'suite' | 'started_at' | 'created_at' | 'trigger'> | null };

export default async function CaseDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const { saved } = await searchParams;
  const supabase = await createClient();
  const { data: testCase } = await supabase.from('test_cases').select('*').eq('id', id).maybeSingle<TestCase>();
  if (!testCase) notFound();

  const [resultsRes, statRes, suiteRes] = await Promise.all([
    supabase
      .from('test_results')
      .select('*, executions(id,environment_key,suite,started_at,created_at,trigger)')
      .eq('test_case_id', id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('v_case_stats').select('*').eq('test_case_id', id).maybeSingle<CaseStat>(),
    testCase.suite_id ? supabase.from('test_suites').select('id,title').eq('id', testCase.suite_id).maybeSingle<Pick<TestSuite, 'id' | 'title'>>() : null
  ]);
  const results = (resultsRes.data ?? []) as ResultRow[];
  const stat = statRes.data;
  const suite = suiteRes?.data;

  return (
    <>
      <div className="mb-2 text-sm">
        <TextLink href="/cases">← Test cases</TextLink>
      </div>
      <PageHeader title={testCase.title} description={testCase.case_id ?? 'No case ID'} />
      {saved && <Notice tone="success">Saved.</Notice>}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Last result" value={<StatusBadge status={testCase.last_status} />} hint={formatDateTime(testCase.last_run_at)} />
        <StatTile label="Pass rate (30d)" value={formatPercent(stat ? passRate(Number(stat.passed), Number(stat.passed) + Number(stat.failed) + Number(stat.flaky)) : null)} hint={`${stat?.runs ?? 0} runs`} />
        <StatTile label="Flaky (30d)" value={stat?.flaky ?? 0} />
        <StatTile label="Avg duration" value={formatDuration(stat?.avg_duration_ms)} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card title="Details" className="lg:col-span-2">
          <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 p-4 text-sm">
            <dt className="text-muted">Location</dt>
            <dd className="font-mono text-xs break-all">
              {testCase.file}
              {testCase.line ? `:${testCase.line}` : ''}
            </dd>
            <dt className="text-muted">Full title</dt>
            <dd>{testCase.full_title}</dd>
            <dt className="text-muted">Suite</dt>
            <dd>{suite ? <Link href={`/suites/${suite.id}`} className="text-accent hover:underline">{suite.title}</Link> : '—'}</dd>
            <dt className="text-muted">Tags</dt>
            <dd>
              <Tags tags={testCase.tags} />
            </dd>
            <dt className="text-muted">Run locally</dt>
            <dd>
              <code className="block overflow-x-auto rounded bg-[var(--surface-2)] px-2 py-1 font-mono text-xs">
                npx playwright test {testCase.file} -g &quot;{testCase.case_id ?? testCase.title}&quot;
              </code>
            </dd>
          </dl>
        </Card>

        <Card title="Triage">
          <form action={updateCase} className="space-y-3 p-4">
            <input type="hidden" name="id" value={testCase.id} />
            <div>
              <label className="label" htmlFor="status">
                State
              </label>
              <select id="status" name="status" defaultValue={testCase.status} className="input w-full">
                {CASE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="notes">
                Notes (defect link, known issue…)
              </label>
              <textarea id="notes" name="notes" defaultValue={testCase.notes ?? ''} rows={4} className="input w-full" />
            </div>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </form>
        </Card>
      </div>

      <Card title="History (last 50 results)">
        {results.length ? (
          <TableWrap>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Result</th>
                  <th>Run</th>
                  <th>Environment</th>
                  <th>Browser</th>
                  <th className="num">Retries</th>
                  <th className="num">Duration</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="whitespace-nowrap">
                      {r.executions ? (
                        <Link href={`/executions/${r.executions.id}`} className="text-accent hover:underline">
                          {formatDateTime(r.executions.started_at ?? r.executions.created_at)}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{r.executions?.environment_key ?? '—'}</td>
                    <td className="text-ink-2">{r.browser_project}</td>
                    <td className="num">{r.retries}</td>
                    <td className="num">{formatDuration(r.duration_ms)}</td>
                    <td className="max-w-md">
                      {r.error_message && <pre className="line-clamp-3 font-mono text-xs whitespace-pre-wrap text-critical-text">{r.error_message}</pre>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <EmptyState title="No results recorded yet" />
        )}
      </Card>
    </>
  );
}
