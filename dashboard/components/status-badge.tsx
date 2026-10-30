import { CheckCircle2, CircleDashed, CircleSlash, Clock, Loader2, TriangleAlert, XCircle } from 'lucide-react';

type Tone = 'good' | 'warning' | 'critical' | 'neutral' | 'info';

const map: Record<string, { tone: Tone; label: string; icon: typeof CheckCircle2 }> = {
  passed: { tone: 'good', label: 'Passed', icon: CheckCircle2 },
  failed: { tone: 'critical', label: 'Failed', icon: XCircle },
  timedOut: { tone: 'critical', label: 'Timed out', icon: Clock },
  timedout: { tone: 'critical', label: 'Timed out', icon: Clock },
  interrupted: { tone: 'critical', label: 'Interrupted', icon: CircleSlash },
  flaky: { tone: 'warning', label: 'Flaky', icon: TriangleAlert },
  skipped: { tone: 'neutral', label: 'Skipped', icon: CircleDashed },
  cancelled: { tone: 'neutral', label: 'Cancelled', icon: CircleSlash },
  queued: { tone: 'info', label: 'Queued', icon: Clock },
  running: { tone: 'info', label: 'Running', icon: Loader2 },
  active: { tone: 'good', label: 'Active', icon: CheckCircle2 },
  quarantined: { tone: 'warning', label: 'Quarantined', icon: TriangleAlert },
  retired: { tone: 'neutral', label: 'Retired', icon: CircleSlash }
};

const pill: Record<Tone, string> = {
  good: 'bg-[var(--good-soft)] text-good-text',
  warning: 'bg-[var(--warning-soft)] text-warning-text',
  critical: 'bg-[var(--critical-soft)] text-critical-text',
  neutral: 'bg-[var(--surface-2)] text-[var(--muted)]',
  info: 'bg-[var(--accent-soft)] text-accent'
};

// Status is always icon + label in a tinted pill, never color alone.
export function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return <span className="text-muted">—</span>;
  const entry = map[status] ?? { tone: 'neutral' as Tone, label: status, icon: CircleDashed };
  const Icon = entry.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-bold whitespace-nowrap ${pill[entry.tone]}`}>
      <Icon size={14} className={status === 'running' ? 'animate-spin' : ''} aria-hidden />
      {entry.label}
    </span>
  );
}
