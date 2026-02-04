"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type {
  CharacterResponse,
  CharacterListResponse,
  ChallengeResponse,
  VerificationResultResponse,
} from "@/types/api";

export const characterKeys = {
  all: ["characters"] as const,
  list: () => [...characterKeys.all, "list"] as const,
  detail: (id: string) => [...characterKeys.all, "detail", id] as const,
  challenge: (characterId: string) => [...characterKeys.all, "challenge", characterId] as const,
};

export function useCharacters() {
  return useQuery({
    queryKey: characterKeys.list(),
    queryFn: async () => {
      const result = await apiClient.characters.list();
      if (!result.success) throw new Error(result.error.message);
      return (result.data as CharacterListResponse).characters;
    },
  });
}

export function useCharacter(id: string) {
  return useQuery({
    queryKey: characterKeys.detail(id),
    queryFn: async () => {
      const result = await apiClient.characters.get(id);
      if (!result.success) throw new Error(result.error.message);
      return result.data as CharacterResponse;
    },
    enabled: !!id,
  });
}

export function useClaimCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { characterName: string; worldName: string }) => {
      const result = await apiClient.characters.claim(data);
      if (!result.success) throw new Error(result.error.message);
      return result.data as CharacterResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: characterKeys.list() });
    },
  });
}

export function useSyncCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (characterId: string) => {
      const result = await apiClient.characters.sync(characterId);
      if (!result.success) throw new Error(result.error.message);
      return result.data as CharacterResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: characterKeys.list() });
      queryClient.invalidateQueries({ queryKey: characterKeys.detail(data.id) });
    },
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await apiClient.characters.delete(id);
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: characterKeys.list() });
    },
  });
}

// Verification hooks
export function useChallenge(characterId: string) {
  return useQuery({
    queryKey: characterKeys.challenge(characterId),
    queryFn: async () => {
      const result = await apiClient.verification.getChallenge(characterId);
      if (!result.success) throw new Error(result.error.message);
      return result.data as ChallengeResponse | null;
    },
    enabled: !!characterId,
    refetchInterval: (query) => {
      // Auto-refresh while pending
      const data = query.state.data;
      if (data?.status === "PENDING") {
        return 10000; // 10 seconds
      }
      return false;
    },
  });
}

export function useStartChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (characterId: string) => {
      const result = await apiClient.verification.startChallenge(characterId);
      if (!result.success) throw new Error(result.error.message);
      return result.data as ChallengeResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(characterKeys.challenge(data.characterId), data);
    },
  });
}

export function useCheckChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ challengeId, characterId }: { challengeId: string; characterId: string }) => {
      const result = await apiClient.verification.checkChallenge(challengeId);
      if (!result.success) throw new Error(result.error.message);
      return { result: result.data as VerificationResultResponse, characterId };
    },
    onSuccess: ({ result, characterId }) => {
      // Invalidate challenge query to refetch latest state
      queryClient.invalidateQueries({ queryKey: characterKeys.challenge(characterId) });
      if (result.status === "SUCCESS") {
        queryClient.invalidateQueries({ queryKey: characterKeys.list() });
        queryClient.invalidateQueries({ queryKey: characterKeys.detail(characterId) });
      }
    },
    onError: (_error, variables) => {
      // 에러 발생 시에도 challenge 데이터 갱신 (쿨다운 타이머 업데이트)
      queryClient.invalidateQueries({ queryKey: characterKeys.challenge(variables.characterId) });
    },
  });
}
