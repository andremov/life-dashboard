import { useStore } from '../lib/store';

export function useTimer() {
  const interval = useStore((s) => s.timerInterval);
  const remaining = useStore((s) => s.timerRemaining);
  const isRunning = useStore((s) => s.timerRunning);
  const start = useStore((s) => s.startTimer);
  const pause = useStore((s) => s.pauseTimer);
  const toggle = useStore((s) => s.toggleTimer);
  const reset = useStore((s) => s.resetTimer);
  const change = useStore((s) => s.changeTimerInterval);

  return { interval, remaining, isRunning, start, pause, toggle, reset, change };
}
