import type { Space, TimerInterval, ToolName } from './types';

export const INTERVAL_DURATIONS: Record<TimerInterval, number> = {
  pomodoro: 20 * 60,
  short: 5 * 60,
  long: 10 * 60,
};

export const TOOL_NAMES: ToolName[] = [
  'spaces',
  'timer',
  'tasks',
  'notes',
  'planner',
  'stats',
  'calendar',
];

export const SPACES = [
  // Blue Turtle — https://www.youtube.com/@BlueTurtle
  {
    id: 'Kuc-9gAmQ9I',
    title: 'Winter Adventures',
    thumbnail: 'https://i.ytimg.com/vi/Kuc-9gAmQ9I/hqdefault.jpg',
  },
  {
    id: 'GkSHE6wOzX0',
    title: 'Fantasy Music — Best of 2024',
    thumbnail: 'https://i.ytimg.com/vi/GkSHE6wOzX0/hqdefault.jpg',
  },
  {
    id: 'Pgk5CwKzJTk',
    title: 'Endless Wanderings',
    thumbnail: 'https://i.ytimg.com/vi/Pgk5CwKzJTk/hqdefault.jpg',
  },
  {
    id: 'iKcHuQRdJJk',
    title: 'Destined for Adventure',
    thumbnail: 'https://i.ytimg.com/vi/iKcHuQRdJJk/hqdefault.jpg',
  },
  {
    id: 'BzvjejYaacw',
    title: 'Magic Studies',
    thumbnail: 'https://i.ytimg.com/vi/BzvjejYaacw/hqdefault.jpg',
  },
  {
    id: 'w4OoYUNUQCM',
    title: '20min Study Session',
    thumbnail: 'https://i.ytimg.com/vi/w4OoYUNUQCM/hqdefault.jpg',
  },
  {
    id: 'gazYvkjRUQk',
    title: 'River Boat',
    thumbnail: 'https://i.ytimg.com/vi/gazYvkjRUQk/hqdefault.jpg',
  },
  {
    id: 'p1FvV-jH1_o',
    title: 'Waterfall & Underground Ruins',
    thumbnail: 'https://i.ytimg.com/vi/p1FvV-jH1_o/hqdefault.jpg',
  },
  {
    id: 'WMNatjasc_8',
    title: 'A New City',
    thumbnail: 'https://i.ytimg.com/vi/WMNatjasc_8/hqdefault.jpg',
  },
  {
    id: 'bAAGj_dEowc',
    title: 'Dungeon Exploration',
    thumbnail: 'https://i.ytimg.com/vi/bAAGj_dEowc/hqdefault.jpg',
  },
  {
    id: '9P-Ylgs9d08',
    title: 'Dark Forest',
    thumbnail: 'https://i.ytimg.com/vi/9P-Ylgs9d08/hqdefault.jpg',
  },
  {
    id: '1Hg_CIYBtlo',
    title: 'Blue Lake',
    thumbnail: 'https://i.ytimg.com/vi/1Hg_CIYBtlo/hqdefault.jpg',
  },
  {
    id: 'r0GsnNDLtGo',
    title: 'Forest Adventure',
    thumbnail: 'https://i.ytimg.com/vi/r0GsnNDLtGo/hqdefault.jpg',
  },
  {
    id: 'u5OEwdV_o00',
    title: 'Campfire',
    thumbnail: 'https://i.ytimg.com/vi/u5OEwdV_o00/hqdefault.jpg',
  },
  {
    id: 'gGZ7AqLE1j8',
    title: 'Spring Hike',
    thumbnail: 'https://i.ytimg.com/vi/gGZ7AqLE1j8/hqdefault.jpg',
  },
  {
    id: 'ocJlogyxxNY',
    title: 'Mountain Pass',
    thumbnail: 'https://i.ytimg.com/vi/ocJlogyxxNY/hqdefault.jpg',
  },
  {
    id: 'f3u000tEXxs',
    title: 'Autumn Forest',
    thumbnail: 'https://i.ytimg.com/vi/f3u000tEXxs/hqdefault.jpg',
  },
  {
    id: 'ztP1RknUpd4',
    title: 'Preparing for a Quest',
    thumbnail: 'https://i.ytimg.com/vi/ztP1RknUpd4/hqdefault.jpg',
  },
  {
    id: 'oUBuNfiJaWg',
    title: 'Summer Vibes at the River',
    thumbnail: 'https://i.ytimg.com/vi/oUBuNfiJaWg/hqdefault.jpg',
  },
  {
    id: 'fhDS0yOs9-o',
    title: 'Magic Studies (1 Hour)',
    thumbnail: 'https://i.ytimg.com/vi/fhDS0yOs9-o/hqdefault.jpg',
  },
  {
    id: 'iCsJueNtgus',
    title: 'Ruined Temple',
    thumbnail: 'https://i.ytimg.com/vi/iCsJueNtgus/hqdefault.jpg',
  },
  {
    id: 'Ss7MeMiHnKk',
    title: 'Secret Forest',
    thumbnail: 'https://i.ytimg.com/vi/Ss7MeMiHnKk/hqdefault.jpg',
  },
  {
    id: 'VLxcY6dqXeU',
    title: 'Rainy Day Piano',
    thumbnail: 'https://i.ytimg.com/vi/VLxcY6dqXeU/hqdefault.jpg',
  },
  {
    id: 'eVoqZbnRlNM',
    title: '1 Hour of Adventure',
    thumbnail: 'https://i.ytimg.com/vi/eVoqZbnRlNM/hqdefault.jpg',
  },
  {
    id: 'LrOUEdRpeVk',
    title: "Oltak's Market",
    thumbnail: 'https://i.ytimg.com/vi/LrOUEdRpeVk/hqdefault.jpg',
  },
  {
    id: 'UyzleHVQzVI',
    title: 'Morning Vibes — Medieval Lofi',
    thumbnail: 'https://i.ytimg.com/vi/UyzleHVQzVI/hqdefault.jpg',
  },
  {
    id: 'lieqtKzTWow',
    title: 'An Epic Ride',
    thumbnail: 'https://i.ytimg.com/vi/lieqtKzTWow/hqdefault.jpg',
  },
  {
    id: 'DIpU7vdxFZI',
    title: 'Magic Library',
    thumbnail: 'https://i.ytimg.com/vi/DIpU7vdxFZI/hqdefault.jpg',
  },
  {
    id: 'Ex4SbCgFAOo',
    title: 'Sunset in the Mountains',
    thumbnail: 'https://i.ytimg.com/vi/Ex4SbCgFAOo/hqdefault.jpg',
  },
  {
    id: 'mGsEkM69cwQ',
    title: "Ithya's Journey",
    thumbnail: 'https://i.ytimg.com/vi/mGsEkM69cwQ/hqdefault.jpg',
  },
  {
    id: 'nsDm36osJW8',
    title: 'Winter Ambiance',
    thumbnail: 'https://i.ytimg.com/vi/nsDm36osJW8/hqdefault.jpg',
  },
  {
    id: 'Paq-0sRPovA',
    title: 'A Tower on the Mountain',
    thumbnail: 'https://i.ytimg.com/vi/Paq-0sRPovA/hqdefault.jpg',
  },
  {
    id: 'dQUA-thz0aM',
    title: 'Sunrise Chill',
    thumbnail: 'https://i.ytimg.com/vi/dQUA-thz0aM/hqdefault.jpg',
  },
  {
    id: 'iNPzc932cs8',
    title: 'Coastal Village',
    thumbnail: 'https://i.ytimg.com/vi/iNPzc932cs8/hqdefault.jpg',
  },
  {
    id: '38zi6aqnoAU',
    title: 'Cozy Tavern on a Rainy Day',
    thumbnail: 'https://i.ytimg.com/vi/38zi6aqnoAU/hqdefault.jpg',
  },
  {
    id: 'nHeuZ8EIbSU',
    title: 'Music for Creatives',
    thumbnail: 'https://i.ytimg.com/vi/nHeuZ8EIbSU/hqdefault.jpg',
  },
  {
    id: 'Ny-GPZbPgOI',
    title: 'Morning Vibes — Lofi Mix',
    thumbnail: 'https://i.ytimg.com/vi/Ny-GPZbPgOI/hqdefault.jpg',
  },
  {
    id: 'QaSHaHJzmfk',
    title: 'Relaxing Campfire at Night',
    thumbnail: 'https://i.ytimg.com/vi/QaSHaHJzmfk/hqdefault.jpg',
  },
  {
    id: 'x5l4Cc9TCC8',
    title: 'A New Adventure',
    thumbnail: 'https://i.ytimg.com/vi/x5l4Cc9TCC8/hqdefault.jpg',
  },
  {
    id: 'vDxxR1PfR6k',
    title: 'Sunset Beach',
    thumbnail: 'https://i.ytimg.com/vi/vDxxR1PfR6k/hqdefault.jpg',
  },
  {
    id: 'rJTw_LmDS4Y',
    title: 'Fantasy Lofi for Study and Chill',
    thumbnail: 'https://i.ytimg.com/vi/rJTw_LmDS4Y/hqdefault.jpg',
  },

  // Witch Bolt — https://www.youtube.com/@WitchBoltMusic
  {
    id: 'TfbnwWE8ByE',
    title: 'HUSH',
    thumbnail: 'https://i.ytimg.com/vi/TfbnwWE8ByE/hqdefault.jpg',
  },
  {
    id: '9tkAbl9PhL8',
    title: 'Craft',
    thumbnail: 'https://i.ytimg.com/vi/9tkAbl9PhL8/hqdefault.jpg',
  },
  {
    id: 'WIa92xYNcqo',
    title: 'A Quiet Storm in the Valley',
    thumbnail: 'https://i.ytimg.com/vi/WIa92xYNcqo/hqdefault.jpg',
  },
  {
    id: 'ylGirv1fVWE',
    title: 'Howl — Wayseer Arrangement',
    thumbnail: 'https://i.ytimg.com/vi/ylGirv1fVWE/hqdefault.jpg',
  },
  {
    id: '5OYRTX_MAVY',
    title: 'Marigold — Wayseer Arrangement',
    thumbnail: 'https://i.ytimg.com/vi/5OYRTX_MAVY/hqdefault.jpg',
  },
  {
    id: '-dO3_woUJdI',
    title: 'The Mourning Star — Batael Transmissions',
    thumbnail: 'https://i.ytimg.com/vi/-dO3_woUJdI/hqdefault.jpg',
  },
  {
    id: '_WT8N5aJYto',
    title: 'Marigold',
    thumbnail: 'https://i.ytimg.com/vi/_WT8N5aJYto/hqdefault.jpg',
  },
  {
    id: 'CQWgIHIz_CU',
    title: 'Howl',
    thumbnail: 'https://i.ytimg.com/vi/CQWgIHIz_CU/hqdefault.jpg',
  },
  {
    id: 'UXCxnelWrkA',
    title: 'Bellow (Animated)',
    thumbnail: 'https://i.ytimg.com/vi/UXCxnelWrkA/hqdefault.jpg',
  },
  {
    id: 'fYbXZOjk6JA',
    title: 'Bellow',
    thumbnail: 'https://i.ytimg.com/vi/fYbXZOjk6JA/hqdefault.jpg',
  },
  {
    id: 'tOPdSHGK-js',
    title: 'The Collector',
    thumbnail: 'https://i.ytimg.com/vi/tOPdSHGK-js/hqdefault.jpg',
  },
  {
    id: '4ADNyjfm-l0',
    title: 'The Mourning Star',
    thumbnail: 'https://i.ytimg.com/vi/4ADNyjfm-l0/hqdefault.jpg',
  },
  {
    id: 'htak8D2tv_M',
    title: 'The Peace of Wild Things',
    thumbnail: 'https://i.ytimg.com/vi/htak8D2tv_M/hqdefault.jpg',
  },
  {
    id: 'S3Q4Vn7AMtE',
    title: 'Generation Loss',
    thumbnail: 'https://i.ytimg.com/vi/S3Q4Vn7AMtE/hqdefault.jpg',
  },
  {
    id: 'M2Dc7AvDCPs',
    title: 'Vigil EP',
    thumbnail: 'https://i.ytimg.com/vi/M2Dc7AvDCPs/hqdefault.jpg',
  },

  // Melody of the Wanderer — https://www.youtube.com/@MelodyoftheWanderer
  {
    id: 'station:melody-of-the-wanderer',
    title: 'Melody of the Wanderer',
    thumbnail: 'https://i.ytimg.com/vi/own_gNDB554/hqdefault.jpg',
    videoIds: [
      'own_gNDB554',
      'KQlBWCkX5qQ',
      'InYtvch8hyw',
      'u8xCmb7KbA0',
      '6gFUYzmOUCs',
      'eVsEqJAJLqg',
      '660hyhEEkyw',
      'ivtoSR-DCUU',
      'kB4HNcCPfc4',
      'KzHkAodaeaI',
      'nKXQjPSemqw',
      'q-MFgwWUjI0',
      'EL7xy_TLqjg',
    ],
  },

  // Gates of Vortalania — https://www.youtube.com/@GatesofVortalania
  {
    id: 'station:gates-of-vortalania',
    title: 'Gates of Vortalania',
    thumbnail: 'https://i.ytimg.com/vi/SWP6Liq-Fok/hqdefault.jpg',
    videoIds: [
      'SWP6Liq-Fok',
      '5cIUGAVKOcg',
      '0vCma5S9SMA',
      'xxYJONmXE8w',
      'bK5tLqJdtzc',
      'pUSiFuSviec',
      'C3uojmKHMt4',
      '6oDFjV0H140',
      'FFCHapyp4lU',
      'zhGe-Z-6tAI',
      'm-KKzfVqwKY',
      'bWZqG2rzwIc',
      'W2cXsu7KqNg',
    ],
  },

  // Tales of Caeleria — https://www.youtube.com/@TalesofCaeleria
  {
    id: 'station:tales-of-caeleria',
    title: 'Tales of Caeleria',
    thumbnail: 'https://i.ytimg.com/vi/3zAi1-LM00c/hqdefault.jpg',
    videoIds: [
      '3zAi1-LM00c',
      'Xa7AnQyPzMA',
      'kjahJ3rIeJk',
      'NOhiJqWiNbQ',
      'Wt9-Kg1UIoE',
      '4NQPsahNIE0',
      'N31AuLcLTRw',
      '4Hfw49oixbo',
      'pWvK29JwUOU',
      'HYgwB8UD-Oc',
      'mIfXSIDtFPw',
    ],
  },
] as const;

export type SpaceId = (typeof SPACES)[number]['id'];

export const HOUR_SLOTS = Array.from({ length: 18 }, (_, i) => i + 6);

export const slotKey = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

export function resolveSpace(id: string, custom: readonly Space[]): Space {
  return [...SPACES, ...custom].find((space) => space.id === id) ?? SPACES[0];
}
