import type { TimerInterval, ToolName } from './types';

export const INTERVAL_DURATIONS: Record<TimerInterval, number> = {
  pomodoro: 20 * 60,
  short: 5 * 60,
  long: 10 * 60,
};

export const TOOL_NAMES: ToolName[] = ['spaces', 'timer', 'music', 'tasks'];
