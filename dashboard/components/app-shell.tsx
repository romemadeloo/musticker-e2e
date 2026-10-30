'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  BarChart3,
  Bell,
  ChevronDown,
  CalendarClock,
  FileText,
  FlaskConical,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  PlayCircle,
  Search,
  Server,
  Settings,
  Sun,
  X
} from 'lucide-react';
import { FOLDED_COOKIE, NAV_COOKIE } from '@/lib/constants';
import type { Project } from '@/lib/types';
import { selectProject, signOut } from '@/app/(app)/actions';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };
type NavGroup = { title: string; icon: typeof LayoutDashboard; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: 'Dashboards',
    icon: LayoutDashboard,
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/reports', label: 'Reports', icon: FileText }
    ]
  },
  {
    title: 'Test management',
    icon: FlaskConical,
    items: [
      { href: '/projects', label: 'Projects', icon: FolderKanban },
      { href: '/suites', label: 'Test suites', icon: FlaskConical },
      { href: '/cases', label: 'Test cases', icon: ListChecks }
    ]
  },
  {
    title: 'Automation',
    icon: PlayCircle,
    items: [
      { href: '/executions', label: 'Executions', icon: PlayCircle },
      { href: '/scheduler', label: 'Scheduler', icon: CalendarClock },
      { href: '/environments', label: 'Environments', icon: Server }
    ]
  },
  {
    title: 'System',
    icon: Settings,
    items: [{ href: '/settings', label: 'Settings', icon: Settings }]
  }
];

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

function Logo() {
  return (
    <svg width="34" height="28" viewBox="0 0 34 28" aria-hidden>
      <path d="M3 24 L11 4 L17 16 L23 4 L31 24" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="3" cy="24" r="3" fill="#8965e5" />
    </svg>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('qa-theme', next);
    } catch {
      // Private mode: the toggle still works for this page view.
    }
  };

  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      {theme === 'dark' ? <Sun size={21} /> : <Moon size={21} />}
    </button>
  );
}

