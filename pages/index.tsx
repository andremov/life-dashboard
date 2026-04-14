import React, { useState } from 'react';
import Head from 'next/head';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Menu } from '../components/menu';
import { OtherControls } from '../components/other-controls';
import { Tasks, Spaces, Timer, Music } from '../components/tools';
import { useTheme } from '../hooks/use-theme';
import type { ToolName } from '../lib/types';

type Position = { top: number; left: number };

const INITIAL_POSITIONS: Record<ToolName, Position> = {
  spaces: { top: 120, left: 120 },
  timer: { top: 140, left: 180 },
  music: { top: 200, left: 240 },
  tasks: { top: 160, left: 300 },
};

const INITIAL_VISIBILITY: Record<ToolName, boolean> = {
  spaces: false,
  timer: false,
  music: false,
  tasks: false,
};

export default function Home() {
  const { theme } = useTheme();
  const [activeTools, setActiveTools] =
    useState<Record<ToolName, boolean>>(INITIAL_VISIBILITY);
  const [positions, setPositions] =
    useState<Record<ToolName, Position>>(INITIAL_POSITIONS);

  const handleToolChange = (name: ToolName) => {
    setActiveTools((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const id = event.active.id as ToolName;
    if (!(id in positions)) return;
    setPositions((prev) => ({
      ...prev,
      [id]: {
        top: prev[id].top + event.delta.y,
        left: prev[id].left + event.delta.x,
      },
    }));
  };

  return (
    <div className={`container ${theme}-theme`}>
      <Head>
        <title>Life Dashboard</title>
        <meta name="description" content="For when you need help." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Menu setTool={handleToolChange} />
      <OtherControls />

      <DndContext onDragEnd={handleDragEnd}>
        <Tasks
          visible={activeTools.tasks}
          toggleCard={() => handleToolChange('tasks')}
          position={positions.tasks}
        />
        <Timer
          visible={activeTools.timer}
          toggleCard={() => handleToolChange('timer')}
          position={positions.timer}
        />
        <Spaces
          visible={activeTools.spaces}
          toggleCard={() => handleToolChange('spaces')}
          position={positions.spaces}
        />
        <Music
          visible={activeTools.music}
          toggleCard={() => handleToolChange('music')}
          position={positions.music}
        />
      </DndContext>
    </div>
  );
}
