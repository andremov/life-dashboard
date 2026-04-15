export type Theme = 'dark' | 'light';

export type TimerInterval = 'pomodoro' | 'short' | 'long';

export type ToolName =
  | 'spaces'
  | 'timer'
  | 'tasks'
  | 'notes'
  | 'planner'
  | 'stats'
  | 'calendar';

export type Task = {
  id: string;
  name: string;
  done: boolean;
  tags: string[];
};

export type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
};

export type Space = {
  id: string;
  title: string;
  thumbnail: string;
};

export type LayoutEntry = {
  visible: boolean;
  top: number;
  left: number;
  z: number;
};
