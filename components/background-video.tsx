import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import type { Space } from '../lib/types';

type Props = { space: Space };

function shuffle(ids: readonly string[]): string[] {
  const next = [...ids];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function BackgroundVideo({ space }: Props) {
  const muted = useStore((s) => s.spaceMuted);
  const volume = useStore((s) => s.spaceVolume);
  const overlay = useStore((s) => s.spaceOverlay);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  // A station shuffles its pool and hands the rest to the player as a
  // playlist, so it auto-advances and loops back around when it runs out.
  const { videoId, playlist } = useMemo(() => {
    if (!space.videoIds?.length) return { videoId: space.id, playlist: space.id };
    const [first, ...rest] = shuffle(space.videoIds);
    return { videoId: first, playlist: rest.join(',') || first };
  }, [space]);

  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${playlist}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1`;

  useEffect(() => {
    setReady(false);
    const id = window.setTimeout(() => setReady(true), 800);
    return () => window.clearTimeout(id);
  }, [videoId]);

  useEffect(() => {
    if (!ready) return;
    const send = (func: string, args: (string | number)[] = []) =>
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*',
      );
    send(muted ? 'mute' : 'unMute');
    send('setVolume', [volume]);
    send('playVideo');
  }, [ready, muted, volume]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <iframe
        ref={iframeRef}
        key={videoId}
        src={src}
        title="Ambient background"
        allow="autoplay; encrypted-media"
        className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
      />
      <div
        className="absolute inset-0 bg-black transition-opacity"
        style={{ opacity: overlay }}
      />
    </div>
  );
}
