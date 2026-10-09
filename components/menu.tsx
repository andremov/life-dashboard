// andremov-brand-check-unique: the compact icon-over-label tool rail floating over the background video is this dashboard's UI
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
import { Button } from '@andremov/brand/ui/button';
import { StaticCard } from './cards';
import { useStore } from '../lib/store';
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

export const Menu = ({ setTool }: MenuProps) => {
  const layout = useStore((s) => s.layout);
  return (
    <StaticCard className="fixed top-1/2 left-3 z-20 -translate-y-1/2 p-2">
      <nav aria-label="Tools">
        <h2 className="mb-2 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          Tools
        </h2>
        <div className="flex flex-col gap-1">
          {TOOLS.map(({ name, label, Icon }) => (
            <Button
              key={name}
              variant="ghost"
              onClick={() => setTool(name)}
              aria-pressed={layout[name].visible}
              className="h-auto w-14 flex-col gap-1 px-2 py-2 text-[10px] text-muted-foreground aria-pressed:text-foreground"
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </StaticCard>
  );
};
