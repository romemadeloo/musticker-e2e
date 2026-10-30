import { CheckCircle2, CircleDashed } from 'lucide-react';
import { Card, Notice, PageHeader } from '@/components/ui';
import { BROWSER_PROJECTS, ENVIRONMENT_KEYS } from '@/lib/constants';
import { getCurrentProject } from '@/lib/project';
import { createClient } from '@/lib/supabase/server';
import type { Settings } from '@/lib/types';
import { saveSettings } from './actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const { project } = await getCurrentProject();
  const supabase = await createClient();
  const { data } = await supabase.from('settings').select('*').eq('project_id', project.id).maybeSingle<Settings>();
  const s: Partial<Settings> = data ?? {};

  // Presence only — secret values never reach the page.
  const deployment = [
    ['SUPABASE_SERVICE_ROLE_KEY', 'CI ingest and the scheduler cron', Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)],
    ['DASHBOARD_INGEST_TOKEN', 'Playwright reporter authentication', Boolean(process.env.DASHBOARD_INGEST_TOKEN)],
    ['GITHUB_TOKEN', 'dispatching runs to GitHub Actions', Boolean(process.env.GITHUB_TOKEN)],
    ['CRON_SECRET', 'Vercel cron authentication', Boolean(process.env.CRON_SECRET)],
    ['SLACK_WEBHOOK_URL', 'failure notifications (optional)', Boolean(process.env.SLACK_WEBHOOK_URL)]
  ] as const;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://<your-dashboard>.vercel.app';

  return (
    <>
      <PageHeader title="Settings" description={`Configuration for ${project.name}.`} />
      {error && <Notice tone="error">{error}</Notice>}
      {saved && <Notice tone="success">Settings saved.</Notice>}

      <form action={saveSettings} className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="GitHub Actions dispatch">
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <Field id="github_owner" label="Owner" defaultValue={s.github_owner} placeholder="your-org" />
            <Field id="github_repo" label="Repository" defaultValue={s.github_repo} placeholder="musticker-playwright" />
            <Field id="github_workflow" label="Workflow file" defaultValue={s.github_workflow ?? 'manual-playwright.yml'} />
            <Field id="github_ref" label="Branch / ref" defaultValue={s.github_ref ?? 'production'} />
            <p className="text-xs text-muted sm:col-span-2">
              The token (GITHUB_TOKEN env var) needs Actions: read &amp; write on this repository. The workflow must accept a
              dashboard_run_id input.
            </p>
          </div>
        </Card>

        <Card title="Defaults and housekeeping">
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="default_environment">
                Default environment
              </label>
              <select id="default_environment" name="default_environment" defaultValue={s.default_environment ?? 'qa'} className="input w-full">
                {ENVIRONMENT_KEYS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="default_browser">
                Default browser project
              </label>
              <select id="default_browser" name="default_browser" defaultValue={s.default_browser ?? 'chromium-desktop'} className="input w-full">
                {BROWSER_PROJECTS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <Field id="retention_days" label="Keep executions for (days)" defaultValue={String(s.retention_days ?? 90)} type="number" />
            <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
              <input type="checkbox" name="notify_on_failure" defaultChecked={s.notify_on_failure ?? false} /> Post failed runs to Slack
            </label>
          </div>
        </Card>
        <div className="lg:col-span-2">
          <button className="btn btn-primary" type="submit">
            Save settings
          </button>
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Deployment secrets">
          <ul className="divide-y divide-[var(--border)]">
            {deployment.map(([key, use, present]) => (
              <li key={key} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <div className="min-w-0">
                  <div className="font-mono text-xs">{key}</div>
                  <div className="text-xs text-muted">{use}</div>
                </div>
                {present ? (
                  <span className="inline-flex items-center gap-1 text-xs text-good-text">
                    <CheckCircle2 size={14} className="text-good" aria-hidden /> Set
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <CircleDashed size={14} aria-hidden /> Not set
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Connect the Playwright suite">
          <div className="space-y-3 p-4 text-sm">
            <p className="text-ink-2">
              tests/reporters/dashboard-reporter.ts is already in playwright.config.ts and does nothing until these are set
              (locally in .env, on CI as Actions secrets):
            </p>
            <pre className="overflow-x-auto rounded bg-[var(--surface-2)] p-3 font-mono text-xs">{`DASHBOARD_URL=${site}
DASHBOARD_INGEST_TOKEN=<same value as on Vercel>
DASHBOARD_PROJECT=${project.slug}`}</pre>
            <p className="text-xs text-muted">
              Each run syncs the test catalog (suites, cases, tags) and uploads every result. Runs sharing GITHUB_RUN_ID are merged, so
              sharded jobs appear as one execution.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

function Field({ id, label, defaultValue, placeholder, type = 'text' }: { id: string; label: string; defaultValue?: string | null; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input id={id} name={id} type={type} defaultValue={defaultValue ?? ''} placeholder={placeholder} className="input w-full" />
    </div>
  );
}
