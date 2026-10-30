import Link from 'next/link';
import { StatusBadge } from './status-badge';
import { TableWrap, Tags } from './ui';
import { formatDuration, formatRelative } from '@/lib/format';
import type { CaseStat, TestCase } from '@/lib/types';

export function CasesTable({ cases, stats }: { cases: TestCase[]; stats: Map<string, CaseStat> }) {
  return (
    <TableWrap>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Tags</th>
            <th>State</th>
            <th>Last result</th>
            <th className="num">Runs (30d)</th>
            <th className="num">Flaky</th>
            <th className="num">Avg</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => {
            const s = stats.get(c.id);
            return (
              <tr key={c.id}>
                <td className="whitespace-nowrap font-mono text-xs">{c.case_id ?? '—'}</td>
                <td>
                  <Link href={`/cases/${c.id}`} className="text-accent hover:underline">
                    {c.title}
                  </Link>
                  <div className="font-mono text-xs text-muted">
                    {c.file}
                    {c.line ? `:${c.line}` : ''}
                  </div>
                </td>
                <td>
                  <Tags tags={c.tags} />
                </td>
                <td>{c.status === 'active' ? <span className="text-ink-2">Active</span> : <StatusBadge status={c.status} />}</td>
                <td className="whitespace-nowrap">
                  <StatusBadge status={c.last_status} />
                  {c.last_run_at && <div className="text-xs text-muted">{formatRelative(c.last_run_at)}</div>}
                </td>
                <td className="num">{s?.runs ?? 0}</td>
                <td className="num">{s?.flaky ? <span className="text-warning-text">{s.flaky}</span> : 0}</td>
                <td className="num">{formatDuration(s?.avg_duration_ms)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrap>
  );
}
