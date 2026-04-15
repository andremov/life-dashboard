import React, { useMemo, useState } from 'react';
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
  const filterTag = useStore((s) => s.filterTag);
  const setFilterTag = useStore((s) => s.setFilterTag);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) for (const tag of t.tags) set.add(tag);
    return Array.from(set).sort();
  }, [tasks]);

  const filteredTasks = useMemo(
    () => (filterTag ? tasks.filter((t) => t.tags.includes(filterTag)) : tasks),
    [tasks, filterTag],
  );

  const sortableIds = filteredTasks.map((t) => `task:${t.id}`);

  return (
    <MovableCard name="tasks" title="Tasks" className="w-72">
      {allTags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          <TagChip
            label="all"
            active={filterTag === null}
            onClick={() => setFilterTag(null)}
          />
          {allTags.map((tag) => (
            <TagChip
              key={tag}
              label={`#${tag}`}
              active={filterTag === tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
            />
          ))}
        </div>
      )}
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-1">
          {filteredTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
              onTagClick={(tag) =>
                setFilterTag(filterTag === tag ? null : tag)
              }
            />
          ))}
          {filteredTasks.length === 0 && (
            <div className="px-1 py-2 text-xs text-muted-foreground">
              {filterTag ? `No tasks tagged #${filterTag}.` : 'No tasks yet.'}
            </div>
          )}
        </div>
      </SortableContext>
      <TaskInput addTask={addTask} />
    </MovableCard>
  );
}

type TagChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const TagChip = ({ label, active, onClick }: TagChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors',
      active
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border text-muted-foreground hover:border-accent hover:text-foreground',
    )}
  >
    {label}
  </button>
);

type TaskRowProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onTagClick: (tag: string) => void;
};

const TaskRow = ({ task, onToggle, onDelete, onTagClick }: TaskRowProps) => {
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
      <div className="flex min-w-0 flex-1 flex-col">
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
          className="cursor-pointer truncate"
        >
          {task.name}
        </span>
        {task.tags.length > 0 && (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className="rounded-full bg-accent/50 px-1.5 py-0 text-[9px] text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
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
        placeholder="Add task... (use #tag)"
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
