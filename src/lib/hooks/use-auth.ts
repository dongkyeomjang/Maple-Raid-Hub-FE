"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "@/types/api";
import { apiClient } from "@/lib/api";

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, nickname: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearAuthState: () => void;
  setUser: (user: UserResponse | null) => void;
}

// 서버가 쿠키로 모든 토큰을 관리 - 프론트는 토큰을 직접 다루지 않음
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (username: string, password: string) => {
        const result = await apiClient.auth.login({ username, password });
        if (result.success) {
          // 서버가 쿠키에 토큰 설정함 - 사용자 정보 가져오기
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
          // 서버가 쿠키에 토큰 설정함 - 사용자 정보 가져오기
          const meResult = await apiClient.auth.me();
          if (meResult.success && meResult.data) {
            set({ user: meResult.data as UserResponse, isAuthenticated: true });
            return true;
          }
        }
        return false;
      },

      logout: async () => {
        await apiClient.auth.logout();
        // 서버가 쿠키 삭제함
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        const result = await apiClient.auth.me();
        if (result.success && result.data) {
          set({ user: result.data as UserResponse, isAuthenticated: true, isLoading: false });
        } else {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearAuthState: () => {
        // API 호출 없이 로딩 상태만 해제 (비로그인 상태 확정)
        set({ isLoading: false });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
