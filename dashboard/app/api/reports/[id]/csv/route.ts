import { NextResponse } from 'next/server';
import { csvEscape } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { TestCase, TestResult } from '@/lib/types';

type Row = TestResult & { test_cases: Pick<TestCase, 'case_id' | 'title' | 'file' | 'line' | 'tags'> | null };

// Runs as the signed-in user (the middleware already requires a session), so RLS applies.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: execution } = await supabase.from('executions').select('id,suite,environment_key,created_at').eq('id', id).maybeSingle();
  if (!execution) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data } = await supabase
    .from('test_results')
    .select('*, test_cases(case_id,title,file,line,tags)')
    .eq('execution_id', id)
    .limit(5000);

  const header = ['case_id', 'title', 'file', 'line', 'tags', 'browser_project', 'status', 'retries', 'duration_ms', 'error'];
  const lines = ((data ?? []) as Row[]).map((r) =>
    [
      r.test_cases?.case_id,
      r.test_cases?.title,
      r.test_cases?.file,
      r.test_cases?.line,
      r.test_cases?.tags.join(' '),
      r.browser_project,
      r.status,
      r.retries,
      r.duration_ms,
      r.error_message?.split('\n')[0]
    ]
      .map(csvEscape)
      .join(',')
  );

  const name = `report-${execution.suite ?? 'run'}-${execution.environment_key ?? 'env'}-${execution.created_at.slice(0, 10)}.csv`;
  // BOM so Excel opens Korean titles as UTF-8.
  return new NextResponse(`﻿${[header.join(','), ...lines].join('\r\n')}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}"`
    }
  });
}
