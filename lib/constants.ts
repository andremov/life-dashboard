import type { TimerInterval, ToolName } from './types';

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
];

export const SPACES = [
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
] as const;

export type SpaceId = (typeof SPACES)[number]['id'];

export const HOUR_SLOTS = Array.from({ length: 18 }, (_, i) => i + 6);

export const slotKey = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;
