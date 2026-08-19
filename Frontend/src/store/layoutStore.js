import { create } from 'zustand';

export const useLayoutStore = create((set) => ({
  isAskLoopOpen: false,
  toggleAskLoop: () => set((state) => ({ isAskLoopOpen: !state.isAskLoopOpen })),
  setAskLoopOpen: (isOpen) => set({ isAskLoopOpen: isOpen }),

  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
