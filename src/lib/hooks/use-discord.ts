"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { DiscordStatusResponse } from "@/types/api";

export const discordKeys = {
  all: ["discord"] as const,
  status: () => [...discordKeys.all, "status"] as const,
};

export function useDiscordStatus() {
  return useQuery({
    queryKey: discordKeys.status(),
    queryFn: async () => {
      const result = await apiClient.discord.getStatus();
      if (result.success) return result.data as DiscordStatusResponse;
      throw new Error(result.error.message);
    },
  });
}

export function useDiscordLink() {
  return useMutation({
    mutationFn: async () => {
      const result = await apiClient.discord.getAuthUrl();
      if (result.success && result.data) {
        const data = result.data as { authUrl: string };
        window.location.href = data.authUrl;
        return;
      }
      throw new Error("디스코드 인증 URL을 가져올 수 없습니다.");
    },
  });
}

export function useDiscordUnlink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await apiClient.discord.unlink();
      if (!result.success) throw new Error(result.error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discordKeys.all });
    },
  });
}
