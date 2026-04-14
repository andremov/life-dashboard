import React, { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../lib/utils';
import { useStore } from '../lib/store';
import type { ToolName } from '../lib/types';

type StaticCardProps = {
  className?: string;
  children: ReactNode;
};

export function StaticCard({ className, children }: StaticCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card/90 text-card-foreground shadow-lg backdrop-blur-md',
        className,
      )}
    >
      {children}
    </div>
  );
}

type MovableCardProps = {
  name: ToolName;
  className?: string;
  children: ReactNode;
};

export function MovableCard({ name, className, children }: MovableCardProps) {
  const entry = useStore((s) => s.layout[name]);
  const toggleTool = useStore((s) => s.toggleTool);
  const bringToFront = useStore((s) => s.bringToFront);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: `tool:${name}` });

  const style: React.CSSProperties = {
    top: entry.top,
    left: entry.left,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 9999 : entry.z + 10,
  };

  return (
    <div
      ref={setNodeRef}
      onPointerDownCapture={() => bringToFront(name)}
      className={cn(
        'fixed flex flex-col overflow-hidden rounded-xl border bg-card/90 text-card-foreground shadow-lg backdrop-blur-md transition-opacity',
        !entry.visible && 'pointer-events-none opacity-0',
        className,
      )}
      style={style}
    >
      <div
        className="flex h-8 cursor-grab items-center justify-end border-b px-1 active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <button
          type="button"
          onClick={() => toggleTool(name)}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Close card"
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-3">{children}</div>
    </div>
  );
}
