import React from 'react';
import { RotateCw, Settings } from 'lucide-react';
import { MovableCard } from '../cards';
import { Button } from '../ui/button';
import { useTimer } from '../../hooks/use-timer';
import type { TimerInterval } from '../../lib/types';
import { cn } from '../../lib/utils';

const formatDigits = (n: number): string => (n < 10 ? `0${n}` : `${n}`);
const formatTime = (seconds: number): string =>
  `${formatDigits(Math.floor(seconds / 60))}:${formatDigits(seconds % 60)}`;

const INTERVAL_LABELS: { name: TimerInterval; label: string }[] = [
  { name: 'pomodoro', label: 'Pomodoro' },
  { name: 'short', label: 'Short Break' },
  { name: 'long', label: 'Long Break' },
];

export function TimerTool() {
  const { interval, remaining, isRunning, toggle, reset, change } = useTimer();

  return (
    <MovableCard name="timer" className="w-96">
      <div className="flex items-center gap-3">
        <div className="flex-1 font-mono text-5xl font-semibold tabular-nums">
          {formatTime(remaining)}
        </div>
        <Button onClick={toggle} className="min-w-20">
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={reset}
          aria-label="Reset timer"
        >
          <RotateCw className="size-4" />
        </Button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {INTERVAL_LABELS.map(({ name, label }) => (
          <Button
            key={name}
            variant={interval === name ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => change(name)}
            className={cn(interval === name && 'font-semibold')}
          >
            {label}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          aria-label="Timer settings"
        >
          <Settings className="size-4" />
        </Button>
      </div>
    </MovableCard>
  );
}

export { TimerTool as Timer };
