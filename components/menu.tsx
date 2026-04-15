import React from 'react';
import {
  BarChart3,
  Calendar,
  CalendarClock,
  FileText,
  ListTodo,
  Timer,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { StaticCard } from './cards';
import type { ToolName } from '../lib/types';

type MenuProps = {
  setTool: (name: ToolName) => void;
};

const TOOLS: { name: ToolName; label: string; Icon: LucideIcon }[] = [
  { name: 'spaces', label: 'Spaces', Icon: Video },
  { name: 'timer', label: 'Timer', Icon: Timer },
  { name: 'tasks', label: 'Tasks', Icon: ListTodo },
  { name: 'notes', label: 'Notes', Icon: FileText },
  { name: 'planner', label: 'Planner', Icon: CalendarClock },
  { name: 'stats', label: 'Stats', Icon: BarChart3 },
  { name: 'calendar', label: 'Calendar', Icon: Calendar },
];

export const Menu = ({ setTool }: MenuProps) => (
  <StaticCard className="fixed top-1/2 left-3 z-20 -translate-y-1/2 p-2">
    <h3 className="mb-2 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
      Tools
    </h3>
    <div className="flex flex-col gap-1">
      {TOOLS.map(({ name, label, Icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => setTool(name)}
          aria-label={label}
          className="flex w-14 flex-col items-center gap-1 rounded-md px-2 py-2 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Icon className="size-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </StaticCard>
);
