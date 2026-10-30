import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { hasBearer } from '@/lib/secrets';
import { notifyFailure } from '@/lib/notify';
import type { Execution, Settings } from '@/lib/types';

// Receives events from tests/reporters/dashboard-reporter.ts in the Playwright repo:
//   begin   → sync the test catalog, create (or join) the execution, return its id
//   results → upsert a batch of final test attempts
//   end     → settle the shard; the last shard settles the run
// Authenticated with DASHBOARD_INGEST_TOKEN; writes with the service role.

export const maxDuration = 60;

type CatalogEntry = {
  file: string;
  title: string;
  fullTitle: string;
  caseId: string | null;
  line: number | null;
  tags: string[];
  suiteTitle: string;
  area: string | null;
};

type BeginEvent = {
  type: 'begin';
  project: string;
  run: {
    executionId?: string | null;
    externalId: string;
    environment: string | null;
    browserProject: string | null;
    suite: string | null;
    grep: string | null;
    trigger: 'ci' | 'local' | 'schedule' | 'manual';
    branch: string | null;
    commitSha: string | null;
    ciRunUrl: string | null;
    reportUrl: string | null;
    shardsTotal: number;
    startedAt: string;
  };
  catalog: CatalogEntry[];
};

type ResultEntry = {
  file: string;
  fullTitle: string;
  browserProject: string;
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted' | 'flaky';
  retries: number;
  durationMs: number;
  errorMessage: string | null;
  errorStack: string | null;
  attachments: { name: string; contentType: string; path?: string }[];
  annotations: { type: string; description?: string }[];
  startedAt: string | null;
};

type ResultsEvent = { type: 'results'; executionId: string; project: string; results: ResultEntry[] };
type EndEvent = { type: 'end'; executionId: string; status: string; finishedAt: string };
type IngestEvent = BeginEvent | ResultsEvent | EndEvent;

const RESULT_STATUSES = new Set(['passed', 'failed', 'timedOut', 'skipped', 'interrupted', 'flaky']);
const RUN_STATUSES = new Set(['passed', 'failed', 'timedout', 'interrupted']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!hasBearer(request, process.env.DASHBOARD_INGEST_TOKEN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let event: IngestEvent;
  try {
    event = (await request.json()) as IngestEvent;
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 });
  }

  const supabase = createAdminClient();
  try {
    switch (event.type) {
      case 'begin':
        return NextResponse.json(await begin(supabase, event));
      case 'results':
        return NextResponse.json(await results(supabase, event));
      case 'end':
        return NextResponse.json(await end(supabase, event));
      default:
        return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error('ingest failed', error);
    return NextResponse.json({ error: message }, { status });
  }
}

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

async function projectId(supabase: SupabaseClient, slug: string): Promise<string> {
  const { data } = await supabase.from('projects').select('id').eq('slug', slug).maybeSingle();
  if (!data) throw new HttpError(404, `No project with slug "${slug}". Create it under Projects first.`);
  return data.id;
}

