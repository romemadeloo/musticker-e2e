# QA Test Automation and Monitoring

A Next.js app (on Vercel) with a Supabase backend for the Playwright suite in this repository.

| Section | What it shows |
| --- | --- |
| Dashboard | Last run, 7-day pass rate, active cases, flaky count, trends, recent runs, environment status, upcoming schedules |
| Analytics | Pass rate, outcomes and duration over 7/30/90 days per environment; flakiest, most-failing and slowest tests; weakest suites; per-browser stats |
| Projects | One project per Playwright repo (the reporter's `DASHBOARD_PROJECT` slug) |
| Test suites | One per spec file's top-level `describe` (a workbook Sub-Area), with area, tags, count and pass rate |
| Test cases | Every test by `MS-<MODULE>-###` ID: tags, last result, 30-day reliability, history, triage state (active / quarantined / retired) and notes |
| Executions | Every run, filterable; **Run tests** dispatches `manual-playwright.yml`; per-run results with errors and attachments |
| Reports | Week-over-week summary; a printable report per run (new failures vs. the previous run, by-suite table); CSV export |
| Scheduler | Cron schedules (Asia/Seoul by default) that dispatch GitHub Actions runs |
| Environments | production, qa, dev-1 … dev-6 with URLs, 30-day pass rate, last run and an on-demand health check |
| Settings | GitHub dispatch target, defaults, retention, Slack-on-failure, deployment secret status, reporter setup |

## How data gets in

```
playwright test ──► tests/reporters/dashboard-reporter.ts ──POST /api/ingest/runs──► Supabase
                     begin: test catalog + run metadata
                     results: final attempt per test, batches of 50
                     end: run status (last shard settles the run)

Dashboard "Run tests" / Scheduler cron ──► GitHub workflow_dispatch (manual-playwright.yml, dashboard_run_id)
                                            └─► the reporter fills in that queued execution
```

The reporter is already in `playwright.config.ts` and does nothing until `DASHBOARD_URL` and
`DASHBOARD_INGEST_TOKEN` are set. Shards of one GitHub run (same `GITHUB_RUN_ID`) become one execution.
Flaky (passed on retry) counts as *not passed* in pass rates, matching `failOnFlakyTests` on CI.

## Setup

### 1. Supabase

1. Create a project at supabase.com.
2. In **SQL Editor**, run `supabase/migrations/20261030000000_init.sql`, then `supabase/seed.sql`
   (the seed adds the Musticker project, the eight environments and three disabled schedules).
   With the Supabase CLI instead: `npx supabase init`, `npx supabase link --project-ref <ref>`, `npx supabase db push`,
   then run the seed in the SQL editor.
3. **Authentication → Sign In / Providers → Email**: turn off "Allow new users to sign up". Every signed-in user has full
   access (see the RLS policies), so accounts should only be created by an admin under **Authentication → Users**.
4. **Authentication → URL Configuration**: set the Site URL to the Vercel URL and add `<vercel-url>/auth/callback` as a
   redirect URL (for Supabase's emailed links, such as password resets).

### 2. Vercel

1. Import the GitHub repository and set **Root Directory** to `dashboard`. The framework is detected as Next.js.
2. Add the environment variables from `.env.example`:

   | Variable | Where it comes from |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Same page. Server only; never prefix with `NEXT_PUBLIC_` |
   | `DASHBOARD_INGEST_TOKEN` | Any long random string; the same value goes to GitHub and local `.env` |
   | `CRON_SECRET` | Any long random string; Vercel sends it to the cron route |
   | `GITHUB_TOKEN` | Fine-grained PAT, this repo only, **Actions: Read and write** |
   | `SLACK_WEBHOOK_URL` | Optional incoming webhook |
   | `NEXT_PUBLIC_SITE_URL` | The deployment URL |

3. Deploy. `vercel.json` pins the Next.js framework and runs `/api/cron/scheduler` once a day (00:00 KST), the most the
   Hobby plan allows. The 15-minute scheduler resolution comes from `.github/workflows/dashboard-scheduler.yml`, which
   calls the same route with `DASHBOARD_CRON_SECRET`. On a Pro plan you can set the Vercel cron to `*/15 * * * *` and
   drop that workflow.

### 3. GitHub Actions

Add repository secrets `DASHBOARD_URL` (the Vercel URL), `DASHBOARD_INGEST_TOKEN`, and `DASHBOARD_CRON_SECRET` (the
deployment's `CRON_SECRET`). `manual-playwright.yml` already passes the first two, plus `dashboard_run_id` and
`DASHBOARD_SUITE`. To have the other workflows report too, add the same two
`env` entries (and `DASHBOARD_SUITE: <name>`) to them.

In the dashboard, open **Settings** and fill in the GitHub owner, repository, workflow file and ref.

### 4. Local runs

Add `DASHBOARD_URL`, `DASHBOARD_INGEST_TOKEN` and `DASHBOARD_PROJECT` to the repo's `.env`; local runs then appear with
trigger `local`.

## Develop

```bash
cd dashboard
npm install
cp .env.example .env.local   # fill in
npm run dev
npm run typecheck
npm run build
```

## Notes

- The scheduler's environment, suite and browser options mirror `manual-playwright.yml`'s `workflow_dispatch` inputs
  (`lib/constants.ts`). Change both together.
- The cron also marks runs stuck in queued/running for 6 hours as interrupted, and deletes executions older than each
  project's retention.
- Removed or renamed tests stay in the catalog with their history; retire them under Test cases.
- `docs/test-cases.xlsx` remains the source of truth for case steps; the dashboard tracks execution.
