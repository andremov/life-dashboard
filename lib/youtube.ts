const ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (ID_RE.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1);
    return ID_RE.test(id) ? id : null;
  }
  if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
    const v = url.searchParams.get('v');
    if (v && ID_RE.test(v)) return v;
    const m = url.pathname.match(/\/(embed|shorts|v)\/([A-Za-z0-9_-]{11})/);
    if (m) return m[2];
  }
  return null;
}

export function thumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
