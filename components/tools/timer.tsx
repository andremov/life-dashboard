// andremov-brand-check-unique: the large clock readout, and its alarm state, are the focus timer's own display
import React, { useState } from 'react';
import { RotateCw, Settings } from 'lucide-react';
import { NumberInput, SegmentedControl, Text, cn } from '@andremov/brand';
import { Button } from '@andremov/brand/ui/button';
import { Toggle } from '@andremov/brand/ui/toggle';
import { MovableCard } from '../cards';
import { useStore } from '../../lib/store';
import type { TimerInterval } from '../../lib/types';

const formatDigits = (n: number): string => (n < 10 ? `0${n}` : `${n}`);
const formatTime = (seconds: number): string =>
  `${formatDigits(Math.floor(seconds / 60))}:${formatDigits(seconds % 60)}`;

const INTERVAL_LABELS: { value: TimerInterval; label: string }[] = [
  { value: 'pomodoro', label: 'Pomodoro' },
  { value: 'short', label: 'Short Break' },
  { value: 'long', label: 'Long Break' },
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
      className={cn('w-96', alert && 'ring-4 ring-danger/70')}
    >
      <div className="flex items-center gap-3">
        <div
          role="timer"
          aria-label="Time remaining"
          className={cn(
            'flex-1 font-mono text-5xl font-semibold tabular-nums',
            alert && 'text-danger-text',
          )}
        >
          {formatTime(remaining)}
        </div>
        <Button onClick={toggle} className="min-w-20">
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Reset timer">
          <RotateCw className="size-4" />
        </Button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <SegmentedControl
          aria-label="Interval"
          size="sm"
          options={INTERVAL_LABELS}
          value={interval}
          onChange={change}
          arrowKeys={false}
        />
        <Toggle
          pressed={settingsOpen}
          onPressedChange={setSettingsOpen}
          className="ml-auto"
          aria-label="Timer settings"
        >
          <Settings className="size-4" />
        </Toggle>
      </div>
      {settingsOpen && (
        <div className="mt-3 flex flex-col gap-2 border-t pt-3">
          <Text variant="hint">Durations (minutes)</Text>
          {INTERVAL_LABELS.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <Text as="label" variant="hint" htmlFor={`duration-${value}`} className="flex-1">
                {label}
              </Text>
              <NumberInput
                id={`duration-${value}`}
                size="sm"
                min={1}
                max={120}
                value={Math.round(durations[value] / 60)}
                onChange={(minutes) =>
                  setDuration(value, Math.min(120, Math.max(1, Math.round(minutes) || 1)) * 60)
                }
                className="w-16"
              />
            </div>
          ))}
        </div>
      )}
    </MovableCard>
  );
}

export { TimerTool as Timer };
