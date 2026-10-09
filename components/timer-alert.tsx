// andremov-brand-check-unique: the pulsing full-screen alarm frame around the dashboard when the timer ends is this tool's own
import React, { useEffect } from 'react';
import { Notice } from '@andremov/brand';
import { Button } from '@andremov/brand/ui/button';
import { useStore } from '../lib/store';

export function TimerAlert() {
  const alert = useStore((s) => s.timerAlert);
  const dismiss = useStore((s) => s.dismissTimerAlert);

  useEffect(() => {
    if (!alert) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // the timer's own space shortcut must not restart it in the same keypress
        e.stopImmediatePropagation();
        dismiss();
      }
    };
    window.addEventListener('keydown', handler, { capture: true });
    return () => window.removeEventListener('keydown', handler, { capture: true });
  }, [alert, dismiss]);

  if (!alert) return null;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 animate-pulse ring-8 ring-danger/40 ring-inset"
      />
      <div className="fixed top-16 left-1/2 z-50 -translate-x-1/2 shadow-2xl">
        <Notice tone="danger" title="Time's up!" className="items-center">
          <div className="flex items-center gap-3">
            <span>Press Esc or click dismiss</span>
            <Button size="sm" onClick={dismiss}>
              Dismiss
            </Button>
          </div>
        </Notice>
      </div>
    </>
  );
}
