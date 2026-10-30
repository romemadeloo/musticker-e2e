export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  repo_url: string | null;
  created_at: string;
};

export type Environment = {
  id: string;
  project_id: string;
  key: string;
  name: string;
  base_url: string | null;
  api_url: string | null;
  admin_url: string | null;
  is_production: boolean;
  description: string | null;
  last_health_status: number | null;
  last_health_latency_ms: number | null;
  last_health_checked_at: string | null;
};

export type TestSuite = {
  id: string;
  project_id: string;
  file: string;
  title: string;
  area: string | null;
  tags: string[];
  test_count: number;
  updated_at: string;
};

export type CaseStatus = 'active' | 'quarantined' | 'retired';

export type TestCase = {
  id: string;
  project_id: string;
  suite_id: string | null;
  case_id: string | null;
  title: string;
  full_title: string;
  file: string;
  line: number | null;
  tags: string[];
  status: CaseStatus;
  notes: string | null;
  last_status: ResultStatus | null;
  last_run_at: string | null;
};

export type ExecutionStatus =
  | 'queued'
  | 'running'
  | 'passed'
  | 'failed'
  | 'flaky'
  | 'interrupted'
  | 'timedout'
  | 'cancelled';

export type Execution = {
  id: string;
  project_id: string;
  external_id: string | null;
  environment_key: string | null;
  browser_project: string | null;
  suite: string | null;
  grep: string | null;
  trigger: 'ci' | 'schedule' | 'manual' | 'local';
  schedule_id: string | null;
  status: ExecutionStatus;
  branch: string | null;
  commit_sha: string | null;
  ci_run_url: string | null;
  report_url: string | null;
  started_at: string | null;
  finished_at: string | null;
  duration_ms: number | null;
  total: number;
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
  shards_total: number;
  shards_done: number;
  reporter_status: string | null;
  created_at: string;
};

export type ResultStatus = 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted' | 'flaky';

export type TestResult = {
  id: string;
  execution_id: string;
  test_case_id: string;
  browser_project: string;
  status: ResultStatus;
  retries: number;
  duration_ms: number;
  error_message: string | null;
  error_stack: string | null;
  attachments: { name: string; contentType: string; path?: string }[];
  annotations: { type: string; description?: string }[];
  created_at: string;
};

export type Schedule = {
  id: string;
  project_id: string;
  name: string;
  cron: string;
  timezone: string;
  environment_key: string;
  suite: string;
  browser_project: string;
  custom_grep: string | null;
  enabled: boolean;
  last_run_at: string | null;
  last_execution_id: string | null;
  created_at: string;
};

export type Settings = {
  project_id: string;
  github_owner: string | null;
  github_repo: string | null;
  github_workflow: string;
  github_ref: string;
  default_environment: string;
  default_browser: string;
  retention_days: number;
  notify_on_failure: boolean;
};

export type DailyStat = {
  project_id: string;
  environment_key: string | null;
  day: string;
  runs: number;
  tests: number;
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
  avg_duration_ms: number | null;
};

export type CaseStat = {
  test_case_id: string;
  project_id: string;
  case_id: string | null;
  title: string;
  file: string;
  suite_id: string | null;
  runs: number;
  passed: number;
  failed: number;
  flaky: number;
  avg_duration_ms: number | null;
};
