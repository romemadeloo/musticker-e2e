-- Musticker QA dashboard: Playwright runs, the test catalog they report, and the schedules that start them.
--
-- Writes from CI arrive through the dashboard's /api/ingest routes, which use the service role and so
-- bypass RLS. Signed-in dashboard users (Supabase Auth) get full access through the policies below;
-- anonymous visitors get nothing.

create extension if not exists pgcrypto;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  repo_url text,
  created_at timestamptz not null default now()
);

create table public.environments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  key text not null,
  name text not null,
  base_url text,
  api_url text,
  admin_url text,
  is_production boolean not null default false,
  description text,
  last_health_status integer,
  last_health_latency_ms integer,
  last_health_checked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (project_id, key)
);

-- A suite is a spec file's top-level describe, which mirrors a workbook Sub-Area.
create table public.test_suites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  file text not null,
  title text not null,
  area text,
  tags text[] not null default '{}',
  test_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, file, title)
);

-- One row per test, independent of browser project; results carry the browser.
create table public.test_cases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  suite_id uuid references public.test_suites (id) on delete set null,
  case_id text,
  title text not null,
  full_title text not null,
  file text not null,
  line integer,
  tags text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'quarantined', 'retired')),
  notes text,
  last_status text,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, file, full_title)
);
create index test_cases_case_id_idx on public.test_cases (project_id, case_id);

create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  cron text not null,
  timezone text not null default 'Asia/Seoul',
  environment_key text not null,
  suite text not null,
  browser_project text not null default 'chromium-desktop',
  custom_grep text,
  enabled boolean not null default true,
  last_run_at timestamptz,
  last_execution_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.executions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  -- GITHUB_RUN_ID-GITHUB_RUN_ATTEMPT on CI (shared by every shard), E2E_RUN_ID locally.
  external_id text,
  environment_key text,
  browser_project text,
  suite text,
  grep text,
  trigger text not null default 'ci' check (trigger in ('ci', 'schedule', 'manual', 'local')),
  schedule_id uuid references public.schedules (id) on delete set null,
  status text not null default 'queued'
    check (status in ('queued', 'running', 'passed', 'failed', 'flaky', 'interrupted', 'timedout', 'cancelled')),
  branch text,
  commit_sha text,
  ci_run_url text,
  report_url text,
  started_at timestamptz,
  finished_at timestamptz,
  duration_ms integer,
  total integer not null default 0,
  passed integer not null default 0,
  failed integer not null default 0,
  flaky integer not null default 0,
  skipped integer not null default 0,
  shards_total integer not null default 1,
  shards_done integer not null default 0,
  -- Worst run-level status any shard's reporter has sent (interrupted > timedout > failed > passed).
  reporter_status text,
  created_at timestamptz not null default now(),
  unique (project_id, external_id)
);
create index executions_project_created_idx on public.executions (project_id, created_at desc);

alter table public.schedules
  add constraint schedules_last_execution_fk
  foreign key (last_execution_id) references public.executions (id) on delete set null;

-- The final attempt of each test in a run; retries overwrite earlier attempts.
create table public.test_results (
  id uuid primary key default gen_random_uuid(),
  execution_id uuid not null references public.executions (id) on delete cascade,
  test_case_id uuid not null references public.test_cases (id) on delete cascade,
  browser_project text not null,
  status text not null check (status in ('passed', 'failed', 'timedOut', 'skipped', 'interrupted', 'flaky')),
  retries integer not null default 0,
  duration_ms integer not null default 0,
  error_message text,
  error_stack text,
  attachments jsonb not null default '[]',
  annotations jsonb not null default '[]',
  started_at timestamptz,
  created_at timestamptz not null default now(),
  unique (execution_id, test_case_id, browser_project)
);
create index test_results_case_idx on public.test_results (test_case_id, created_at desc);

