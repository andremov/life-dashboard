// andremov-brand-check-unique: the sortable task rows (drag handle, hover-revealed delete, inline #tag pills) are this dashboard's checklist
import React, { useMemo, useState } from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SegmentedControl, Text, TextField, cn } from '@andremov/brand';
import { Button } from '@andremov/brand/ui/button';
import { Checkbox } from '@andremov/brand/ui/checkbox';
import { MovableCard } from '../cards';
import { useStore } from '../../lib/store';
import type { Task } from '../../lib/types';

const ALL = '\u0000all';

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

  // A filter whose last task was deleted would otherwise leave an empty list and no chip to clear it.
  const activeTag = filterTag && allTags.includes(filterTag) ? filterTag : null;

  const filteredTasks = useMemo(
    () => (activeTag ? tasks.filter((t) => t.tags.includes(activeTag)) : tasks),
    [tasks, activeTag],
  );

  const sortableIds = filteredTasks.map((t) => `task:${t.id}`);

  return (
    <MovableCard name="tasks" title="Tasks" className="w-72">
      {allTags.length > 0 && (
        <SegmentedControl
          aria-label="Filter by tag"
          variant="chips"
          size="sm"
          className="mb-2"
          options={[
            { value: ALL, label: 'all' },
            ...allTags.map((tag) => ({ value: tag, label: `#${tag}` })),
          ]}
          value={activeTag ?? ALL}
          onChange={(v) => setFilterTag(v === ALL ? null : v)}
          arrowKeys={false}
        />
      )}
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-1">
          {filteredTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
              onTagClick={(tag) => setFilterTag(activeTag === tag ? null : tag)}
            />
          ))}
        </ul>
      </SortableContext>
      {filteredTasks.length === 0 && (
        <Text variant="hint" className="px-1 py-2">
          {activeTag ? `No tasks tagged #${activeTag}.` : 'No tasks yet.'}
        </Text>
      )}
      <TaskInput addTask={addTask} />
    </MovableCard>
  );
}

type TaskRowProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onTagClick: (tag: string) => void;
};

const TaskRow = ({ task, onToggle, onDelete, onTagClick }: TaskRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `task:${task.id}` });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  const checkboxId = `task-${task.id}`;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-1 rounded-md px-1 py-1 text-sm transition-colors hover:bg-muted/60',
        task.done && 'text-muted-foreground line-through',
      )}
    >
      <button
        type="button"
        aria-label={`Drag ${task.name}`}
        className="flex size-5 shrink-0 cursor-grab touch-none items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="size-4" />
      </button>
      <Checkbox
        id={checkboxId}
        checked={task.done}
        onCheckedChange={onToggle}
        className="mr-1"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <label htmlFor={checkboxId} className="cursor-pointer truncate">
          {task.name}
        </label>
        {task.tags.length > 0 && (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onDelete}
        aria-label={`Delete ${task.name}`}
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-danger-text"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </li>
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

  return (
    <div className="mt-3 flex items-center gap-2">
      <TextField
        value={name}
        onChange={setName}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
        }}
        aria-label="New task"
        placeholder="Add task... (use #tag)"
        className="flex-1"
      />
      <Button size="icon-sm" disabled={!name.trim()} onClick={handleAdd} aria-label="Add task">
        <Plus className="size-4" />
      </Button>
    </div>
  );
};
