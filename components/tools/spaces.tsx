import React from 'react';
import { Check, Volume2, VolumeX } from 'lucide-react';
import { MovableCard } from '../cards';
import { Button } from '../ui/button';
import { SPACES } from '../../lib/constants';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';

export function Spaces() {
  const spaceId = useStore((s) => s.spaceId);
  const setSpace = useStore((s) => s.setSpace);
  const muted = useStore((s) => s.spaceMuted);
  const setMuted = useStore((s) => s.setSpaceMuted);
  const volume = useStore((s) => s.spaceVolume);
  const setVolume = useStore((s) => s.setSpaceVolume);
  const overlay = useStore((s) => s.spaceOverlay);
  const setOverlay = useStore((s) => s.setSpaceOverlay);

  return (
    <MovableCard name="spaces" title="Spaces" className="w-80">
      <div className="grid grid-cols-2 gap-2">
        {SPACES.map((space) => {
          const active = space.id === spaceId;
          return (
            <button
              key={space.id}
              type="button"
              onClick={() => setSpace(space.id)}
              aria-label={space.title}
              aria-pressed={active}
              className={cn(
                'group relative aspect-video overflow-hidden rounded-md border transition-colors',
                active
                  ? 'border-primary ring-2 ring-primary/60'
                  : 'border-transparent hover:border-accent',
              )}
            >
              <img
                src={space.thumbnail}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-6 pb-1 text-left text-[11px] font-medium text-white">
                {space.title}
              </div>
              {active && (
                <div className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t pt-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="size-7"
          >
            {muted ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </Button>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            disabled={muted}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="h-1 flex-1 accent-primary disabled:opacity-40"
          />
        </div>
        <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="w-12 shrink-0 uppercase tracking-wider">Dim</span>
          <input
            type="range"
            min={0}
            max={80}
            value={Math.round(overlay * 100)}
            onChange={(e) => setOverlay(Number(e.target.value) / 100)}
            aria-label="Background dim"
            className="h-1 flex-1 accent-primary"
          />
        </label>
      </div>
    </MovableCard>
  );
}