function Avatar({ email, size = 44 }: { email: string; size?: number }) {
  const initials = (email.split('@')[0] || '?')
    .split(/[._-]/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-extrabold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36, background: 'linear-gradient(135deg, #0ea5ff, #8965e5)' }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function AppShell({
  projects,
  currentId,
  email,
  recentFailures,
  initialCollapsed,
  initialFolded,
  children
}: {
  projects: Project[];
  currentId: string;
  email: string;
  recentFailures: number;
  initialCollapsed: boolean;
  initialFolded: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [panelOpen, setPanelOpen] = useState(!initialCollapsed);
  const [folded, setFolded] = useState<Set<string>>(() => new Set(initialFolded));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDrawerOpen(false), [pathname]);

  // Cookies rather than localStorage so the server renders the remembered state on first paint.
  const togglePanel = () =>
    setPanelOpen((open) => {
      writeCookie(NAV_COOKIE, open ? 'collapsed' : 'open');
      return !open;
    });
  const toggleGroup = (title: string) =>
    setFolded((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      writeCookie(FOLDED_COOKIE, [...next].join('|'));
      return next;
    });

  // Ctrl/Cmd+B toggles the panel, as in most editors.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b' && window.matchMedia('(min-width: 1024px)').matches) {
        e.preventDefault();
        togglePanel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const activeGroup = groups.find((g) => g.items.some((i) => isActive(pathname, i.href)));

  const panel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-6 pt-6 pb-2">
        <Link href="/" className="flex items-center gap-3" aria-label="Dashboard home">
          <Logo />
          <span className="text-[17px] font-extrabold tracking-tight">Musticker QA</span>
        </Link>
        <button
          type="button"
          onClick={togglePanel}
          className="icon-btn hidden !h-9 !w-9 lg:grid"
          aria-label="Collapse sidebar"
          title="Collapse sidebar (Ctrl+B)"
        >
          <PanelLeftClose size={19} />
        </button>
        <button type="button" className="icon-btn lg:hidden" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>
      <form action={selectProject} className="px-6 pt-4 pb-2">
        <label className="label text-[12px] tracking-wide text-[var(--muted)] uppercase" htmlFor="project-select">
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
      <nav className="flex-1 overflow-y-auto px-5 pb-4">
        {groups.map((group) => (
          <div key={group.title} className="mt-4">
            <h2>
              <button
                type="button"
                onClick={() => toggleGroup(group.title)}
                aria-expanded={!folded.has(group.title)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-[15px] font-extrabold text-ink transition-colors hover:text-accent"
              >
                <span className="flex items-center gap-2">
                  {group.title}
                  {folded.has(group.title) && group.items.some((i) => isActive(pathname, i.href)) && (
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-label="contains the current page" />
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[var(--muted)] transition-transform duration-300 ${folded.has(group.title) ? '-rotate-90' : ''}`}
                  aria-hidden
                />
              </button>
            </h2>
            <div className="fold" data-open={!folded.has(group.title)}>
              <ul className="space-y-1 overflow-hidden pt-1">
                {group.items.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="nav-link"
                      aria-current={isActive(pathname, href) ? 'page' : undefined}
                      tabIndex={folded.has(group.title) ? -1 : undefined}
                    >
                      <Icon size={20} strokeWidth={1.8} aria-hidden />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </nav>
      <div className="m-4 flex items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-3">
        <Avatar email={email} size={40} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{email.split('@')[0]}</div>
          <div className="truncate text-xs text-[var(--muted)]">{email}</div>
        </div>
        <form action={signOut}>
          <button type="submit" className="icon-btn !h-9 !w-9" aria-label="Sign out" title="Sign out">
            <LogOut size={18} />
          </button>
        </form>
      </div>
    </div>
  );

  const rail = (
    <div className="flex h-full flex-col items-center py-6">
      <Link href="/" aria-label="Dashboard home" className="mb-8">
        <Logo />
      </Link>
      <div className="flex flex-1 flex-col items-center gap-3">
        {groups.map((g) => (
          <div key={g.title} className="group relative">
            <Link href={g.items[0].href} className="rail-link" data-active={activeGroup?.title === g.title} aria-label={g.title}>
              <g.icon size={24} strokeWidth={1.7} />
            </Link>
            {/* The group's pages fly out on hover or keyboard focus. */}
            <div className="flyout card absolute top-0 left-full z-50 ml-3 w-56 p-2">
              <div className="px-3 pt-2 pb-1.5 text-xs font-extrabold tracking-wide text-[var(--muted)] uppercase">{g.title}</div>
              {g.items.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="nav-link !py-2.5 !text-[14px]" aria-current={isActive(pathname, href) ? 'page' : undefined}>
                  <Icon size={18} strokeWidth={1.8} aria-hidden />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={togglePanel} className="rail-link mb-4" aria-label="Expand sidebar" title="Expand sidebar (Ctrl+B)">
        <PanelLeftOpen size={22} strokeWidth={1.7} />
      </button>
      <form action={signOut}>
        <button type="submit" className="rounded-full transition-transform hover:scale-105" title={`Sign out ${email}`} aria-label="Sign out">
          <Avatar email={email} size={44} />
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar: the full panel when open, the icon rail when collapsed. Overflow is only
          clipped while open, so the rail's flyouts can extend past it. */}
      <aside
        className={`sticky top-0 z-40 hidden h-screen shrink-0 border-r border-line bg-[var(--panel)] transition-[width] duration-300 ease-out lg:block ${
          panelOpen ? 'w-[300px] overflow-hidden' : 'w-[92px]'
        }`}
      >
        <div key={panelOpen ? 'panel' : 'rail'} className={`animate-fade h-full ${panelOpen ? 'w-[300px]' : 'w-[92px]'}`}>
          {panelOpen ? panel : rail}
        </div>
      </aside>

      {/* Nav drawer (mobile) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} aria-label="Close menu" />
          <aside className="animate-rise absolute top-0 left-0 h-full w-[300px] max-w-[85vw] bg-[var(--panel)] shadow-2xl">{panel}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="app-header sticky top-0 z-30 flex items-center gap-2 bg-[var(--page)]/85 px-4 py-4 backdrop-blur md:px-8">
          <button
            type="button"
            className="icon-btn"
            aria-label="Toggle navigation"
            onClick={() => (window.matchMedia('(min-width: 1024px)').matches ? togglePanel() : setDrawerOpen(true))}
          >
            <Menu size={22} />
          </button>
          <form action="/cases" className="relative hidden sm:block">
            <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
            <input name="q" placeholder="Search test cases…" aria-label="Search test cases" className="input w-64 rounded-full !pl-10" />
          </form>
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <Link href="/executions?run=1" className="icon-btn" aria-label="Run tests" title="Run tests">
              <Play size={20} />
            </Link>
            <Link
              href="/executions?status=failed"
              className="icon-btn relative"
              aria-label={`${recentFailures} failed runs in the last 24 hours`}
              title={`${recentFailures} failed runs in the last 24 hours`}
            >
              <Bell size={21} />
              {recentFailures > 0 && (
                <span className="animate-pop absolute top-1 right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--critical)] px-1 text-[10px] font-bold text-white">
                  {recentFailures}
                </span>
              )}
            </Link>
            <div className="relative ml-1" ref={menuRef}>
              <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-label="Account menu" className="rounded-full">
                <Avatar email={email} />
              </button>
              {menuOpen && (
                <div className="card animate-rise absolute right-0 mt-3 w-64 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar email={email} size={40} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold">{email.split('@')[0]}</div>
                      <div className="truncate text-xs text-[var(--muted)]">{email}</div>
                    </div>
                  </div>
                  <form action={signOut} className="mt-4">
                    <button type="submit" className="btn w-full justify-center">
                      <LogOut size={16} /> Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 px-4 pt-2 pb-24 md:px-8">
          <div className="mx-auto max-w-[1320px]">{children}</div>
        </main>
      </div>

      <Link href="/settings" className="fab no-print" aria-label="Settings" title="Settings">
        <Settings size={26} />
      </Link>
    </div>
  );
}
