import React from 'react';
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

export function OtherControls() {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  return (
    <StaticCard className="fixed top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 px-2 py-1.5">
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
