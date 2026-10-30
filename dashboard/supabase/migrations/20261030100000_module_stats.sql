-- Pass rate per workbook module. The module is the case ID prefix (MS-AUTH-012 → AUTH, see
-- docs/CONVENTIONS.md); a test without a case ID falls back to its folder (storefront/cart → cart).
-- Counts the final attempt of every test result in finished runs since p_since, optionally for one
-- environment. security invoker, so RLS on the underlying tables still applies.
create or replace function public.module_stats(p_project_id uuid, p_since timestamptz, p_environment text default null)
returns table (
  module text,
  tests bigint,
  results bigint,
  passed bigint,
  failed bigint,
  flaky bigint,
  skipped bigint,
  avg_duration_ms integer,
  last_run_at timestamptz
)
language sql
stable
security invoker
as $$
  select
    coalesce(substring(c.case_id from '^MS-([A-Z]+)-'), nullif(regexp_replace(coalesce(s.area, ''), '^.*/', ''), ''), 'other') as module,
    count(distinct c.id) as tests,
    count(r.id) as results,
    count(r.id) filter (where r.status = 'passed') as passed,
    count(r.id) filter (where r.status in ('failed', 'timedOut', 'interrupted')) as failed,
    count(r.id) filter (where r.status = 'flaky') as flaky,
    count(r.id) filter (where r.status = 'skipped') as skipped,
    (avg(r.duration_ms) filter (where r.status <> 'skipped'))::integer as avg_duration_ms,
    max(r.created_at) as last_run_at
  from public.test_results r
  join public.executions e on e.id = r.execution_id
  join public.test_cases c on c.id = r.test_case_id
  left join public.test_suites s on s.id = c.suite_id
  where e.project_id = p_project_id
    and e.status not in ('queued', 'running', 'cancelled')
    and r.created_at >= p_since
    and (p_environment is null or e.environment_key = p_environment)
  group by 1;
$$;
