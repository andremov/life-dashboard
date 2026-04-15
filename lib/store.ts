import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import type {
  LayoutEntry,
  Note,
  Space,
  Task,
  Theme,
  TimerInterval,
  ToolName,
} from './types';
import { HOUR_SLOTS, INTERVAL_DURATIONS, SPACES, slotKey } from './constants';
import { extractVideoId, thumbnailUrl } from './youtube';

function parseTaskInput(raw: string): { name: string; tags: string[] } {
  const tags: string[] = [];
  const stripped = raw
    .replace(/#([A-Za-z0-9_-]+)/g, (_match, tag: string) => {
      tags.push(tag.toLowerCase());
      return '';
    })
    .replace(/\s+/g, ' ')
    .trim();
  return { name: stripped, tags: Array.from(new Set(tags)) };
}

type LayoutState = Record<ToolName, LayoutEntry>;

const INITIAL_LAYOUT: LayoutState = {
  spaces: { visible: false, top: 120, left: 120, z: 1 },
  timer: { visible: false, top: 140, left: 360, z: 2 },
  tasks: { visible: false, top: 160, left: 600, z: 3 },
  notes: { visible: false, top: 200, left: 840, z: 4 },
  planner: { visible: false, top: 220, left: 260, z: 5 },
  stats: { visible: false, top: 260, left: 500, z: 6 },
  calendar: { visible: false, top: 280, left: 760, z: 7 },
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
  filterTag: string | null;
  setFilterTag: (tag: string | null) => void;

  notes: Note[];
  activeNoteId: string | null;
  createNote: () => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string) => void;
  updateNoteTitle: (id: string, title: string) => void;
  updateNoteBody: (id: string, body: string) => void;

  plannerAssignments: Record<string, string | null>;
  assignTaskToSlot: (key: string, taskId: string | null) => void;
  clearSlot: (key: string) => void;

  spaceId: string;
  setSpace: (id: string) => void;
  customSpaces: Space[];
  addCustomSpace: (input: string, title?: string) => string | null;
  removeCustomSpace: (id: string) => void;
  spaceMuted: boolean;
  setSpaceMuted: (value: boolean) => void;
  spaceVolume: number;
  setSpaceVolume: (value: number) => void;
  spaceOverlay: number;
  setSpaceOverlay: (value: number) => void;

  theme: Theme;
  themeSet: boolean;
  setTheme: (value: Theme) => void;
  toggleTheme: () => void;
  syncSystemTheme: () => void;

  timerInterval: TimerInterval;
  timerRemaining: number;
  timerRunning: boolean;
  timerDurations: Record<TimerInterval, number>;
  timerAlert: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  changeTimerInterval: (next: TimerInterval) => void;
  tickTimer: () => void;
  setTimerDuration: (key: TimerInterval, seconds: number) => void;
  dismissTimerAlert: () => void;
  completions: number[];

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
      addTask: (rawName) =>
        set((s) => {
          const { name, tags } = parseTaskInput(rawName);
          if (!name) return {};
          return {
            tasks: [
              ...s.tasks,
              { id: crypto.randomUUID(), name, done: false, tags },
            ],
          };
        }),
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
      filterTag: null,
      setFilterTag: (tag) => set({ filterTag: tag }),

      notes: [],
      activeNoteId: null,
      createNote: () =>
        set((s) => {
          const newNote: Note = {
            id: crypto.randomUUID(),
            title: 'Untitled',
            body: '',
            updatedAt: Date.now(),
          };
          return {
            notes: [newNote, ...s.notes],
            activeNoteId: newNote.id,
          };
        }),
      deleteNote: (id) =>
        set((s) => {
          const nextNotes = s.notes.filter((n) => n.id !== id);
          return {
            notes: nextNotes,
            activeNoteId:
              s.activeNoteId === id ? nextNotes[0]?.id ?? null : s.activeNoteId,
          };
        }),
      selectNote: (id) => set({ activeNoteId: id }),
      updateNoteTitle: (id, title) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, title, updatedAt: Date.now() } : n,
          ),
        })),
      updateNoteBody: (id, body) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, body, updatedAt: Date.now() } : n,
          ),
        })),

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
      customSpaces: [],
      addCustomSpace: (input, title) => {
        const id = extractVideoId(input);
        if (!id) return null;
        const existing = [...SPACES, ...get().customSpaces].find(
          (s) => s.id === id,
        );
        if (existing) {
          set({ spaceId: id });
          return id;
        }
        const space: Space = {
          id,
          title: title?.trim() || 'Custom Space',
          thumbnail: thumbnailUrl(id),
        };
        set((s) => ({
          customSpaces: [...s.customSpaces, space],
          spaceId: id,
        }));
        return id;
      },
      removeCustomSpace: (id) =>
        set((s) => {
          const nextCustom = s.customSpaces.filter((space) => space.id !== id);
          const nextSpaceId = s.spaceId === id ? SPACES[0].id : s.spaceId;
          return { customSpaces: nextCustom, spaceId: nextSpaceId };
        }),
      spaceMuted: true,
      setSpaceMuted: (value) => set({ spaceMuted: value }),
      spaceVolume: 50,
      setSpaceVolume: (value) => set({ spaceVolume: value }),
      spaceOverlay: 0.2,
      setSpaceOverlay: (value) => set({ spaceOverlay: value }),

      theme: 'dark',
      themeSet: false,
      setTheme: (value) => set({ theme: value, themeSet: true }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark', themeSet: true })),
      syncSystemTheme: () => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        if (get().themeSet) return;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        set({ theme: prefersDark ? 'dark' : 'light' });
      },

      timerInterval: 'pomodoro',
      timerRemaining: INTERVAL_DURATIONS.pomodoro,
      timerRunning: false,
      timerDurations: { ...INTERVAL_DURATIONS },
      timerAlert: false,
      completions: [],
      startTimer: () => set({ timerRunning: true, timerAlert: false }),
      pauseTimer: () => set({ timerRunning: false }),
      toggleTimer: () =>
        set((s) => ({
          timerRunning: !s.timerRunning,
          timerAlert: false,
        })),
      resetTimer: () =>
        set((s) => ({
          timerRunning: false,
          timerRemaining: s.timerDurations[s.timerInterval],
          timerAlert: false,
        })),
      changeTimerInterval: (next) =>
        set((s) => ({
          timerInterval: next,
          timerRemaining: s.timerDurations[next],
          timerRunning: false,
          timerAlert: false,
        })),
      tickTimer: () =>
        set((s) => {
          if (!s.timerRunning) return {};
          if (s.timerRemaining <= 1) {
            const wasPomodoro = s.timerInterval === 'pomodoro';
            return {
              timerRunning: false,
              timerRemaining: 0,
              timerAlert: true,
              completions: wasPomodoro
                ? [...s.completions, Date.now()]
                : s.completions,
            };
          }
          return { timerRemaining: s.timerRemaining - 1 };
        }),
      dismissTimerAlert: () => set({ timerAlert: false }),
      setTimerDuration: (key, seconds) =>
        set((s) => {
          const nextDurations = { ...s.timerDurations, [key]: seconds };
          const shouldResetRemaining =
            s.timerInterval === key && !s.timerRunning;
          return {
            timerDurations: nextDurations,
            timerRemaining: shouldResetRemaining ? seconds : s.timerRemaining,
          };
        }),

      layout: INITIAL_LAYOUT,
      topZ: 7,
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
      version: 3,
      migrate: (persisted: unknown, fromVersion) => {
        const state = persisted as
          | (Partial<Store> & { note?: string })
          | undefined;
        if (!state) return state as unknown as Store;
        if (fromVersion < 2 && Array.isArray(state.tasks)) {
          state.tasks = state.tasks.map((t) => ({
            ...t,
            tags: Array.isArray((t as Task).tags) ? (t as Task).tags : [],
          }));
        }
        if (fromVersion < 3) {
          const legacy = state.note;
          if (typeof legacy === 'string' && legacy.trim()) {
            const id = crypto.randomUUID();
            state.notes = [
              {
                id,
                title: 'Untitled',
                body: legacy,
                updatedAt: Date.now(),
              },
            ];
            state.activeNoteId = id;
          } else if (!Array.isArray(state.notes)) {
            state.notes = [];
            state.activeNoteId = null;
          }
          delete state.note;
        }
        if (state.layout) {
          state.layout = { ...INITIAL_LAYOUT, ...state.layout };
        }
        if (!Array.isArray(state.completions)) state.completions = [];
        return state as unknown as Store;
      },
      partialize: (s) => ({
        tasks: s.tasks,
        notes: s.notes,
        activeNoteId: s.activeNoteId,
        plannerAssignments: s.plannerAssignments,
        spaceId: s.spaceId,
        customSpaces: s.customSpaces,
        spaceMuted: s.spaceMuted,
        spaceVolume: s.spaceVolume,
        spaceOverlay: s.spaceOverlay,
        theme: s.theme,
        themeSet: s.themeSet,
        timerDurations: s.timerDurations,
        completions: s.completions,
        layout: s.layout,
        topZ: s.topZ,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<Store>;
        return {
          ...currentState,
          ...persisted,
          layout: { ...currentState.layout, ...(persisted.layout ?? {}) },
          plannerAssignments: {
            ...currentState.plannerAssignments,
            ...(persisted.plannerAssignments ?? {}),
          },
          timerDurations: {
            ...currentState.timerDurations,
            ...(persisted.timerDurations ?? {}),
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
