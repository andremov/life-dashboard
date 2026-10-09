// andremov-brand-check-unique: the grid of video thumbnails with their station badges and now-playing strip is the space picker's own UI
import React, { useState } from 'react';
import {
  AudioLines,
  Check,
  Plus,
  Radio,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Notice, Text, TextField, cn } from '@andremov/brand';
import { Button } from '@andremov/brand/ui/button';
import { Slider } from '@andremov/brand/ui/slider';
import { MovableCard } from '../cards';
import { SPACES, resolveSpace } from '../../lib/constants';
import { useStore } from '../../lib/store';
import type { Space } from '../../lib/types';

export function Spaces() {
  const spaceId = useStore((s) => s.spaceId);
  const nowPlaying = useStore((s) => s.nowPlaying);
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
      <NowPlaying
        title={nowPlaying}
        fallback={resolveSpace(spaceId, customSpaces).title}
      />
      <div className="grid max-h-[50vh] grid-cols-2 gap-2 overflow-y-auto overscroll-contain pr-1">
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
            size="icon-sm"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
          <Slider
            min={0}
            max={100}
            value={[volume]}
            disabled={muted}
            onValueChange={([v]) => setVolume(v)}
            aria-label="Volume"
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Text as="span" variant="hint" id="spaces-dim" className="w-8 shrink-0 text-center">
            Dim
          </Text>
          <Slider
            min={0}
            max={80}
            value={[Math.round(overlay * 100)]}
            onValueChange={([v]) => setOverlay(v / 100)}
            aria-labelledby="spaces-dim"
            className="flex-1"
          />
        </div>
      </div>
    </MovableCard>
  );
}

type NowPlayingProps = { title: string | null; fallback: string };

const NowPlaying = ({ title, fallback }: NowPlayingProps) => (
  <div className="mb-3 flex items-center gap-2 border-b pb-3">
    <AudioLines aria-hidden className="size-4 shrink-0 text-brand-text" />
    <div className="min-w-0">
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        Now playing
      </p>
      <p className="truncate text-xs" title={title ?? fallback}>
        {title ?? fallback}
      </p>
    </div>
  </div>
);

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
        ? 'border-brand ring-2 ring-brand/60'
        : 'border-transparent hover:border-border',
    )}
  >
    <button
      type="button"
      onClick={onSelect}
      aria-label={space.title}
      aria-pressed={active}
      className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
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
    {space.videoIds && (
      <div
        title={`Station — shuffles ${space.videoIds.length} videos`}
        className="pointer-events-none absolute top-1 left-1 flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-white uppercase"
      >
        <Radio className="size-2.5" />
        {space.videoIds.length}
      </div>
    )}
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
        className="absolute top-1 left-1 inline-flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-danger-fill hover:text-danger-on focus-visible:opacity-100"
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
        <TextField
          value={url}
          onChange={(v) => {
            setUrl(v);
            setError(false);
          }}
          onKeyDown={handleEnter}
          aria-label="YouTube URL or video ID"
          aria-invalid={error || undefined}
          placeholder="YouTube URL or video ID"
          className="flex-1"
        />
        <Button
          size="icon-sm"
          disabled={!url.trim()}
          onClick={handleAdd}
          aria-label="Add custom space"
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <TextField
        value={title}
        onChange={setTitle}
        onKeyDown={handleEnter}
        aria-label="Title (optional)"
        placeholder="Title (optional)"
      />
      {error && (
        <Notice tone="danger">
          Couldn&apos;t parse that. Paste a YouTube URL or an 11-character video ID.
        </Notice>
      )}
    </div>
  );
};
