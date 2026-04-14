export type Theme = 'dark' | 'light';

export type TimerInterval = 'pomodoro' | 'short' | 'long';

export type ToolName = 'spaces' | 'timer' | 'tasks' | 'notes' | 'planner';

export type Task = {
  id: string;
  name: string;
  done: boolean;
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
