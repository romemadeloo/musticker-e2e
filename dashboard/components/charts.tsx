'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { Activity, Timer, Zap } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const axisProps = {
  stroke: 'transparent',
  tick: { fill: 'var(--muted)', fontSize: 12, fontWeight: 600 },
  tickLine: false
} as const;

const tooltipProps = {
  contentStyle: {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    fontSize: 12.5,
    fontWeight: 600,
    color: 'var(--text)',
    boxShadow: 'var(--shadow)'
  },
  labelStyle: { color: 'var(--muted)', marginBottom: 4 },
  itemStyle: { color: 'var(--text)' }
} as const;

function shortDay(day: string) {
  const [, m, d] = day.split('-');
  return `${Number(m)}/${Number(d)}`;
}

type Point = Record<string, number | string | null>;

// One measure over days as a smooth gradient area. Single series: the card title names it.
export function LineTrend({
  data,
  dataKey,
  unit,
  domain,
  color = 'var(--series-1)',
  label,
  height = 240
}: {
  data: Point[];
  dataKey: string;
  unit?: string;
  domain?: [number, number];
  color?: string;
  label: string;
  height?: number;
}) {
  const id = useId().replace(/:/g, '');
  if (data.length === 0) return <ChartEmpty height={height} />;
  return (
    <div className="w-full" style={{ height }} role="img" aria-label={label}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="day" tickFormatter={shortDay} {...axisProps} dy={8} />
          <YAxis domain={domain ?? ['auto', 'auto']} unit={unit} width={52} {...axisProps} />
          <Tooltip {...tooltipProps} cursor={{ stroke: 'var(--accent)', strokeDasharray: '4 4' }} formatter={(v) => [`${v}${unit ?? ''}`, label]} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#fill-${id})`}
            dot={false}
            activeDot={{ r: 6, stroke: 'var(--surface)', strokeWidth: 3, fill: color }}
            connectNulls
            animationDuration={1100}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Test outcomes per day, stacked. Status colors carry state, the legend carries the label.
export function OutcomeBars({ data }: { data: { day: string; passed: number; flaky: number; failed: number }[] }) {
  if (data.length === 0) return <ChartEmpty height={240} />;
  return (
    <div className="h-60 w-full" role="img" aria-label="Test outcomes per day">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -12 }} barCategoryGap="32%">
          <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="day" tickFormatter={shortDay} {...axisProps} dy={8} />
          <YAxis width={52} allowDecimals={false} {...axisProps} />
          <Tooltip {...tooltipProps} cursor={{ fill: 'var(--accent-soft)', radius: 8 }} />
          <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)', paddingTop: 8 }} />
          <Bar dataKey="passed" name="Passed" stackId="a" fill="var(--good)" stroke="var(--surface)" strokeWidth={2} animationDuration={900} />
          <Bar dataKey="flaky" name="Flaky" stackId="a" fill="var(--warning)" stroke="var(--surface)" strokeWidth={2} animationDuration={900} />
          <Bar dataKey="failed" name="Failed" stackId="a" fill="var(--critical)" stroke="var(--surface)" strokeWidth={2} radius={[6, 6, 0, 0]} animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// The dashboard's main trend card: a segmented toggle between pass rate and duration, with
// summary figures and a details link underneath.
export function TrendCard({
  data,
  passRate,
  runs,
  avgDuration
}: {
  data: Point[];
  passRate: string;
  runs: number;
  avgDuration: string;
}) {
  const [view, setView] = useState<'rate' | 'duration'>('rate');
  return (
    <section className="card flex h-full flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
        <h2 className="text-lg font-extrabold tracking-tight">Suite health</h2>
        <div className="segmented" role="group" aria-label="Chart measure">
          <button type="button" aria-pressed={view === 'rate'} onClick={() => setView('rate')}>
            Pass rate
          </button>
          <button type="button" aria-pressed={view === 'duration'} onClick={() => setView('duration')}>
            Duration
          </button>
        </div>
      </header>
      <div className="flex-1 px-3 pt-4">
        {view === 'rate' ? (
          <LineTrend key="rate" data={data} dataKey="passRate" unit="%" domain={[0, 100]} label="Pass rate" height={290} />
        ) : (
          <LineTrend key="duration" data={data} dataKey="avgDurationMin" unit="m" label="Average run duration" color="var(--series-2)" height={290} />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-6 px-6 pt-2 pb-6">
        <Summary icon={<Activity size={20} />} value={passRate} label="Pass rate, 14 days" />
        <Summary icon={<Timer size={20} />} value={avgDuration} label={`Avg duration · ${runs} runs`} muted />
        <Link href="/analytics" className="btn btn-primary ml-auto">
          View details
        </Link>
      </div>
    </section>
  );
}

function Summary({ icon, value, label, muted }: { icon: React.ReactNode; value: string; label: string; muted?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-12 w-12 place-items-center rounded-2xl ${muted ? 'bg-[var(--surface-2)] text-[var(--muted)]' : 'bg-[var(--accent-soft)] text-accent'}`}
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <div className="text-lg font-extrabold tracking-tight">{value}</div>
        <div className="text-xs font-semibold text-[var(--muted)]">{label}</div>
      </div>
    </div>
  );
}

// Semicircle gauge of result outcomes with the total in the middle and a dot legend.
export function OutcomeGauge({ passed, flaky, failed, skipped }: { passed: number; flaky: number; failed: number; skipped: number }) {
  const total = passed + flaky + failed + skipped;
  const parts = [
    { name: 'Passed', value: passed, color: 'var(--good)' },
    { name: 'Flaky', value: flaky, color: 'var(--warning)' },
    { name: 'Failed', value: failed, color: 'var(--critical)' },
    { name: 'Skipped', value: skipped, color: 'var(--axis)' }
  ];
  const executed = passed + flaky + failed;
  const rate = executed ? Math.round((passed / executed) * 1000) / 10 : null;

  return (
    <section className="card flex h-full flex-col">
      <header className="px-6 pt-6">
        <h2 className="text-lg font-extrabold tracking-tight">Result mix</h2>
        <p className="text-xs font-semibold text-[var(--muted)]">Every test result in the last 14 days</p>
      </header>
      {total === 0 ? (
        <ChartEmpty height={200} />
      ) : (
        <>
          <div className="relative mx-auto mt-4 h-[175px] w-full max-w-[290px]" role="img" aria-label={parts.map((p) => `${p.value} ${p.name.toLowerCase()}`).join(', ')}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={parts.filter((p) => p.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy={160}
                  startAngle={180}
                  endAngle={0}
                  innerRadius={104}
                  outerRadius={134}
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="none"
                  animationDuration={1100}
                >
                  {parts
                    .filter((p) => p.value > 0)
                    .map((p) => (
                      <Cell key={p.name} fill={p.color} />
                    ))}
                </Pie>
                <Tooltip {...tooltipProps} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center">
              <div className="text-[28px] font-extrabold tracking-tight text-ink-2">{total.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--good-soft)] px-4 py-1.5 text-sm font-bold text-good-text">
              <Zap size={15} aria-hidden /> {rate == null ? 'No executed tests' : `${rate}% passed`}
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-4 px-6 pt-6 pb-6">
            {parts.map((p) => (
              <li key={p.name} className="flex items-start gap-3">
                <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: p.color }} aria-hidden />
                <div>
                  <div className="text-base font-extrabold">{total ? Math.round((p.value / total) * 100) : 0}%</div>
                  <div className="text-sm font-semibold text-ink-2">
                    {p.name} <span className="text-[var(--muted)]">· {p.value}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function ChartEmpty({ height }: { height: number }) {
  return (
    <div className="grid place-items-center text-sm font-semibold text-[var(--muted)]" style={{ height }}>
      No finished runs in this range.
    </div>
  );
}
