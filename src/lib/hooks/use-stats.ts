"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export interface SiteStats {
  userCount: number;
  averageTemperature: number;
}

export const statsKeys = {
  all: ["stats"] as const,
  site: () => [...statsKeys.all, "site"] as const,
};

// 유저 수 포맷: 1000명 미만은 그대로, 1000명 이상은 500 단위로 내림 + "+"
export function formatUserCount(count: number): string {
  if (count < 1000) {
    return count.toLocaleString();
  }
  const rounded = Math.floor(count / 500) * 500;
  return `${rounded.toLocaleString()}+`;
}

// 온도 포맷: 소수 첫째자리까지
export function formatTemperature(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

export function useSiteStats() {
  return useQuery({
    queryKey: statsKeys.site(),
    queryFn: async () => {
      const result = await apiClient.stats.site();
      if (!result.success) throw new Error(result.error.message);
      return result.data as SiteStats;
    },
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}
