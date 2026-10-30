'use client';

import { useState } from 'react';
import { CRON_PRESETS } from '@/lib/constants';
import type { Schedule } from '@/lib/types';
import { RunFields } from './run-form';

export function ScheduleForm({ action, schedule }: { action: (fd: FormData) => Promise<void>; schedule?: Schedule }) {
  const [cron, setCron] = useState(schedule?.cron ?? '0 2 * * *');

  return (
    <form action={action} className="grid gap-3 p-4 md:grid-cols-4">
      {schedule && <input type="hidden" name="id" value={schedule.id} />}
      <div className="md:col-span-2">
        <label className="label" htmlFor={`name-${schedule?.id ?? 'new'}`}>
          Name
        </label>
        <input id={`name-${schedule?.id ?? 'new'}`} name="name" required defaultValue={schedule?.name} className="input w-full" placeholder="Nightly smoke on QA" />
      </div>
      <div>
        <label className="label" htmlFor={`cron-${schedule?.id ?? 'new'}`}>
          Cron (min hour day month weekday)
        </label>
        <input
          id={`cron-${schedule?.id ?? 'new'}`}
          name="cron"
          required
          value={cron}
          onChange={(e) => setCron(e.target.value)}
          className="input w-full font-mono"
        />
      </div>
      <div>
        <label className="label" htmlFor={`tz-${schedule?.id ?? 'new'}`}>
          Timezone
        </label>
        <input id={`tz-${schedule?.id ?? 'new'}`} name="timezone" defaultValue={schedule?.timezone ?? 'Asia/Seoul'} className="input w-full" />
      </div>
      <div className="flex flex-wrap gap-1.5 md:col-span-4">
        {CRON_PRESETS.map((p) => (
          <button key={p.cron} type="button" className={`btn text-xs ${cron === p.cron ? 'border-[var(--accent)]' : ''}`} onClick={() => setCron(p.cron)}>
            {p.label}
          </button>
        ))}
      </div>
      <RunFields
        defaults={{
          environment: schedule?.environment_key,
          suite: schedule?.suite,
          browser_project: schedule?.browser_project,
          custom_grep: schedule?.custom_grep
        }}
idPrefix={`${schedule?.id ?? 'new'}-`} />
      <label className="flex items-center gap-2 text-sm md:col-span-3">
        <input type="checkbox" name="enabled" defaultChecked={schedule?.enabled ?? true} /> Enabled
      </label>
      <div className="md:text-right">
        <button className="btn btn-primary" type="submit">
          {schedule ? 'Save changes' : 'Create schedule'}
        </button>
      </div>
    </form>
  );
}
