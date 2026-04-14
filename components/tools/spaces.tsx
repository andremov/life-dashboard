import React from 'react';
import { Check } from 'lucide-react';
import { MovableCard } from '../cards';
import { SPACES } from '../../lib/constants';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';

export function Spaces() {
  const spaceId = useStore((s) => s.spaceId);
  const setSpace = useStore((s) => s.setSpace);

  return (
    <MovableCard name="spaces" className="w-80">
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
              <div
                className={cn(
                  'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-6 pb-1 text-left text-[11px] font-medium text-white',
                )}
              >
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
    </MovableCard>
  );
}
