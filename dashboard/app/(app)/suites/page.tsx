import Link from 'next/link';
import { Card, EmptyState, PageHeader, TableWrap, Tags } from '@/components/ui';
import { formatPercent, formatRelative, passRate } from '@/lib/format';
import { getCurrentProject } from '@/lib/project';
import { createClient } from '@/lib/supabase/server';
import type { CaseStat, TestSuite } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function SuitesPage({ searchParams }: { searchParams: Promise<{ q?: string; area?: string }> }) {
  const { q = '', area = '' } = await searchParams;
  const { project } = await getCurrentProject();
  const supabase = await createClient();

  const [suitesRes, statsRes] = await Promise.all([
    supabase.from('test_suites').select('*').eq('project_id', project.id).order('area').order('title'),
    supabase.from('v_case_stats').select('suite_id,passed,failed,flaky').eq('project_id', project.id)
  ]);

  const all = (suitesRes.data ?? []) as TestSuite[];
  const areas = [...new Set(all.map((s) => s.area).filter(Boolean))] as string[];
  const needle = q.toLowerCase();
  const suites = all.filter(
    (s) => (!area || s.area === area) && (!needle || s.title.toLowerCase().includes(needle) || s.file.toLowerCase().includes(needle))
  );

  const rate = new Map<string, { passed: number; executed: number }>();
  for (const s of (statsRes.data ?? []) as Pick<CaseStat, 'suite_id' | 'passed' | 'failed' | 'flaky'>[]) {
    if (!s.suite_id) continue;
    const r = rate.get(s.suite_id) ?? { passed: 0, executed: 0 };
    r.passed += Number(s.passed);
    r.executed += Number(s.passed) + Number(s.failed) + Number(s.flaky);
    rate.set(s.suite_id, r);
  }

  return (
    <>
      <PageHeader
        title="Test suites"
        description="One suite per spec file's top-level describe (a workbook Sub-Area), synced from every Playwright run."
      />

      <form className="no-print mb-4 flex flex-wrap items-end gap-3">
        <input name="q" defaultValue={q} placeholder="Search suites or files" className="input w-64" aria-label="Search" />
        <select name="area" defaultValue={area} className="input" aria-label="Area">
          <option value="">All areas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <button className="btn" type="submit">
          Filter
        </button>
      </form>

      <Card>
        {suites.length ? (
          <TableWrap>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Suite</th>
                  <th>Area</th>
                  <th>Tags</th>
                  <th className="num">Tests</th>
                  <th className="num">Pass rate (30d)</th>
                  <th className="num">Synced</th>
                </tr>
              </thead>
              <tbody>
                {suites.map((s) => {
                  const r = rate.get(s.id);
                  return (
                    <tr key={s.id}>
                      <td>
                        <Link href={`/suites/${s.id}`} className="font-medium text-accent hover:underline">
                          {s.title}
                        </Link>
                        <div className="font-mono text-xs text-muted">{s.file}</div>
                      </td>
                      <td>{s.area ?? '—'}</td>
                      <td>
                        <Tags tags={s.tags} />
                      </td>
                      <td className="num">{s.test_count}</td>
                      <td className="num">{formatPercent(r ? passRate(r.passed, r.executed) : null)}</td>
                      <td className="num text-ink-2">{formatRelative(s.updated_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <EmptyState title={all.length ? 'No suites match' : 'No suites yet'}>
            {!all.length && 'Suites appear after the first run that uses the dashboard reporter.'}
          </EmptyState>
        )}
      </Card>
    </>
  );
}