function chunks<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function begin(supabase: SupabaseClient, event: BeginEvent) {
  const pid = await projectId(supabase, event.project);
  const run = event.run;
  if (!run?.externalId) throw new HttpError(400, 'run.externalId is required');
  const now = new Date().toISOString();

  // Catalog: suites first, then cases pointing at them. Upserts only touch the columns given, so a
  // case's triage state and notes survive every sync.
  const catalog = Array.isArray(event.catalog) ? event.catalog : [];
  const suiteKeys = new Map<string, { project_id: string; file: string; title: string; area: string | null; tags: string[]; updated_at: string }>();
  for (const c of catalog) {
    const key = `${c.file}\u0000${c.suiteTitle}`;
    const suite = suiteKeys.get(key) ?? { project_id: pid, file: c.file, title: c.suiteTitle, area: c.area, tags: [] as string[], updated_at: now };
    // Suite tags are the ones every one of its tests carries (the describe's tags).
    suite.tags = suiteKeys.has(key) ? suite.tags.filter((t) => c.tags.includes(t)) : [...c.tags];
    suiteKeys.set(key, suite);
  }

  const suiteIds = new Map<string, string>();
  for (const batch of chunks([...suiteKeys.values()], 500)) {
    const { data, error } = await supabase.from('test_suites').upsert(batch, { onConflict: 'project_id,file,title' }).select('id,file,title');
    if (error) throw new Error(`suites: ${error.message}`);
    for (const s of data ?? []) suiteIds.set(`${s.file}\u0000${s.title}`, s.id);
  }

  const seen = new Set<string>();
  const caseRows = catalog
    .filter((c) => {
      const key = `${c.file}\u0000${c.fullTitle}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((c) => ({
      project_id: pid,
      suite_id: suiteIds.get(`${c.file}\u0000${c.suiteTitle}`) ?? null,
      case_id: c.caseId,
      title: c.title,
      full_title: c.fullTitle,
      file: c.file,
      line: c.line,
      tags: c.tags,
      updated_at: now
    }));
  for (const batch of chunks(caseRows, 500)) {
    const { error } = await supabase.from('test_cases').upsert(batch, { onConflict: 'project_id,file,full_title' });
    if (error) throw new Error(`cases: ${error.message}`);
  }
  if (catalog.length) await supabase.rpc('refresh_suite_counts', { p_project_id: pid });

  const fields = {
    project_id: pid,
    external_id: run.externalId,
    environment_key: run.environment,
    browser_project: run.browserProject,
    branch: run.branch,
    commit_sha: run.commitSha,
    ci_run_url: run.ciRunUrl,
    report_url: run.reportUrl,
    shards_total: Math.max(1, Number(run.shardsTotal) || 1)
  };

  // A run the dashboard dispatched already has a row; the reporter fills it in.
  if (run.executionId && UUID.test(run.executionId)) {
    const { data } = await supabase
      .from('executions')
      .update({ ...fields, status: 'running', started_at: run.startedAt })
      .eq('id', run.executionId)
      .eq('project_id', pid)
      .is('started_at', null)
      .select('id')
      .maybeSingle();
    if (data) return { executionId: data.id };
    // Started by an earlier shard of the same dispatch: fall through to the external-id lookup.
  }

  // Shards of one CI run share the external id; whichever arrives first creates the row.
  const { error: insertError } = await supabase.from('executions').upsert(
    {
      ...fields,
      suite: run.suite,
      grep: run.grep,
      trigger: run.trigger,
      status: 'running',
      started_at: run.startedAt
    },
    { onConflict: 'project_id,external_id', ignoreDuplicates: true }
  );
  if (insertError) throw new Error(`execution: ${insertError.message}`);

  const { data: existing } = await supabase
    .from('executions')
    .select('id')
    .eq('project_id', pid)
    .eq('external_id', run.externalId)
    .single();
  if (!existing) throw new Error('execution row missing after upsert');
  return { executionId: existing.id };
}

async function results(supabase: SupabaseClient, event: ResultsEvent) {
  if (!UUID.test(event.executionId ?? '')) throw new HttpError(400, 'executionId is required');
  const pid = await projectId(supabase, event.project);
  const entries = (Array.isArray(event.results) ? event.results : []).filter((r) => RESULT_STATUSES.has(r.status));
  if (entries.length === 0) return { stored: 0 };

  const files = [...new Set(entries.map((r) => r.file))];
  const { data: cases, error } = await supabase.from('test_cases').select('id,file,full_title').eq('project_id', pid).in('file', files);
  if (error) throw new Error(`case lookup: ${error.message}`);
  const caseId = new Map((cases ?? []).map((c) => [`${c.file}\u0000${c.full_title}`, c.id as string]));

  const rows = entries
    .map((r) => ({
      execution_id: event.executionId,
      test_case_id: caseId.get(`${r.file}\u0000${r.fullTitle}`),
      browser_project: r.browserProject,
      status: r.status,
      retries: r.retries ?? 0,
      duration_ms: Math.round(r.durationMs ?? 0),
      error_message: r.errorMessage?.slice(0, 4000) ?? null,
      error_stack: r.errorStack?.slice(0, 12000) ?? null,
      attachments: r.attachments ?? [],
      annotations: r.annotations ?? [],
      started_at: r.startedAt,
      created_at: new Date().toISOString()
    }))
    .filter((r) => r.test_case_id);

  const { error: upsertError } = await supabase.from('test_results').upsert(rows, { onConflict: 'execution_id,test_case_id,browser_project' });
  if (upsertError) throw new Error(`results: ${upsertError.message}`);
  return { stored: rows.length, unmatched: entries.length - rows.length };
}

async function end(supabase: SupabaseClient, event: EndEvent) {
  if (!UUID.test(event.executionId ?? '')) throw new HttpError(400, 'executionId is required');
  const status = RUN_STATUSES.has(event.status) ? event.status : 'failed';
  const { data, error } = await supabase.rpc('finish_shard', {
    p_execution_id: event.executionId,
    p_status: status,
    p_finished_at: event.finishedAt ?? new Date().toISOString()
  });
  if (error) throw new Error(`finish: ${error.message}`);

  const execution = data as Execution;
  const settled = execution.shards_done === execution.shards_total;
  if (settled && ['failed', 'timedout', 'interrupted'].includes(execution.status)) {
    const [{ data: settings }, { data: project }] = await Promise.all([
      supabase.from('settings').select('notify_on_failure').eq('project_id', execution.project_id).maybeSingle<Pick<Settings, 'notify_on_failure'>>(),
      supabase.from('projects').select('name').eq('id', execution.project_id).single()
    ]);
    if (settings?.notify_on_failure) await notifyFailure(execution, project?.name ?? 'Playwright');
  }

  return { status: execution.status, settled };
}
