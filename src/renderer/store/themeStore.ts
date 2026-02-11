import { create } from 'zustand';
import type { AppSettings } from '@shared/types';

interface ThemeStore {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  initTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      
      // Update DOM
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Save to settings
      window.electron.setSetting('theme', newTheme);

      return { theme: newTheme };
    });
  },

  setTheme: (theme) => {
    // Update DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to settings
    window.electron.setSetting('theme', theme);

    set({ theme });
  },

  initTheme: async () => {
    try {
      const savedTheme = await window.electron.getSetting('theme');
      if (savedTheme) {
        set((state) => {
          // Update DOM
          if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: savedTheme };
        });
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  },
}));
