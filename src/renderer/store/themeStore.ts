import { create } from 'zustand';

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

      // Save to settings (if Electron API is available)
      if (window.electron && typeof window.electron.setSetting === 'function') {
        window.electron.setSetting('theme', newTheme);
      } else {
        // Fallback to localStorage
        localStorage.setItem('theme', newTheme);
      }

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

    // Save to settings (if Electron API is available)
    if (window.electron && typeof window.electron.setSetting === 'function') {
      window.electron.setSetting('theme', theme);
    } else {
      // Fallback to localStorage
      localStorage.setItem('theme', theme);
    }

    set({ theme });
  },

  initTheme: async () => {
    try {
      let savedTheme: string | undefined;
      
      // Try to load from Electron settings
      if (window.electron && typeof window.electron.getSetting === 'function') {
        savedTheme = await window.electron.getSetting('theme');
      } else {
        // Fallback to localStorage
        savedTheme = localStorage.getItem('theme') || undefined;
      }
      
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        set(() => {
          // Update DOM
          if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: savedTheme as 'dark' | 'light' };
        });
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  },
}));
