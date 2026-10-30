import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Page banner: title, breadcrumb and actions in a soft card, like the template's page headers.
export function PageHeader({
  title,
  description,
  actions,
  crumbs
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  crumbs?: { href?: string; label: string }[];
}) {
  const trail = crumbs ?? [{ href: '/', label: 'Dashboard' }, { label: title }];
  return (
    <div className="animate-rise relative mb-7 overflow-hidden rounded-[22px] bg-[var(--accent-soft)] px-6 py-6 md:px-8">
      <div aria-hidden className="animate-float pointer-events-none absolute -top-10 -right-6 h-40 w-40 rounded-full bg-[var(--accent)] opacity-[0.12]" />
      <div aria-hidden className="pointer-events-none absolute right-28 -bottom-12 h-28 w-28 rounded-full bg-[#8965e5] opacity-[0.12]" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-extrabold tracking-tight">{title}</h1>
          <nav aria-label="Breadcrumb" className="mt-1.5 flex flex-wrap items-center gap-1 text-sm text-ink-2">
            {trail.map((c, i) => (
              <span key={`${c.label}-${i}`} className="inline-flex items-center gap-1">
                {i > 0 && <ChevronRight size={14} className="text-[var(--muted)]" aria-hidden />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-accent">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-ink">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          {description && <p className="mt-2 max-w-3xl text-sm text-ink-2">{description}</p>}
        </div>
        {actions && <div className="no-print flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ title, actions, children, className = '' }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6 pb-3">
          {title && <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export type Tone = 'rose' | 'violet' | 'green' | 'blue';

// Neutral tile for secondary numbers inside pages.
export function StatTile({ label, value, hint }: { label: string; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="card tile !p-5">
      <div className="text-[13px] font-semibold text-[var(--muted)]">{label}</div>
      <div className="mt-1.5 text-2xl font-extrabold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-2">{hint}</div>}
    </div>
  );
}

// Tinted headline tile with a colored icon square (Sales / Refunds / Earnings pattern).
export function ToneTile({
  tone,
  icon,
  value,
  delta,
  label,
  href
}: {
  tone: Tone;
  icon: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  label: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="tile-icon" style={{ background: `var(--tint-${tone}-icon)` }}>
        {icon}
      </div>
      <div className="mt-8 text-[26px] leading-none font-extrabold tracking-tight">{value}</div>
      {delta && <div className="mt-2.5 text-sm font-semibold text-ink-2">{delta}</div>}
      <div className="mt-3 text-[17px] font-bold text-ink-2">{label}</div>
    </>
  );
  const style = { background: `var(--tint-${tone})` };
  return href ? (
    <Link href={href} className="tile block" style={style}>
      {body}
    </Link>
  ) : (
    <div className="tile" style={style}>
      {body}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-soft)] text-accent" aria-hidden>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 7h18M3 12h12M3 17h8" />
        </svg>
      </div>
      <p className="text-[15px] font-bold">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-md text-sm text-ink-2">{children}</div>}
    </div>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto px-2 pb-3">{children}</div>;
}

export function Tags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <span className="inline-flex flex-wrap gap-1">
      {tags.map((t) => (
        <span key={t} className="tag">
          {t}
        </span>
      ))}
    </span>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-bold text-accent hover:underline">
      {children}
    </Link>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'error' | 'success'; children: React.ReactNode }) {
  const styles =
    tone === 'error'
      ? 'bg-[var(--critical-soft)] text-critical-text'
      : tone === 'success'
        ? 'bg-[var(--good-soft)] text-good-text'
        : 'bg-[var(--accent-soft)] text-ink-2';
  return <div className={`animate-rise mb-5 rounded-2xl px-5 py-3.5 text-sm font-semibold ${styles}`}>{children}</div>;
}

// Passed / flaky / failed / skipped proportions for one run, with a 2px surface gap between segments.
export function ResultBar({ passed, flaky, failed, skipped }: { passed: number; flaky: number; failed: number; skipped: number }) {
  const total = passed + flaky + failed + skipped;
  if (total === 0) return <span className="text-xs text-muted">no results</span>;
  const parts = [
    { n: passed, color: 'var(--good)', label: 'passed' },
    { n: flaky, color: 'var(--warning)', label: 'flaky' },
    { n: failed, color: 'var(--critical)', label: 'failed' },
    { n: skipped, color: 'var(--axis)', label: 'skipped' }
  ].filter((p) => p.n > 0);
  return (
    <div
      className="flex h-2 w-full min-w-24 gap-[2px] overflow-hidden rounded-full"
      role="img"
      aria-label={parts.map((p) => `${p.n} ${p.label}`).join(', ')}
      title={parts.map((p) => `${p.n} ${p.label}`).join(' · ')}
    >
      {parts.map((p) => (
        <div key={p.label} style={{ flexGrow: p.n, background: p.color }} />
      ))}
    </div>
  );
}
