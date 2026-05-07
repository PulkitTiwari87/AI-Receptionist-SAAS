import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type AccentColor = 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
export type ThemeMode = 'light' | 'dark' | 'system';
export type SidebarStyle = 'default' | 'compact' | 'minimal';

interface ThemeState {
  mode: ThemeMode;
  accent: AccentColor;
  sidebarStyle: SidebarStyle;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setSidebarStyle: (style: SidebarStyle) => void;
}

// Helper: resolve the effective dark/light decision
export const resolveIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  // system
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Apply class immediately (called on every mode change AND at module load)
const applyDarkClass = (mode: ThemeMode) => {
  if (resolveIsDark(mode)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Read from localStorage
const savedMode = (localStorage.getItem('theme-mode') as ThemeMode) || 'light';
const savedAccent = (localStorage.getItem('theme-accent') as AccentColor) || 'blue';
const savedSidebar = (localStorage.getItem('theme-sidebar') as SidebarStyle) || 'default';

// Apply IMMEDIATELY before store is even created (prevents flash)
applyDarkClass(savedMode);

export const useThemeStore = create<ThemeState>()(
  subscribeWithSelector((set) => ({
    mode: savedMode,
    accent: savedAccent,
    sidebarStyle: savedSidebar,

    setMode: (mode) => {
      localStorage.setItem('theme-mode', mode);
      applyDarkClass(mode); // Synchronously update DOM
      set({ mode });
    },

    setAccent: (accent) => {
      localStorage.setItem('theme-accent', accent);
      set({ accent });
    },

    setSidebarStyle: (sidebarStyle) => {
      localStorage.setItem('theme-sidebar', sidebarStyle);
      set({ sidebarStyle });
    },
  }))
);
