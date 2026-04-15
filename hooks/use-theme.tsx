import { useEffect, type ReactNode } from 'react';
import { useStore } from '../lib/store';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useStore((s) => s.theme);
  const hasHydrated = useStore((s) => s.hasHydrated);
  const syncSystemTheme = useStore((s) => s.syncSystemTheme);

  useEffect(() => {
    if (!hasHydrated) return;
    syncSystemTheme();
  }, [hasHydrated, syncSystemTheme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{children}</>;
}

export function useTheme() {
  const theme = useStore((s) => s.theme);
  const toggle = useStore((s) => s.toggleTheme);
  return { theme, toggle };
}
