import React, { useEffect, useState } from 'react';
import { Maximize } from 'lucide-react';
import { Text, ThemeToggle } from '@andremov/brand';
import { Button } from '@andremov/brand/ui/button';
import { Separator } from '@andremov/brand/ui/separator';
import { StaticCard } from './cards';

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
  // the date and the theme button both depend on the browser (locale, OS theme), so they
  // render after mount rather than mismatch the server HTML
  const date = useCurrentDate();

  return (
    <StaticCard className="fixed top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 px-3 py-1.5">
      <Text as="span" variant="hint" className="select-none">
        {date ?? ' '}
      </Text>
      <div className="h-6">
        <Separator orientation="vertical" />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleFullScreen}
        aria-label="Toggle fullscreen"
      >
        <Maximize className="size-4" />
      </Button>
      <div className="h-6">
        <Separator orientation="vertical" />
      </div>
      {date ? <ThemeToggle variant="button" /> : <span className="size-8" />}
    </StaticCard>
  );
}
