import React, { useState } from 'react';
import { Check, Plus, Trash2, Volume2, VolumeX } from 'lucide-react';
import { MovableCard } from '../cards';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SPACES } from '../../lib/constants';
import { useStore } from '../../lib/store';
import type { Space } from '../../lib/types';
import { cn } from '../../lib/utils';

export function Spaces() {
  const spaceId = useStore((s) => s.spaceId);
  const setSpace = useStore((s) => s.setSpace);
  const customSpaces = useStore((s) => s.customSpaces);
  const addCustomSpace = useStore((s) => s.addCustomSpace);
  const removeCustomSpace = useStore((s) => s.removeCustomSpace);
  const muted = useStore((s) => s.spaceMuted);
  const setMuted = useStore((s) => s.setSpaceMuted);
  const volume = useStore((s) => s.spaceVolume);
  const setVolume = useStore((s) => s.setSpaceVolume);
  const overlay = useStore((s) => s.spaceOverlay);
  const setOverlay = useStore((s) => s.setSpaceOverlay);

  return (
    <MovableCard name="spaces" title="Spaces" className="w-80">
      <div className="grid grid-cols-2 gap-2">
        {SPACES.map((space) => (
          <SpaceTile
            key={space.id}
            space={space}
            active={space.id === spaceId}
            onSelect={() => setSpace(space.id)}
          />
        ))}
        {customSpaces.map((space) => (
          <SpaceTile
            key={space.id}
            space={space}
            active={space.id === spaceId}
            onSelect={() => setSpace(space.id)}
            onRemove={() => removeCustomSpace(space.id)}
          />
        ))}
      </div>

      <CustomSpaceInput addCustomSpace={addCustomSpace} />

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
          <span className="w-12 shrink-0 tracking-wider uppercase">Dim</span>
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

type SpaceTileProps = {
  space: Space;
  active: boolean;
  onSelect: () => void;
  onRemove?: () => void;
};

const SpaceTile = ({ space, active, onSelect, onRemove }: SpaceTileProps) => (
  <div
    className={cn(
      'group relative aspect-video overflow-hidden rounded-md border transition-colors',
      active
        ? 'border-primary ring-2 ring-primary/60'
        : 'border-transparent hover:border-accent',
    )}
  >
    <button
      type="button"
      onClick={onSelect}
      aria-label={space.title}
      aria-pressed={active}
      className="block h-full w-full"
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
    </button>
    {active && (
      <div className="pointer-events-none absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-3" />
      </div>
    )}
    {onRemove && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={`Remove ${space.title}`}
        className="absolute top-1 left-1 inline-flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
      >
        <Trash2 className="size-3" />
      </button>
    )}
  </div>
);

type CustomSpaceInputProps = {
  addCustomSpace: (url: string, title?: string) => string | null;
};

const CustomSpaceInput = ({ addCustomSpace }: CustomSpaceInputProps) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const handleAdd = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const id = addCustomSpace(trimmed, title.trim() || undefined);
    if (id) {
      setUrl('');
      setTitle('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="mt-3 flex flex-col gap-1.5 border-t pt-3">
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        Add custom
      </p>
      <div className="flex items-center gap-2">
        <Input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(false);
          }}
          onKeyDown={handleEnter}
          placeholder="YouTube URL or video ID"
          className={cn('h-7 flex-1 text-xs', error && 'border-destructive')}
        />
        <Button
          size="icon"
          className="size-7"
          disabled={!url.trim()}
          onClick={handleAdd}
          aria-label="Add custom space"
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleEnter}
        placeholder="Title (optional)"
        className="h-7 text-xs"
      />
      {error && (
        <p className="text-[10px] text-destructive">
          Couldn&apos;t parse that — paste a YouTube URL or 11-char video ID.
        </p>
      )}
    </div>
  );
};
