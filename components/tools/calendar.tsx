import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovableCard } from '../cards';
import { Button } from '../ui/button';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: ({ day: number; date: number } | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, date: new Date(year, month, d).getTime() });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarTool() {
  const completions = useStore((s) => s.completions);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const byDay = useMemo(() => {
    const map = new Map<number, number>();
    for (const ts of completions) {
      const day = startOfDay(ts);
      map.set(day, (map.get(day) ?? 0) + 1);
    }
    return map;
  }, [completions]);

  const today = startOfDay(Date.now());
  const cells = useMemo(
    () => buildMonthGrid(cursor.year, cursor.month),
    [cursor],
  );
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(
    undefined,
    { month: 'long', year: 'numeric' },
  );

  const shift = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <MovableCard name="calendar" title="Calendar" className="w-72">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => shift(-1)}
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex-1 text-center text-sm font-semibold">
          {monthLabel}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => shift(1)}
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-0.5 text-center">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase"
          >
            {w}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} />;
          const count = byDay.get(cell.date) ?? 0;
          const isToday = cell.date === today;
          return (
            <div
              key={i}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-md text-xs',
                isToday && 'bg-primary text-primary-foreground font-semibold',
                !isToday && count > 0 && 'bg-primary/20 text-foreground',
                !isToday && count === 0 && 'text-muted-foreground',
              )}
              title={count > 0 ? `${count} pomodoros` : undefined}
            >
              {cell.day}
              {count > 0 && !isToday && (
                <span className="absolute right-0.5 bottom-0.5 size-1 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </div>
    </MovableCard>
  );
}

export { CalendarTool as Calendar };
