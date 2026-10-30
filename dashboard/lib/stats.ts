import type { DailyStat } from './types';
import { passRate } from './format';

export type DayPoint = {
  day: string;
  runs: number;
  passed: number;
  flaky: number;
  failed: number;
  skipped: number;
  passRate: number | null;
  avgDurationMin: number | null;
};

// Folds per-environment daily rows into one point per day, filling empty days so the x axis is even.
export function toDaySeries(rows: DailyStat[], days: number): DayPoint[] {
  const byDay = new Map<string, DayPoint & { durationWeight: number; durationSum: number }>();

  for (const r of rows) {
    const point = byDay.get(r.day) ?? {
      day: r.day,
      runs: 0,
      passed: 0,
      flaky: 0,
      failed: 0,
      skipped: 0,
      passRate: null,
      avgDurationMin: null,
      durationWeight: 0,
      durationSum: 0
    };
    point.runs += Number(r.runs);
    point.passed += Number(r.passed);
    point.flaky += Number(r.flaky);
    point.failed += Number(r.failed);
    point.skipped += Number(r.skipped);
    if (r.avg_duration_ms != null) {
      point.durationSum += r.avg_duration_ms * Number(r.runs);
      point.durationWeight += Number(r.runs);
    }
    byDay.set(r.day, point);
  }

  const out: DayPoint[] = [];
  const today = seoulToday();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const p = byDay.get(key);
    out.push({
      day: key,
      runs: p?.runs ?? 0,
      passed: p?.passed ?? 0,
      flaky: p?.flaky ?? 0,
      failed: p?.failed ?? 0,
      skipped: p?.skipped ?? 0,
      passRate: p ? passRate(p.passed, p.passed + p.flaky + p.failed) : null,
      avgDurationMin: p && p.durationWeight > 0 ? Math.round((p.durationSum / p.durationWeight / 60_000) * 10) / 10 : null
    });
  }
  return out;
}

export function seoulToday(): Date {
  const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
  return new Date(`${iso}T00:00:00Z`);
}

export function sinceDay(days: number): string {
  const d = seoulToday();
  d.setUTCDate(d.getUTCDate() - (days - 1));
  return d.toISOString().slice(0, 10);
}

export function totals(points: DayPoint[]) {
  const sum = points.reduce(
    (acc, p) => ({ runs: acc.runs + p.runs, passed: acc.passed + p.passed, flaky: acc.flaky + p.flaky, failed: acc.failed + p.failed }),
    { runs: 0, passed: 0, flaky: 0, failed: 0 }
  );
  return { ...sum, passRate: passRate(sum.passed, sum.passed + sum.flaky + sum.failed) };
}
