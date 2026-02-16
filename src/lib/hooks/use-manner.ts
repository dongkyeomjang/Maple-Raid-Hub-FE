"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { MyEvaluationDetailResponse, EvaluationAvailabilityResponse, TagSummaryResponse } from "@/types/api";

export const mannerKeys = {
  all: ["manner"] as const,
  myEvaluations: () => [...mannerKeys.all, "my-evaluations"] as const,
  availability: (targetUserId: string) => [...mannerKeys.all, "availability", targetUserId] as const,
  tagSummary: (userId: string) => [...mannerKeys.all, "tag-summary", userId] as const,
};

export function useMyEvaluations() {
  return useQuery({
    queryKey: mannerKeys.myEvaluations(),
    queryFn: async () => {
      const result = await api.manner.getMyEvaluations();
      if (!result.success) throw new Error(result.error.message);
      return result.data as MyEvaluationDetailResponse[];
    },
  });
}

export function useCheckEvaluationAvailability(targetUserId: string | null) {
  return useQuery({
    queryKey: mannerKeys.availability(targetUserId || ""),
    queryFn: async () => {
      const result = await api.manner.checkAvailability(targetUserId!);
      if (!result.success) throw new Error(result.error.message);
      return result.data as EvaluationAvailabilityResponse;
    },
    enabled: !!targetUserId,
  });
}

export function useTagSummary(userId: string | null) {
  return useQuery({
    queryKey: mannerKeys.tagSummary(userId || ""),
    queryFn: async () => {
      const result = await api.manner.getTagSummary(userId!);
      if (!result.success) throw new Error(result.error.message);
      return result.data as TagSummaryResponse;
    },
    enabled: !!userId,
  });
}

export function useSubmitMannerEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      targetUserId,
      context,
      tags,
    }: {
      targetUserId: string;
      context: string;
      tags: string[];
    }) => {
      const result = await api.manner.evaluate({ targetUserId, context, tags });
      if (!result.success) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mannerKeys.all });
    },
  });
}
