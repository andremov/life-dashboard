// andremov-brand-check-unique: the hourly drop slots that tasks are dragged into are the day planner's own layout
import React from 'react';
import { X } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { Text, cn } from '@andremov/brand';
import { Button } from '@andremov/brand/ui/button';
import { MovableCard } from '../cards';
import { HOUR_SLOTS, slotKey } from '../../lib/constants';
import { useStore } from '../../lib/store';

export function Planner() {
  const tasks = useStore((s) => s.tasks);
  const plannerAssignments = useStore((s) => s.plannerAssignments);
  const clearSlot = useStore((s) => s.clearSlot);

  const taskName = (id: string | null) =>
    id ? tasks.find((t) => t.id === id)?.name ?? null : null;

  return (
    <MovableCard name="planner" title="Planner" className="w-80">
      <ol tabIndex={0} aria-label="Hours" className="flex max-h-96 flex-col gap-0.5 overflow-y-auto pr-1">
        {HOUR_SLOTS.map((hour) => {
          const key = slotKey(hour);
          const name = taskName(plannerAssignments[key] ?? null);
          return (
            <HourSlot
              key={key}
              slotId={key}
              label={key}
              taskName={name}
              onClear={() => clearSlot(key)}
            />
          );
        })}
      </ol>
    </MovableCard>
  );
}

type HourSlotProps = {
  slotId: string;
  label: string;
  taskName: string | null;
  onClear: () => void;
};

const HourSlot = ({ slotId, label, taskName, onClear }: HourSlotProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: `slot:${slotId}` });

  return (
    <li
      ref={setNodeRef}
      className={cn(
        'flex min-h-8 items-center gap-3 rounded-md border border-transparent px-2 text-sm transition-colors',
        isOver && 'border-brand bg-brand/10',
      )}
    >
      <Text as="span" variant="hint" className="w-12 shrink-0 font-mono">
        {label}
      </Text>
      {taskName ? (
        <div className="flex flex-1 items-center gap-2">
          <span className="flex-1 truncate">{taskName}</span>
          <Button variant="ghost" size="icon-xs" onClick={onClear} aria-label={`Clear ${label}`}>
            <X className="size-3.5" />
          </Button>
        </div>
      ) : (
        <span className="flex-1 text-xs text-muted-foreground">
          —
        </span>
      )}
    </li>
  );
};
