import { useEffect, useState } from 'react';
import { INTERVAL_DURATIONS } from '../lib/constants';
import type { TimerInterval } from '../lib/types';

export function useTimer() {
  const [interval, setIntervalName] = useState<TimerInterval>('pomodoro');
  const [remaining, setRemaining] = useState<number>(INTERVAL_DURATIONS.pomodoro);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  const start = () => {
    if (remaining > 0) setIsRunning(true);
  };
  const pause = () => setIsRunning(false);
  const toggle = () => (isRunning ? pause() : start());

  const reset = () => {
    setIsRunning(false);
    setRemaining(INTERVAL_DURATIONS[interval]);
  };

  const change = (next: TimerInterval) => {
    setIntervalName(next);
    setRemaining(INTERVAL_DURATIONS[next]);
    setIsRunning(false);
  };

  return { interval, remaining, isRunning, start, pause, toggle, reset, change };
}
