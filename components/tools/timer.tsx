import React, { useState } from 'react';
import { RotateCw, Settings } from 'lucide-react';
import { MovableCard } from '../cards';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useStore } from '../../lib/store';
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
  const interval = useStore((s) => s.timerInterval);
  const remaining = useStore((s) => s.timerRemaining);
  const isRunning = useStore((s) => s.timerRunning);
  const durations = useStore((s) => s.timerDurations);
  const toggle = useStore((s) => s.toggleTimer);
  const reset = useStore((s) => s.resetTimer);
  const change = useStore((s) => s.changeTimerInterval);
  const setDuration = useStore((s) => s.setTimerDuration);
  const alert = useStore((s) => s.timerAlert);

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <MovableCard
      name="timer"
      title="Timer"
      className={cn(
        'w-96',
        alert && 'animate-pulse ring-4 ring-red-500/70',
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex-1 font-mono text-5xl font-semibold tabular-nums',
            alert && 'text-red-500',
          )}
        >
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
          variant={settingsOpen ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => setSettingsOpen((v) => !v)}
          className="ml-auto"
          aria-label="Timer settings"
          aria-expanded={settingsOpen}
        >
          <Settings className="size-4" />
        </Button>
      </div>
      {settingsOpen && (
        <div className="mt-3 flex flex-col gap-2 border-t pt-3">
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Durations (minutes)
          </p>
          {INTERVAL_LABELS.map(({ name, label }) => (
            <label
              key={name}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span className="flex-1">{label}</span>
              <Input
                type="number"
                min={1}
                max={120}
                value={Math.round(durations[name] / 60)}
                onChange={(e) => {
                  const minutes = Math.max(1, Number(e.target.value) || 1);
                  setDuration(name, minutes * 60);
                }}
                className="h-7 w-16 text-center text-sm"
              />
            </label>
          ))}
        </div>
      )}
    </MovableCard>
  );
}

export { TimerTool as Timer };
