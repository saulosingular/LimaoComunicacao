import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useTheme = create<IThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
