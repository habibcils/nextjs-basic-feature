import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '@/types/auth';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSidebarCollapsed: boolean;
  hasHydrated: boolean;
  setUser: (user: UserProfile | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setHasHydrated: (state: boolean) => void;
  logoutClient: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isSidebarCollapsed: false,
      hasHydrated: false,

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

      setHasHydrated: (state) =>
        set({
          hasHydrated: state,
          isLoading: false,
        }),

      logoutClient: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'learn_nextjs_user_store', // Key di localStorage untuk data non-rahasia
      storage: createJSONStorage(() => localStorage),
      // Hanya persist user data normal dan preferensi sidebar (JANGAN simpan accessToken/refreshToken di sini!)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
