import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import type { LayoutEntry, Task, ToolName } from './types';
import { HOUR_SLOTS, SPACES, slotKey, type SpaceId } from './constants';

type LayoutState = Record<ToolName, LayoutEntry>;

const INITIAL_LAYOUT: LayoutState = {
  spaces: { visible: false, top: 120, left: 120, z: 1 },
  timer: { visible: false, top: 140, left: 360, z: 2 },
  tasks: { visible: false, top: 160, left: 600, z: 3 },
  notes: { visible: false, top: 200, left: 840, z: 4 },
  planner: { visible: false, top: 220, left: 1080, z: 5 },
};

const INITIAL_SLOTS: Record<string, string | null> = HOUR_SLOTS.reduce(
  (acc, hour) => {
    acc[slotKey(hour)] = null;
    return acc;
  },
  {} as Record<string, string | null>,
);

type Store = {
  tasks: Task[];
  addTask: (name: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (fromId: string, toId: string) => void;

  note: string;
  setNote: (value: string) => void;

  plannerAssignments: Record<string, string | null>;
  assignTaskToSlot: (key: string, taskId: string | null) => void;
  clearSlot: (key: string) => void;

  spaceId: SpaceId;
  setSpace: (id: SpaceId) => void;

  layout: LayoutState;
  topZ: number;
  toggleTool: (name: ToolName) => void;
  moveTool: (name: ToolName, delta: { x: number; y: number }) => void;
  bringToFront: (name: ToolName) => void;

  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (name) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { id: crypto.randomUUID(), name, done: false },
          ],
        })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t,
          ),
        })),
      deleteTask: (id) =>
        set((s) => {
          const next = { ...s.plannerAssignments };
          for (const key of Object.keys(next)) {
            if (next[key] === id) next[key] = null;
          }
          return {
            tasks: s.tasks.filter((t) => t.id !== id),
            plannerAssignments: next,
          };
        }),
      reorderTasks: (fromId, toId) =>
        set((s) => {
          const from = s.tasks.findIndex((t) => t.id === fromId);
          const to = s.tasks.findIndex((t) => t.id === toId);
          if (from === -1 || to === -1 || from === to) return {};
          return { tasks: arrayMove(s.tasks, from, to) };
        }),

      note: '',
      setNote: (value) => set({ note: value }),

      plannerAssignments: INITIAL_SLOTS,
      assignTaskToSlot: (key, taskId) =>
        set((s) => {
          const next = { ...s.plannerAssignments };
          if (taskId) {
            for (const k of Object.keys(next)) {
              if (next[k] === taskId) next[k] = null;
            }
          }
          next[key] = taskId;
          return { plannerAssignments: next };
        }),
      clearSlot: (key) =>
        set((s) => ({
          plannerAssignments: { ...s.plannerAssignments, [key]: null },
        })),

      spaceId: SPACES[0].id,
      setSpace: (id) => set({ spaceId: id }),

      layout: INITIAL_LAYOUT,
      topZ: 5,
      toggleTool: (name) =>
        set((s) => {
          const entry = s.layout[name];
          const becomingVisible = !entry.visible;
          const nextZ = becomingVisible ? s.topZ + 1 : entry.z;
          return {
            layout: {
              ...s.layout,
              [name]: { ...entry, visible: becomingVisible, z: nextZ },
            },
            topZ: becomingVisible ? nextZ : s.topZ,
          };
        }),
      moveTool: (name, delta) =>
        set((s) => {
          const entry = s.layout[name];
          return {
            layout: {
              ...s.layout,
              [name]: {
                ...entry,
                top: entry.top + delta.y,
                left: entry.left + delta.x,
              },
            },
          };
        }),
      bringToFront: (name) =>
        set((s) => {
          if (s.layout[name].z === s.topZ) return {};
          const nextZ = s.topZ + 1;
          return {
            layout: {
              ...s.layout,
              [name]: { ...s.layout[name], z: nextZ },
            },
            topZ: nextZ,
          };
        }),

      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'life-dashboard',
      version: 1,
      partialize: (s) => ({
        tasks: s.tasks,
        note: s.note,
        plannerAssignments: s.plannerAssignments,
        spaceId: s.spaceId,
        layout: s.layout,
        topZ: s.topZ,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
