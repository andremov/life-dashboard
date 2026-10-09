// andremov-brand-check-unique: the seven-day bar chart of completed pomodoros is the stats window's own visualisation
import React, { useMemo } from 'react';
import { StatGroup, StatTile, Text } from '@andremov/brand';
import { MovableCard } from '../cards';
import { useStore } from '../../lib/store';

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Midnight `n` days before `day`: by the calendar, so a 23- or 25-hour DST day doesn't drift. */
function daysBefore(day: number, n: number): number {
  const d = new Date(day);
  d.setDate(d.getDate() - n);
  return d.getTime();
}

function summarize(completions: number[], pomodoroSeconds: number) {
  const today = startOfDay(Date.now());
  const weekStart = daysBefore(today, 6);

  const byDay = new Map<number, number>();
  for (const ts of completions) {
    const day = startOfDay(ts);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }

  const todayCount = byDay.get(today) ?? 0;

  let weekCount = 0;
  const last7: { day: number; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = daysBefore(today, i);
    const count = byDay.get(day) ?? 0;
    last7.push({ day, count });
    if (day >= weekStart) weekCount += count;
  }

  let streak = 0;
  for (let i = 0; ; i++) {
    const day = daysBefore(today, i);
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
      <StatGroup className="grid grid-cols-3">
        <StatTile size="sm" label="Today" value={todayCount} />
        <StatTile size="sm" label="Week" value={weekCount} />
        <StatTile size="sm" label="Streak" value={`${streak}d`} />
      </StatGroup>
      <Text variant="hint" className="mt-1 text-center">
        {focusMinutesToday} min focused today
      </Text>
      <div className="mt-4">
        <Text variant="hint" className="mb-1" id="stats-last-7">
          Last 7 days
        </Text>
        <ol aria-labelledby="stats-last-7" className="flex h-20 items-end gap-1">
          {last7.map(({ day, count }) => {
            const weekday = WEEKDAY[new Date(day).getDay()];
            const heightPct = (count / maxCount) * 100;
            return (
              <li
                key={day}
                className="flex h-full flex-1 flex-col items-center gap-1"
                title={`${count} pomodoros`}
              >
                {/* the bar is positioned against a sized box: a percentage height of an
                    auto-height column resolves to nothing, so no bar ever showed */}
                <div className="relative w-full flex-1">
                  <div
                    className={
                      count > 0
                        ? 'absolute inset-x-0 bottom-0 rounded-t bg-primary'
                        : 'absolute inset-x-0 bottom-0 rounded-t bg-muted'
                    }
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                  />
                </div>
                <span aria-hidden className="text-[10px] text-muted-foreground">
                  {weekday}
                </span>
                <span className="sr-only">
                  {new Date(day).toLocaleDateString(undefined, { weekday: 'long' })}: {count}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </MovableCard>
  );
}
