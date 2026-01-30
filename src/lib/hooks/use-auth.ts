"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse, AuthTokenResponse } from "@/types/api";
import { apiClient, setTokens, clearTokens } from "@/lib/api";

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, nickname: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: UserResponse | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (username: string, password: string) => {
        const result = await apiClient.auth.login({ username, password });
        if (result.success) {
          const data = result.data as AuthTokenResponse;
          setTokens(data.accessToken, data.refreshToken);

          // 로그인 후 사용자 정보 가져오기
          const meResult = await apiClient.auth.me();
          if (meResult.success && meResult.data) {
            set({ user: meResult.data as UserResponse, isAuthenticated: true });
            return true;
          }
        }
        return false;
      },

      signup: async (username: string, password: string, nickname: string) => {
        const result = await apiClient.auth.signup({ username, password, nickname });
        if (result.success) {
          // 회원가입 성공 후 로그인 진행
          return get().login(username, password);
        }
        return false;
      },

      logout: async () => {
        await apiClient.auth.logout();
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        const result = await apiClient.auth.me();
        if (result.success && result.data) {
          set({ user: result.data as UserResponse, isAuthenticated: true, isLoading: false });
        } else {
          clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
