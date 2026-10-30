'use client';

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const axisProps = {
  stroke: 'var(--axis)',
  tick: { fill: 'var(--muted)', fontSize: 11 },
  tickLine: false
} as const;

const tooltipProps = {
  contentStyle: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 12,
    color: 'var(--text)'
  },
  labelStyle: { color: 'var(--text-2)', marginBottom: 4 },
  itemStyle: { color: 'var(--text)' }
} as const;

function shortDay(day: string) {
  const [, m, d] = day.split('-');
  return `${Number(m)}/${Number(d)}`;
}

// One measure over days. Single series: the card title names it, so no legend.
export function LineTrend({
  data,
  dataKey,
  unit,
  domain,
  color = 'var(--series-1)',
  label
}: {
  data: Record<string, number | string | null>[];
  dataKey: string;
  unit?: string;
  domain?: [number, number];
  color?: string;
  label: string;
}) {
  if (data.length === 0) return <ChartEmpty />;
  return (
    <div className="h-56 w-full" role="img" aria-label={label}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="day" tickFormatter={shortDay} {...axisProps} />
          <YAxis domain={domain ?? ['auto', 'auto']} unit={unit} width={52} {...axisProps} axisLine={false} />
          <Tooltip
            {...tooltipProps}
            cursor={{ stroke: 'var(--axis)' }}
            formatter={(v) => [`${v}${unit ?? ''}`, label]}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color, stroke: 'var(--surface)', strokeWidth: 2 }}
            activeDot={{ r: 5, stroke: 'var(--surface)', strokeWidth: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Test outcomes per day, stacked. Status colors carry state, the legend carries the label.
export function OutcomeBars({ data }: { data: { day: string; passed: number; flaky: number; failed: number }[] }) {
  if (data.length === 0) return <ChartEmpty />;
  return (
    <div className="h-56 w-full" role="img" aria-label="Test outcomes per day">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: -8 }} barCategoryGap="28%">
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="day" tickFormatter={shortDay} {...axisProps} />
          <YAxis width={52} allowDecimals={false} {...axisProps} axisLine={false} />
          <Tooltip {...tooltipProps} cursor={{ fill: 'var(--surface-2)' }} />
          <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12, color: 'var(--text-2)' }} />
          <Bar dataKey="passed" name="Passed" stackId="a" fill="var(--good)" stroke="var(--surface)" strokeWidth={1} />
          <Bar dataKey="flaky" name="Flaky" stackId="a" fill="var(--warning)" stroke="var(--surface)" strokeWidth={1} />
          <Bar dataKey="failed" name="Failed" stackId="a" fill="var(--critical)" stroke="var(--surface)" strokeWidth={1} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartEmpty() {
  return <div className="grid h-56 place-items-center text-sm text-muted">No finished runs in this range.</div>;
}