create table public.settings (
  project_id uuid primary key references public.projects (id) on delete cascade,
  github_owner text,
  github_repo text,
  github_workflow text not null default 'manual-playwright.yml',
  github_ref text not null default 'production',
  default_environment text not null default 'qa',
  default_browser text not null default 'chromium-desktop',
  retention_days integer not null default 90 check (retention_days between 7 and 730),
  notify_on_failure boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Counts come from test_results so shards and re-sent batches can never double count.
create or replace function public.refresh_execution_totals(p_execution_id uuid)
returns void
language sql
as $$
  update public.executions e set
    total = s.total,
    passed = s.passed,
    failed = s.failed,
    flaky = s.flaky,
    skipped = s.skipped
  from (
    select
      count(*) as total,
      count(*) filter (where status = 'passed') as passed,
      count(*) filter (where status in ('failed', 'timedOut', 'interrupted')) as failed,
      count(*) filter (where status = 'flaky') as flaky,
      count(*) filter (where status = 'skipped') as skipped
    from public.test_results
    where execution_id = p_execution_id
  ) s
  where e.id = p_execution_id;
$$;

-- Called once per shard when its reporter finishes. The last shard to finish settles the final
-- status; until then the run stays 'running'. Returns the updated row.
create or replace function public.finish_shard(p_execution_id uuid, p_status text, p_finished_at timestamptz)
returns public.executions
language plpgsql
as $$
declare
  e public.executions;
  rank_of constant jsonb := '{"passed": 1, "failed": 2, "timedout": 3, "interrupted": 4}';
begin
  perform public.refresh_execution_totals(p_execution_id);

  update public.test_cases c set last_status = r.status, last_run_at = r.created_at
  from (
    select distinct on (test_case_id) test_case_id, status, created_at
    from public.test_results
    where execution_id = p_execution_id
    order by test_case_id, created_at desc
  ) r
  where c.id = r.test_case_id;

  update public.executions x set
    shards_done = x.shards_done + 1,
    finished_at = greatest(coalesce(x.finished_at, p_finished_at), p_finished_at),
    reporter_status = case
      when coalesce((rank_of ->> p_status)::int, 0) > coalesce((rank_of ->> x.reporter_status)::int, 0) then p_status
      else x.reporter_status
    end
  where x.id = p_execution_id
  returning * into e;

  if e.shards_done >= e.shards_total then
    update public.executions x set
      status = case
        when e.reporter_status in ('interrupted', 'timedout') then e.reporter_status
        when e.failed > 0 or e.reporter_status = 'failed' then 'failed'
        when e.flaky > 0 then 'flaky'
        else 'passed'
      end,
      duration_ms = (extract(epoch from (e.finished_at - coalesce(e.started_at, e.created_at))) * 1000)::integer
    where x.id = p_execution_id
    returning * into e;
  end if;

  return e;
end;
$$;

-- Test counts per suite from the catalog, so a sharded or grep-filtered run never shrinks them.
create or replace function public.refresh_suite_counts(p_project_id uuid)
returns void
language sql
as $$
  update public.test_suites s set test_count = (
    select count(*) from public.test_cases c where c.suite_id = s.id and c.status <> 'retired'
  )
  where s.project_id = p_project_id;
$$;

-- Per-day roll-up for the analytics and dashboard trend charts (Asia/Seoul days).
create or replace view public.v_daily_stats
with (security_invoker = true) as
select
  project_id,
  environment_key,
  (date_trunc('day', coalesce(started_at, created_at) at time zone 'Asia/Seoul'))::date as day,
  count(*) as runs,
  sum(total) as tests,
  sum(passed) as passed,
  sum(failed) as failed,
  sum(flaky) as flaky,
  sum(skipped) as skipped,
  avg(duration_ms)::integer as avg_duration_ms
from public.executions
where status not in ('queued', 'running')
group by 1, 2, 3;

-- Per-case reliability over the last 30 days.
create or replace view public.v_case_stats
with (security_invoker = true) as
select
  c.id as test_case_id,
  c.project_id,
  c.case_id,
  c.title,
  c.file,
  c.suite_id,
  count(r.id) as runs,
  count(r.id) filter (where r.status = 'passed') as passed,
  count(r.id) filter (where r.status in ('failed', 'timedOut', 'interrupted')) as failed,
  count(r.id) filter (where r.status = 'flaky') as flaky,
  avg(r.duration_ms) filter (where r.status <> 'skipped')::integer as avg_duration_ms
from public.test_cases c
left join public.test_results r
  on r.test_case_id = c.id and r.created_at > now() - interval '30 days'
group by c.id;

-- RLS: signed-in users only.
do $$
declare t text;
begin
  foreach t in array array['projects', 'environments', 'test_suites', 'test_cases', 'schedules', 'executions', 'test_results', 'settings']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "authenticated full access" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
