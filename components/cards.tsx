// andremov-brand-check-unique: the translucent floating tool windows over the background video, dragged by their title bar, are this dashboard's UI
import React, { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@andremov/brand';
import { Button } from '@andremov/brand/ui/button';
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

const EDGE = 8;

/** The viewport size, once mounted; null on the server. */
function useViewport() {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const read = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);
  return size;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

type MovableCardProps = {
  name: ToolName;
  title: string;
  className?: string;
  children: ReactNode;
};

export function MovableCard({ name, title, className, children }: MovableCardProps) {
  const entry = useStore((s) => s.layout[name]);
  const toggleTool = useStore((s) => s.toggleTool);
  const bringToFront = useStore((s) => s.bringToFront);
  const viewport = useViewport();
  const boxRef = useRef<HTMLElement | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  const { listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tool:${name}`,
  });

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setBox({ w: el.offsetWidth, h: el.offsetHeight }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // A window saved on a wide screen stays reachable on a narrow one: it is shown inside the
  // viewport, and the stored position only changes when the user drags it.
  const left =
    viewport && box ? clamp(entry.left, EDGE, viewport.w - box.w - EDGE) : entry.left;
  const top =
    viewport && box ? clamp(entry.top, EDGE, viewport.h - box.h - EDGE) : entry.top;

  const style: React.CSSProperties = {
    top,
    left,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 9999 : entry.z + 10,
  };

  return (
    <section
      ref={(el) => {
        setNodeRef(el);
        boxRef.current = el;
      }}
      onPointerDownCapture={() => bringToFront(name)}
      // a closed window is only faded out, so keep it out of the tab order and the a11y tree
      inert={!entry.visible}
      aria-label={title}
      data-tool={name}
      className={cn(
        'fixed flex max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-xl border bg-card/90 text-card-foreground shadow-lg backdrop-blur-md transition-opacity',
        !entry.visible && 'pointer-events-none opacity-0',
        className,
      )}
      style={style}
    >
      {/* pointer-only drag handle (no keyboard sensor), so it carries no button role */}
      <div
        className="flex h-8 shrink-0 cursor-grab touch-none items-center gap-2 border-b px-2 active:cursor-grabbing"
        {...listeners}
      >
        <span className="flex-1 truncate text-[11px] font-semibold tracking-wider text-muted-foreground uppercase select-none">
          {title}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => toggleTool(name)}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Close ${title}`}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">{children}</div>
    </section>
  );
}
