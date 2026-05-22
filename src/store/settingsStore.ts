import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types';
import { StorageService } from '../services/storage';

interface SettingsState {
  theme: Theme;
  soundEnabled: boolean;
  hapticsEnabled: boolean;

  setTheme: (theme: Theme) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      soundEnabled: true,
      hapticsEnabled: true,

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
      toggleSound: () => set(s => ({ soundEnabled: !s.soundEnabled })),
      toggleHaptics: () => set(s => ({ hapticsEnabled: !s.hapticsEnabled })),
    }),
    {
      name: 'arrow-escape-settings',
      storage: {
        getItem: async (name) => {
          const val = await StorageService.get(name);
          return val ? JSON.parse(val) : null;
        },
        setItem: async (name, value) => {
          await StorageService.set(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await StorageService.remove(name);
        },
      },
    }
  )
);
