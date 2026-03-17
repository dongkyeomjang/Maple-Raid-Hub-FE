"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { RecoveryChallengeResponse, RecoveryCheckResponse } from "@/types/api";

export const recoveryKeys = {
  all: ["recovery"] as const,
  pending: (characterName: string, worldName: string) =>
    [...recoveryKeys.all, "pending", characterName, worldName] as const,
};

export function usePendingRecoveryChallenge(
  characterName: string,
  worldName: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: recoveryKeys.pending(characterName, worldName),
    queryFn: async () => {
      const result = await apiClient.recovery.getPendingChallenge(characterName, worldName);
      if (!result.success) throw new Error(result.error.message);
      return result.data as RecoveryChallengeResponse;
    },
    enabled: (options?.enabled ?? true) && !!characterName && !!worldName,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.exists && data?.status === "PENDING") {
        return 10000;
      }
      return false;
    },
  });
}

export function useCreateRecoveryChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { characterName: string; worldName: string }) => {
      const result = await apiClient.recovery.createChallenge(data);
      if (!result.success) throw new Error(result.error.message);
      return result.data as RecoveryChallengeResponse;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: recoveryKeys.pending(variables.characterName, variables.worldName),
      });
    },
  });
}

export function useCheckRecoveryChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      challengeId,
    }: {
      challengeId: string;
      characterName: string;
      worldName: string;
    }) => {
      const result = await apiClient.recovery.checkChallenge(challengeId);
      if (!result.success) throw new Error(result.error.message);
      return result.data as RecoveryCheckResponse;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: recoveryKeys.pending(variables.characterName, variables.worldName),
      });
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { recoveryToken: string; newPassword: string }) => {
      const result = await apiClient.recovery.resetPassword(data);
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
  });
}
