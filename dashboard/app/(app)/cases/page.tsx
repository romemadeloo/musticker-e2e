import Link from 'next/link';
import { Card, EmptyState, PageHeader } from '@/components/ui';
import { CasesTable } from '@/components/cases-table';
import { CASE_STATUSES } from '@/lib/constants';
import { getCurrentProject } from '@/lib/project';
import { createClient } from '@/lib/supabase/server';
import type { CaseStat, TestCase } from '@/lib/types';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 100;
const RESULT_FILTERS = ['passed', 'failed', 'flaky', 'skipped'] as const;

export default async function CasesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; tag?: string; state?: string; result?: string; page?: string }>
}) {
  const { q = '', tag = '', state = '', result = '', page = '1' } = await searchParams;
  const pageNo = Math.max(1, Number(page) || 1);
  const { project } = await getCurrentProject();
  const supabase = await createClient();

  let query = supabase.from('test_cases').select('*', { count: 'exact' }).eq('project_id', project.id);
  if (q) {
    // Strip PostgREST filter syntax so search text cannot inject extra conditions.
    const term = q.replace(/[,()*%]/g, ' ').trim();
    if (term) query = query.or(`title.ilike.%${term}%,case_id.ilike.%${term}%,file.ilike.%${term}%`);
  }
  if (tag) query = query.contains('tags', [tag.startsWith('@') ? tag : `@${tag}`]);
  if ((CASE_STATUSES as readonly string[]).includes(state)) query = query.eq('status', state);
  if ((RESULT_FILTERS as readonly string[]).includes(result)) {
    query = result === 'failed' ? query.in('last_status', ['failed', 'timedOut', 'interrupted']) : query.eq('last_status', result);
  }

  const { data, count } = await query
    .order('case_id', { ascending: true, nullsFirst: false })
    .order('title')
    .range((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE - 1);
  const cases = (data ?? []) as TestCase[];

  const { data: statRows } = cases.length
    ? await supabase.from('v_case_stats').select('*').in('test_case_id', cases.map((c) => c.id))
    : { data: [] };
  const stats = new Map(((statRows ?? []) as CaseStat[]).map((s) => [s.test_case_id, s]));
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const pageHref = (n: number) => {
    const sp = new URLSearchParams({ q, tag, state, result, page: String(n) });
    return `/cases?${sp.toString()}`;
  };

  return (
    <>
      <PageHeader
        title="Test cases"
        description="Every Playwright test the reporter has seen, keyed by its MS-<MODULE>-### case ID. docs/test-cases.xlsx stays the source of truth for steps."
      />

      <form className="no-print mb-4 flex flex-wrap items-end gap-3">
        <input name="q" defaultValue={q} placeholder="Search ID, title or file" className="input w-64" aria-label="Search" />
        <input name="tag" defaultValue={tag} placeholder="@smoke" className="input w-32" aria-label="Tag" />
        <select name="state" defaultValue={state} className="input" aria-label="State">
          <option value="">Any state</option>
          {CASE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select name="result" defaultValue={result} className="input" aria-label="Last result">
          <option value="">Any last result</option>
          {RESULT_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="btn" type="submit">
          Filter
        </button>
        <span className="text-xs text-muted">{count ?? 0} cases</span>
      </form>

      <Card>{cases.length ? <CasesTable cases={cases} stats={stats} /> : <EmptyState title="No test cases match" />}</Card>

      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-end gap-2 text-sm">
          {pageNo > 1 && (
            <Link className="btn" href={pageHref(pageNo - 1)}>
              Previous
            </Link>
          )}
          <span className="text-muted">
            Page {pageNo} of {pages}
          </span>
          {pageNo < pages && (
            <Link className="btn" href={pageHref(pageNo + 1)}>
              Next
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
