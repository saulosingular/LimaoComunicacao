import { create } from 'zustand';

interface IDashboardState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  titlePage: string;
  setTitlePage: (title: string) => void;
}

export const useDashboard = create<IDashboardState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  titlePage: 'Dashboard',
  setTitlePage: (title) => set({ titlePage: title }),
}));
