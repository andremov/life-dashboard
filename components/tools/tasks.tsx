import React, { useState } from 'react';
import { Check, GripVertical, Plus, Trash2 } from 'lucide-react';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MovableCard } from '../cards';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useStore } from '../../lib/store';
import type { Task } from '../../lib/types';
import { cn } from '../../lib/utils';

export function Tasks() {
  const tasks = useStore((s) => s.tasks);
  const addTask = useStore((s) => s.addTask);
  const toggleTask = useStore((s) => s.toggleTask);
  const deleteTask = useStore((s) => s.deleteTask);

  const sortableIds = tasks.map((t) => `task:${t.id}`);

  return (
    <MovableCard name="tasks" className="w-72">
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-1">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="px-1 py-2 text-xs text-muted-foreground">
              No tasks yet.
            </div>
          )}
        </div>
      </SortableContext>
      <TaskInput addTask={addTask} />
    </MovableCard>
  );
}

type TaskRowProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

const TaskRow = ({ task, onToggle, onDelete }: TaskRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `task:${task.id}` });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-1 rounded-md px-1 py-1 text-sm transition-colors hover:bg-accent/50',
        task.done && 'text-muted-foreground line-through',
      )}
    >
      <button
        type="button"
        aria-label="Drag task"
        className="flex size-5 shrink-0 cursor-grab items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="size-4" />
      </button>
      <button
        type="button"
        onClick={onToggle}
        aria-label={task.done ? 'Mark task as not done' : 'Mark task as done'}
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded border',
          task.done
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-input',
        )}
      >
        {task.done && <Check className="size-3.5" />}
      </button>
      <span
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex-1 cursor-pointer truncate"
      >
        {task.name}
      </span>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete task"
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
};

type TaskInputProps = {
  addTask: (name: string) => void;
};

const TaskInput = ({ addTask }: TaskInputProps) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed) {
      addTask(trimmed);
      setName('');
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleEnter}
        placeholder="Add a task..."
        className="h-8 flex-1 text-sm"
      />
      <Button
        size="icon"
        className="size-8"
        disabled={!name.trim()}
        onClick={handleAdd}
        aria-label="Add task"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};
