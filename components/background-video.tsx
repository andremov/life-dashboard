import React from 'react';

type Props = { videoId: string };

export function BackgroundVideo({ videoId }: Props) {
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1`;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <iframe
        key={videoId}
        src={src}
        title="Ambient background"
        allow="autoplay; encrypted-media"
        className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
