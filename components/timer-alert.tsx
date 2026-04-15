import React, { useEffect } from 'react';
import { BellRing } from 'lucide-react';
import { Button } from './ui/button';
import { useStore } from '../lib/store';

export function TimerAlert() {
  const alert = useStore((s) => s.timerAlert);
  const dismiss = useStore((s) => s.dismissTimerAlert);

  useEffect(() => {
    if (!alert) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [alert, dismiss]);

  if (!alert) return null;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 animate-pulse ring-8 ring-inset ring-red-500/40"
      />
      <div
        role="alert"
        className="fixed top-16 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-red-500/50 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md"
      >
        <BellRing className="size-5 animate-bounce text-red-500" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Time&apos;s up!</span>
          <span className="text-[11px] text-muted-foreground">
            Press Esc or click dismiss
          </span>
        </div>
        <Button size="sm" onClick={dismiss} className="ml-2">
          Dismiss
        </Button>
      </div>
    </>
  );
}
