import { create } from 'zustand';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSidebarCollapsed: boolean;
  setUser: (user: User | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  logoutClient: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isSidebarCollapsed: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setSidebarCollapsed: (collapsed) =>
    set({
      isSidebarCollapsed: collapsed,
    }),

  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),

  logoutClient: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));

