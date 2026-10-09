import React from 'react';
import Head from 'next/head';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { BackgroundVideo } from '../components/background-video';
import { Menu } from '../components/menu';
import { OtherControls } from '../components/other-controls';
import { TimerAlert } from '../components/timer-alert';
import { TimerDriver } from '../components/timer-driver';
import {
  Calendar,
  Notes,
  Planner,
  Spaces,
  Stats,
  Tasks,
  Timer,
} from '../components/tools';
import { useShortcuts } from '../hooks/use-shortcuts';
import { resolveSpace } from '../lib/constants';
import { useStore } from '../lib/store';
import type { ToolName } from '../lib/types';

export default function Home() {
  const hasHydrated = useStore((s) => s.hasHydrated);
  const spaceId = useStore((s) => s.spaceId);
  const customSpaces = useStore((s) => s.customSpaces);
  const toggleTool = useStore((s) => s.toggleTool);
  const moveTool = useStore((s) => s.moveTool);
  const reorderTasks = useStore((s) => s.reorderTasks);
  const assignTaskToSlot = useStore((s) => s.assignTaskToSlot);

  useShortcuts();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;

    if (activeId.startsWith('tool:')) {
      const name = activeId.slice(5) as ToolName;
      // where the window was dropped on screen (its shown position may be clamped)
      const rect = event.active.rect.current.translated;
      if (rect) moveTool(name, { top: rect.top, left: rect.left });
      return;
    }

    if (activeId.startsWith('task:')) {
      const taskId = activeId.slice(5);
      if (overId?.startsWith('slot:')) {
        assignTaskToSlot(overId.slice(5), taskId);
      } else if (overId?.startsWith('task:')) {
        reorderTasks(taskId, overId.slice(5));
      }
    }
  };

  return (
    <main className="relative isolate h-dvh w-screen overflow-hidden select-none">
      <Head>
        <title>Life Dashboard</title>
        <meta name="description" content="For when you need help." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="sr-only">Life Dashboard</h1>

      {hasHydrated && <BackgroundVideo space={resolveSpace(spaceId, customSpaces)} />}
      <TimerDriver />
      <TimerAlert />

      <Menu setTool={toggleTool} />
      <OtherControls />

      <DndContext id="life-dashboard" sensors={sensors} onDragEnd={handleDragEnd}>
        <Spaces />
        <Timer />
        <Tasks />
        <Notes />
        <Planner />
        <Stats />
        <Calendar />
      </DndContext>
    </main>
  );
}
