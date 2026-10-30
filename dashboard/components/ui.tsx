import Link from 'next/link';

export function PageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, actions, children, className = '' }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatTile({ label, value, hint }: { label: string; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="card px-4 py-3">
      <div className="text-xs font-medium text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-2">{hint}</div>}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="px-6 py-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-md text-sm text-ink-2">{children}</div>}
    </div>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
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
    <Link href={href} className="text-accent hover:underline">
      {children}
    </Link>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'error' | 'success'; children: React.ReactNode }) {
  const color = tone === 'error' ? 'text-critical-text' : tone === 'success' ? 'text-good-text' : 'text-ink-2';
  return <div className={`card mb-4 px-4 py-3 text-sm ${color}`}>{children}</div>;
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
      className="flex h-2 w-full min-w-24 gap-[2px] overflow-hidden rounded"
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
