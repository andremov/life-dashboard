import React from 'react';
import { X } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { MovableCard } from '../cards';
import { HOUR_SLOTS, slotKey } from '../../lib/constants';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';

export function Planner() {
  const tasks = useStore((s) => s.tasks);
  const plannerAssignments = useStore((s) => s.plannerAssignments);
  const clearSlot = useStore((s) => s.clearSlot);

  const taskName = (id: string | null) =>
    id ? tasks.find((t) => t.id === id)?.name ?? null : null;

  return (
    <MovableCard name="planner" title="Planner" className="w-80">
      <div className="flex max-h-96 flex-col gap-0.5 overflow-y-auto pr-1">
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
      </div>
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
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-8 items-center gap-3 rounded-md border border-transparent px-2 text-sm transition-colors',
        isOver && 'border-primary bg-primary/10',
      )}
    >
      <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
        {label}
      </span>
      {taskName ? (
        <div className="flex flex-1 items-center gap-2">
          <span className="flex-1 truncate">{taskName}</span>
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear slot"
            className="inline-flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <span className="flex-1 text-xs text-muted-foreground/60">—</span>
      )}
    </div>
  );
};
