import { notFound } from 'next/navigation';
import { Card, EmptyState, PageHeader, StatTile, Tags, TextLink } from '@/components/ui';
import { CasesTable } from '@/components/cases-table';
import { formatPercent, passRate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { CaseStat, TestCase, TestSuite } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function SuiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: suite } = await supabase.from('test_suites').select('*').eq('id', id).maybeSingle<TestSuite>();
  if (!suite) notFound();

  const [casesRes, statsRes] = await Promise.all([
    supabase.from('test_cases').select('*').eq('suite_id', id).order('case_id').order('title'),
    supabase.from('v_case_stats').select('*').eq('suite_id', id)
  ]);
  const cases = (casesRes.data ?? []) as TestCase[];
  const stats = new Map(((statsRes.data ?? []) as CaseStat[]).map((s) => [s.test_case_id, s]));
  const agg = [...stats.values()].reduce(
    (a, s) => ({ passed: a.passed + Number(s.passed), failed: a.failed + Number(s.failed), flaky: a.flaky + Number(s.flaky) }),
    { passed: 0, failed: 0, flaky: 0 }
  );

  return (
    <>
      <div className="mb-2 text-sm">
        <TextLink href="/suites">← Test suites</TextLink>
      </div>
      <PageHeader title={suite.title} description={suite.file} />
      <div className="mb-3">
        <Tags tags={suite.tags} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Test cases" value={cases.length} />
        <StatTile label="Pass rate (30d)" value={formatPercent(passRate(agg.passed, agg.passed + agg.failed + agg.flaky))} />
        <StatTile label="Failures (30d)" value={agg.failed} />
        <StatTile label="Flaky (30d)" value={agg.flaky} />
      </div>

      <Card title="Test cases">{cases.length ? <CasesTable cases={cases} stats={stats} /> : <EmptyState title="No cases in this suite" />}</Card>
    </>
  );
}
