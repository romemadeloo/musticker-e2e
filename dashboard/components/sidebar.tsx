'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CalendarClock,
  FileText,
  FlaskConical,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  PlayCircle,
  Server,
  Settings
} from 'lucide-react';
import type { Project } from '@/lib/types';
import { selectProject, signOut } from '@/app/(app)/actions';

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/suites', label: 'Test suites', icon: FlaskConical },
  { href: '/cases', label: 'Test cases', icon: ListChecks },
  { href: '/executions', label: 'Executions', icon: PlayCircle },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/scheduler', label: 'Scheduler', icon: CalendarClock },
  { href: '/environments', label: 'Environments', icon: Server },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function Sidebar({ projects, currentId, email }: { projects: Project[]; currentId: string; email: string }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <aside className="border-b border-line bg-surface md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-r md:border-b-0">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-accent text-xs font-bold text-white">PW</div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">QA Dashboard</div>
          <div className="truncate text-xs text-muted">Playwright</div>
        </div>
      </div>

      <form action={selectProject} className="px-4 pb-3">
        <label className="label" htmlFor="project-select">
          Project
        </label>
        <select
          id="project-select"
          name="projectId"
          defaultValue={currentId}
          className="input w-full"
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </form>

      <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium ${
              isActive(href) ? 'bg-surface-2 text-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <Icon size={16} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>

      <div className="hidden border-t border-line px-4 py-3 md:block">
        <div className="truncate text-xs text-muted" title={email}>
          {email}
        </div>
        <form action={signOut}>
          <button className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink" type="submit">
            <LogOut size={13} aria-hidden /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
