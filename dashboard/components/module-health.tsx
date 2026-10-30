import Link from 'next/link';
import { CheckCircle2, TriangleAlert, XCircle } from 'lucide-react';
import { EmptyState } from './ui';
import { formatDuration, formatPercent, formatRelative } from '@/lib/format';
import { rateTone, type ModuleStat } from '@/lib/modules';

const toneColor = { good: 'var(--good)', warning: 'var(--warning)', critical: 'var(--critical)', neutral: 'var(--axis)' } as const;
const toneText = { good: 'text-good-text', warning: 'text-warning-text', critical: 'text-critical-text', neutral: 'text-[var(--muted)]' } as const;
const toneIcon = { good: CheckCircle2, warning: TriangleAlert, critical: XCircle, neutral: CheckCircle2 } as const;

// Dashboard grid: one progress ring per module, the pass rate in the middle.
export function ModuleRings({ modules }: { modules: ModuleStat[] }) {
  if (modules.length === 0) return <EmptyState title="No module results yet">Modules appear once runs report tests with MS-&lt;MODULE&gt;-### IDs.</EmptyState>;
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <ul className="grid grid-cols-2 gap-3 px-4 pb-5 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {modules.map((m, i) => {
        const tone = rateTone(m.rate);
        // The icon matches the label (failures, flakes, or all clear); the color carries the band.
        const Icon = m.failed ? XCircle : m.flaky ? TriangleAlert : CheckCircle2;
        return (
          <li key={m.code} className="animate-rise" style={{ ['--i' as string]: i }}>
            <Link
              href={m.href}
              className="tile flex h-full flex-col items-center !p-4 text-center hover:bg-[var(--surface-2)]"
              title={`${m.label}: ${m.passed} passed, ${m.failed} failed, ${m.flaky} flaky`}
            >
              <div className="relative h-[76px] w-[76px]">
                <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90" aria-hidden>
                  <circle cx="38" cy="38" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="7" />
                  <circle
                    cx="38"
                    cy="38"
                    r={r}
                    fill="none"
                    stroke={toneColor[tone]}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - (m.rate ?? 0) / 100)}
                    className="ring-fill"
                    style={{ ['--c' as string]: c }}
                  />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-[15px] font-extrabold">{m.rate == null ? '—' : `${Math.round(m.rate)}%`}</span>
              </div>
              <span className="tag mt-3">{m.code}</span>
              <span className="mt-1.5 line-clamp-2 text-[13px] leading-snug font-bold">{m.label}</span>
              <span className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${toneText[tone]}`}>
                <Icon size={12} aria-hidden />
                {m.failed ? `${m.failed} failed` : m.flaky ? `${m.flaky} flaky` : `${m.tests} tests`}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// Analytics table: every module with a pass-rate bar and its failure counts.
export function ModuleTable({ modules }: { modules: ModuleStat[] }) {
  if (modules.length === 0) return <EmptyState title="No module results in this range" />;
  return (
    <ul className="space-y-1 px-3 pb-4">
      {modules.map((m) => {
        const tone = rateTone(m.rate);
        const Icon = toneIcon[tone];
        return (
          <li key={m.code}>
            <Link href={m.href} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 rounded-2xl px-3 py-3 transition-colors hover:bg-[var(--surface-2)] md:grid-cols-[minmax(200px,1.2fr)_2fr_auto]">
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="tag">{m.code}</span>
                  <span className="truncate text-sm font-bold">{m.label}</span>
                </span>
                <span className="mt-0.5 block text-xs text-[var(--muted)]">
                  {m.tests} tests · {m.results} results · avg {formatDuration(m.avg_duration_ms)} · {formatRelative(m.last_run_at)}
                </span>
              </span>
              <span className="col-span-2 row-start-2 h-2.5 overflow-hidden rounded-full bg-[var(--surface-2)] md:col-span-1 md:row-start-auto">
                <span className="bar-grow block h-full rounded-full" style={{ width: `${m.rate ?? 0}%`, background: toneColor[tone] }} />
              </span>
              <span className="text-right">
                <span className={`inline-flex items-center gap-1 text-[15px] font-extrabold ${toneText[tone]}`}>
                  <Icon size={14} aria-hidden />
                  {formatPercent(m.rate)}
                </span>
                <span className="block text-xs whitespace-nowrap text-[var(--muted)]">
                  {m.failed} failed · {m.flaky} flaky
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
