"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { WorldGroupConfig, BossConfig, BossBundleConfig } from "@/types/api";

export const configKeys = {
  all: ["config"] as const,
  worldGroups: () => [...configKeys.all, "worldGroups"] as const,
  bosses: () => [...configKeys.all, "bosses"] as const,
  bundles: () => [...configKeys.all, "bundles"] as const,
};

// 공개 설정 데이터 - 인증 없이 항상 조회 가능
export function useWorldGroups() {
  return useQuery({
    queryKey: configKeys.worldGroups(),
    queryFn: async () => {
      const result = await apiClient.config.worldGroups();
      if (!result.success) throw new Error(result.error.message);
      return result.data as WorldGroupConfig[];
    },
    staleTime: Infinity, // Config rarely changes
  });
}

export function useBosses() {
  return useQuery({
    queryKey: configKeys.bosses(),
    queryFn: async () => {
      const result = await apiClient.config.bosses();
      if (!result.success) throw new Error(result.error.message);
      return result.data as BossConfig[];
    },
    staleTime: Infinity,
  });
}

export function useBundles() {
  return useQuery({
    queryKey: configKeys.bundles(),
    queryFn: async () => {
      const result = await apiClient.config.bundles();
      if (!result.success) throw new Error(result.error.message);
      return result.data as BossBundleConfig[];
    },
    staleTime: Infinity,
  });
}
