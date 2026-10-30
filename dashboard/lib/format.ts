export function formatDuration(ms: number | null | undefined): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms} ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

const dateTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Seoul',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—';
  return `${dateTime.format(new Date(value))} KST`;
}

export function formatRelative(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(Math.abs(diff) / 60_000);
  if (mins < 1) return 'just now';
  const text = mins < 60 ? `${mins}m` : mins < 1440 ? `${Math.round(mins / 60)}h` : `${Math.round(mins / 1440)}d`;
  return diff < 0 ? `in ${text}` : `${text} ago`;
}

// Pass rate excludes skipped tests: a skip is neither a pass nor a failure.
export function passRate(passed: number, executed: number): number | null {
  return executed > 0 ? Math.round((passed / executed) * 1000) / 10 : null;
}

export function formatPercent(value: number | null): string {
  return value == null ? '—' : `${value}%`;
}

export function csvEscape(value: unknown): string {
  const text = value == null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
