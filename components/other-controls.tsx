import React, { useEffect, useState } from 'react';
import { Maximize, Moon, Sun } from 'lucide-react';
import { StaticCard } from './cards';
import { Button } from './ui/button';
import { useTheme } from '../hooks/use-theme';

function handleFullScreen() {
  if (typeof document === 'undefined') return;
  if (document.fullscreenElement) {
    void document.exitFullscreen();
  } else {
    void document.documentElement.requestFullscreen();
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function useCurrentDate() {
  const [date, setDate] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setDate(formatDate(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return date;
}

export function OtherControls() {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';
  const date = useCurrentDate();

  return (
    <StaticCard className="fixed top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 px-3 py-1.5">
      <span
        suppressHydrationWarning
        className="text-xs font-medium tracking-wide text-muted-foreground select-none"
      >
        {date ?? '\u00a0'}
      </span>
      <div className="h-6 w-px bg-border" />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleFullScreen}
        aria-label="Toggle fullscreen"
      >
        <Maximize className="size-4" />
      </Button>
      <div className="h-6 w-px bg-border" />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      >
        {isLight ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>
    </StaticCard>
  );
}
