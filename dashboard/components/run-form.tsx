'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { BROWSER_PROJECTS, ENVIRONMENT_KEYS, SUITES } from '@/lib/constants';

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Dispatching…' : label}
    </button>
  );
}

// Shared by "Run tests" and the schedule editor. Values map 1:1 to manual-playwright.yml inputs.
export function RunFields({
  defaults,
  idPrefix = ''
}: {
  defaults: { environment?: string; suite?: string; browser_project?: string; custom_grep?: string | null };
  idPrefix?: string;
}) {
  const [environment, setEnvironment] = useState(defaults.environment ?? 'qa');
  const [suite, setSuite] = useState(defaults.suite ?? 'smoke');

  return (
    <>
      <div>
        <label className="label" htmlFor={`${idPrefix}environment`}>
          Environment
        </label>
        <select id={`${idPrefix}environment`} name="environment" value={environment} onChange={(e) => setEnvironment(e.target.value)} className="input w-full">
          {ENVIRONMENT_KEYS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor={`${idPrefix}suite`}>
          Suite
        </label>
        <select id={`${idPrefix}suite`} name="suite" value={suite} onChange={(e) => setSuite(e.target.value)} className="input w-full">
          {SUITES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor={`${idPrefix}browser_project`}>
          Browser project
        </label>
        <select id={`${idPrefix}browser_project`} name="browser_project" defaultValue={defaults.browser_project ?? 'chromium-desktop'} className="input w-full">
          {BROWSER_PROJECTS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor={`${idPrefix}custom_grep`}>
          Custom grep {suite !== 'custom-grep' && <span className="text-muted">(custom-grep only)</span>}
        </label>
        <input
          id={`${idPrefix}custom_grep`}
          name="custom_grep"
          defaultValue={defaults.custom_grep ?? ''}
          placeholder="@cart|@validation"
          required={suite === 'custom-grep'}
          disabled={suite !== 'custom-grep'}
          className="input w-full font-mono"
        />
      </div>
      {environment === 'production' && (
        <p className="text-xs text-warning-text md:col-span-full">
          Production: the workflow excludes @payment, @slow and @destructive, and destructive specs refuse production regardless.
        </p>
      )}
    </>
  );
}

export function RunForm({ action, defaults }: { action: (fd: FormData) => Promise<void>; defaults: Parameters<typeof RunFields>[0]['defaults'] }) {
  return (
    <form action={action} className="grid items-end gap-3 p-4 md:grid-cols-5">
      <RunFields defaults={defaults} />
      <div>
        <Submit label="Dispatch run" />
      </div>
    </form>
  );
}
