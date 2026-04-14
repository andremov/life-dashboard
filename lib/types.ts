export type Theme = 'dark' | 'light';

export type TimerInterval = 'pomodoro' | 'short' | 'long';

export type ToolName = 'spaces' | 'timer' | 'music' | 'tasks';

export type Task = {
  id: string;
  name: string;
  done: boolean;
};
