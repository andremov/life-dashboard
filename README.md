# Life Dashboard

Because [lifeat.io](https://lifeat.io/) is not free.

An ambient focus dashboard: a looping video background with a set of small,
draggable tool windows on top — timer, tasks, notes, planner, stats, calendar.
Everything lives in the browser; there is no account and no server state.

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

`npm run build && npm start` serves a production build.

## Tools

| Tool | What it does |
| --- | --- |
| Spaces | Picks the background, sets volume and screen dim |
| Timer | Pomodoro / short / long intervals with configurable durations |
| Tasks | Checklist with `#tag` parsing and drag-to-reorder |
| Notes | Multiple notes, kept in local storage |
| Planner | Drops tasks into hourly slots for the day |
| Stats | Completed pomodoros over time |
| Calendar | Month view |

Windows are dragged by their title bar and toggled from the left rail. Position
and visibility persist.

## Spaces

A **space** is the background. Two kinds, both defined in `lib/constants.ts`:

**A single video** — one YouTube video, looped.

```ts
{
  id: 'Kuc-9gAmQ9I',
  title: 'Winter Adventures',
  thumbnail: 'https://i.ytimg.com/vi/Kuc-9gAmQ9I/hqdefault.jpg',
}
```

The `id` is the YouTube video ID, and it doubles as the space's own identity.

**A radio station** — a pool of videos. Picking the station shuffles the pool,
starts on a random one, and lets the player advance through the rest, looping
when it runs out. Stations show a badge with their pool size.

```ts
{
  id: 'station:gates-of-vortalania',
  title: 'Gates of Vortalania',
  thumbnail: 'https://i.ytimg.com/vi/xxYJONmXE8w/hqdefault.jpg',
  videoIds: ['xxYJONmXE8w', 'bK5tLqJdtzc', /* … */],
}
```

Station IDs are prefixed `station:` so they never collide with a video ID.
The shuffle happens once per selection, not once per track — the running order
is decided when you pick the station.

Whichever is playing, the Spaces window shows the current video's real YouTube
title under **Now playing**, which is the only way to tell where a station has
drifted to. It falls back to the space's own name until the player reports in.

### Adding one

Paste a YouTube URL or an 11-character video ID into **Add custom** in the
Spaces window. Custom spaces are single videos, stored locally, and removable
from their tile.

To add one permanently, append it to `SPACES` in `lib/constants.ts`. Entries are
grouped by source channel with a comment. Two things are worth checking before
committing an ID:

```bash
# thumbnail resolves
curl -o /dev/null -w '%{http_code}\n' https://i.ytimg.com/vi/<ID>/hqdefault.jpg

# and the video actually allows embedding
curl -o /dev/null -w '%{http_code}\n' \
  'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json'
```

A non-200 from the second means the video is embed-blocked and will render a
dead player, which nothing else in the app will warn you about.

## How it fits together

- `lib/constants.ts` — the `SPACES` catalogue and `resolveSpace()`
- `lib/store.ts` — one persisted zustand store for everything
- `components/background-video.tsx` — the YouTube IFrame player, shuffling and
  title reporting
- `components/tools/` — one file per tool window
- `components/cards.tsx` — the draggable window shell

State is persisted to local storage under `life-dashboard` and versioned; see
`migrate` in the store when changing its shape.

Built with Next.js (pages router), Tailwind, shadcn/ui, zustand and dnd-kit.
