import { useEffect } from 'react';
import { useStore } from '../lib/store';
import type { ToolName } from '../lib/types';

const TOOL_HOTKEYS: Record<string, ToolName> = {
  '1': 'spaces',
  '2': 'timer',
  '3': 'tasks',
  '4': 'notes',
  '5': 'planner',
  '6': 'stats',
  '7': 'calendar',
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}

function toggleFullscreen() {
  if (typeof document === 'undefined') return;
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen();
}

export function useShortcuts() {
  const toggleTool = useStore((s) => s.toggleTool);
  const toggleTimer = useStore((s) => s.toggleTimer);
  const toggleTheme = useStore((s) => s.toggleTheme);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;

      const tool = TOOL_HOTKEYS[e.key];
      if (tool) {
        e.preventDefault();
        toggleTool(tool);
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        toggleTimer();
        return;
      }
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleTool, toggleTimer, toggleTheme]);
}
