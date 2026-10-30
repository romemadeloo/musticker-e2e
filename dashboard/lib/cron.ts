import { CronExpressionParser } from 'cron-parser';

export function validateCron(expression: string, timezone: string): string | null {
  try {
    CronExpressionParser.parse(expression, { tz: timezone });
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : 'Invalid cron expression.';
  }
}

export function nextRuns(expression: string, timezone: string, count = 1, from = new Date()): Date[] {
  try {
    const interval = CronExpressionParser.parse(expression, { tz: timezone, currentDate: from });
    return interval.take(count).map((d) => d.toDate());
  } catch {
    return [];
  }
}

// A schedule is due when its most recent occurrence is later than the last time it ran. The Vercel
// cron ticks every 15 minutes, so an occurrence is picked up at most one tick late and never twice.
export function isDue(expression: string, timezone: string, lastRunAt: Date | null, createdAt: Date, now = new Date()): boolean {
  try {
    const previous = CronExpressionParser.parse(expression, { tz: timezone, currentDate: now }).prev().toDate();
    return previous > (lastRunAt ?? createdAt);
  } catch {
    return false;
  }
}
