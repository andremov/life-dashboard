import React, { useMemo } from 'react';
import { MovableCard } from '../cards';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const DAY_MS = 24 * 60 * 60 * 1000;

function summarize(completions: number[], pomodoroSeconds: number) {
  const today = startOfDay(Date.now());
  const weekStart = today - 6 * DAY_MS;

  const byDay = new Map<number, number>();
  for (const ts of completions) {
    const day = startOfDay(ts);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }

  const todayCount = byDay.get(today) ?? 0;

  let weekCount = 0;
  const last7: { day: number; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = today - i * DAY_MS;
    const count = byDay.get(day) ?? 0;
    last7.push({ day, count });
    if (day >= weekStart) weekCount += count;
  }

  let streak = 0;
  for (let i = 0; ; i++) {
    const day = today - i * DAY_MS;
    if ((byDay.get(day) ?? 0) > 0) streak++;
    else break;
  }

  const focusMinutesToday = Math.round(
    (todayCount * pomodoroSeconds) / 60,
  );

  return { todayCount, weekCount, streak, last7, focusMinutesToday };
}

const WEEKDAY = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function Stats() {
  const completions = useStore((s) => s.completions);
  const pomodoroSeconds = useStore((s) => s.timerDurations.pomodoro);

  const { todayCount, weekCount, streak, last7, focusMinutesToday } = useMemo(
    () => summarize(completions, pomodoroSeconds),
    [completions, pomodoroSeconds],
  );

  const maxCount = Math.max(1, ...last7.map((d) => d.count));

  return (
    <MovableCard name="stats" title="Stats" className="w-72">
      <div className="grid grid-cols-3 gap-2 text-center">
        <StatBlock label="Today" value={todayCount} />
        <StatBlock label="Week" value={weekCount} />
        <StatBlock label="Streak" value={streak} suffix="d" />
      </div>
      <div className="mt-1 text-center text-[11px] text-muted-foreground">
        {focusMinutesToday} min focused today
      </div>
      <div className="mt-4">
        <p className="mb-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          Last 7 days
        </p>
        <div className="flex h-20 items-end gap-1">
          {last7.map(({ day, count }) => {
            const weekday = WEEKDAY[new Date(day).getDay()];
            const heightPct = (count / maxCount) * 100;
            return (
              <div
                key={day}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    'w-full rounded-t',
                    count > 0 ? 'bg-primary' : 'bg-accent/40',
                  )}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                  title={`${count} pomodoros`}
                />
                <span className="text-[9px] text-muted-foreground">
                  {weekday}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </MovableCard>
  );
}

type StatBlockProps = { label: string; value: number; suffix?: string };
const StatBlock = ({ label, value, suffix }: StatBlockProps) => (
  <div className="rounded-md bg-accent/30 px-2 py-2">
    <div className="font-mono text-xl font-semibold tabular-nums">
      {value}
      {suffix && (
        <span className="ml-0.5 text-xs font-normal text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
    <div className="text-[10px] tracking-wider text-muted-foreground uppercase">
      {label}
    </div>
  </div>
);
