import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import type { Space } from '../lib/types';

type Props = { space: Space };

type YTPlayer = {
  destroy: () => void;
  playVideo: () => void;
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

function shuffle(ids: readonly string[]): string[] {
  const next = [...ids];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
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

  // A station shuffles its pool and hands the rest to the player as a
  // playlist, so it auto-advances and loops back around when it runs out.
  const { videoId, playlist } = useMemo(() => {
    if (!space.videoIds?.length) return { videoId: space.id, playlist: space.id };
    const [first, ...rest] = shuffle(space.videoIds);
    return { videoId: first, playlist: rest.join(',') || first };
  }, [space]);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    // The API replaces the element it is given, so it gets a throwaway child
    // rather than the host node we need to keep across space changes.
    const mount = document.createElement('div');
    hostRef.current?.appendChild(mount);

    // Only the player knows which video is on screen once a station's
    // playlist starts advancing on its own.
    const report = (player: YTPlayer) => {
      const title = player.getVideoData?.().title;
      if (title) setNowPlaying(title);
    };

    loadPlayerApi().then(() => {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(mount, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: (event: { target: YTPlayer }) => {
            if (cancelled) return;
            event.target.playVideo();
            report(event.target);
            setReady(true);
          },
          onStateChange: (event: { target: YTPlayer }) => report(event.target),
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
      mount.remove();
    };
  }, [videoId, playlist, setNowPlaying]);

  useEffect(() => {
    const player = playerRef.current;
    if (!ready || !player) return;
    if (muted) player.mute();
    else player.unMute();
    player.setVolume(volume);
  }, [ready, muted, volume]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <div
        ref={hostRef}
        className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
      />
      <div
        className="absolute inset-0 bg-black transition-opacity"
        style={{ opacity: overlay }}
      />
    </div>
  );
}
