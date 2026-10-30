import Link from 'next/link';
import { StatusBadge } from './status-badge';
import { ResultBar, TableWrap } from './ui';
import { formatDuration, formatRelative } from '@/lib/format';
import type { Execution } from '@/lib/types';

export function ExecutionsTable({ executions, compact = false }: { executions: Execution[]; compact?: boolean }) {
  return (
    <TableWrap>
      <table className="data-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Run</th>
            <th>Environment</th>
            {!compact && <th>Browser</th>}
            {!compact && <th>Trigger</th>}
            <th className="w-40">Results</th>
            <th className="num">Tests</th>
            <th className="num">Duration</th>
            <th className="num">Started</th>
          </tr>
        </thead>
        <tbody>
          {executions.map((e) => (
            <tr key={e.id}>
              <td>
                <StatusBadge status={e.status} />
              </td>
              <td>
                <Link href={`/executions/${e.id}`} className="font-medium text-accent hover:underline">
                  {e.suite ?? 'run'}
                </Link>
                {e.grep && <span className="ml-1.5 tag">{e.grep}</span>}
              </td>
              <td>{e.environment_key ?? '—'}</td>
              {!compact && <td className="text-ink-2">{e.browser_project ?? '—'}</td>}
              {!compact && <td className="text-ink-2 capitalize">{e.trigger}</td>}
              <td className="align-middle">
                <ResultBar passed={e.passed} flaky={e.flaky} failed={e.failed} skipped={e.skipped} />
              </td>
              <td className="num">
                {e.failed > 0 ? <span className="text-critical-text">{e.failed} failed</span> : null}
                {e.failed > 0 ? ' / ' : ''}
                {e.total}
              </td>
              <td className="num">{formatDuration(e.duration_ms)}</td>
              <td className="num text-ink-2" title={e.started_at ?? e.created_at}>
                {formatRelative(e.started_at ?? e.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}
