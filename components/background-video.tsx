import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import type { Space } from '../lib/types';

type Props = { space: Space };

type YTPlayer = {
  destroy: () => void;
  playVideo: () => void;
  loadVideoById: (id: string) => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (value: number) => void;
  getVideoData: () => { title?: string };
};

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, options: unknown) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const ENDED = 0;

/** Random pick from a station's pool, avoiding an immediate repeat. */
function pick(ids: readonly string[], exclude?: string): string {
  const others = ids.filter((id) => id !== exclude);
  const from = others.length ? others : ids;
  return from[Math.floor(Math.random() * from.length)];
}

let apiPromise: Promise<void> | null = null;

function loadPlayerApi(): Promise<void> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    window.onYouTubeIframeAPIReady = () => resolve();
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export function BackgroundVideo({ space }: Props) {
  const muted = useStore((s) => s.spaceMuted);
  const volume = useStore((s) => s.spaceVolume);
  const overlay = useStore((s) => s.spaceOverlay);
  const setNowPlaying = useStore((s) => s.setNowPlaying);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    // The API replaces the element it is given, so it gets a throwaway child
    // rather than the host node we need to keep across space changes.
    const mount = document.createElement('div');
    hostRef.current?.appendChild(mount);

    const pool = space.videoIds;
    // A station rolls its next video when the current one ends, so the order
    // is never fixed up front. A plain space just loops itself.
    let current = pool?.length ? pick(pool) : space.id;

    // Only the player knows which video is on screen once a station starts
    // moving through its pool.
    const report = (player: YTPlayer) => {
      const title = player.getVideoData?.().title;
      if (title) setNowPlaying(title);
    };

    loadPlayerApi().then(() => {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(mount, {
        videoId: current,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          disablekb: 1,
          ...(pool?.length ? {} : { loop: 1, playlist: space.id }),
        },
        events: {
          onReady: (event: { target: YTPlayer }) => {
            if (cancelled) return;
            event.target.playVideo();
            report(event.target);
            setReady(true);
          },
          onStateChange: (event: { data: number; target: YTPlayer }) => {
            if (event.data === ENDED && pool?.length) {
              current = pick(pool, current);
              event.target.loadVideoById(current);
              return;
            }
            report(event.target);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
      mount.remove();
    };
  }, [space, setNowPlaying]);

  useEffect(() => {
    const player = playerRef.current;
    if (!ready || !player) return;
    if (muted) player.mute();
    else player.unMute();
    player.setVolume(volume);
  }, [ready, muted, volume]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Overscaled so YouTube's own title and "More videos" chrome, which
          sits against the player's edges, falls outside the viewport. */}
      <div
        ref={hostRef}
        className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.35] [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
      />
      <div
        className="absolute inset-0 bg-black transition-opacity"
        style={{ opacity: overlay }}
      />
    </div>
  );
}
