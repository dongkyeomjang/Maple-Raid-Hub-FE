"use client";

import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/hooks/use-auth";
import { useWebSocket } from "@/lib/websocket/WebSocketProvider";
import type {
  PartyRoomResponse,
  ReviewResponse,
  ReviewTag,
} from "@/types/api";

export const partyRoomKeys = {
  all: ["partyRooms"] as const,
  list: () => [...partyRoomKeys.all, "list"] as const,
  detail: (id: string) => [...partyRoomKeys.all, "detail", id] as const,
  reviews: (id: string) => [...partyRoomKeys.all, "reviews", id] as const,
};

export function usePartyRooms() {
  const { user, isLoading } = useAuth();
  return useQuery({
    queryKey: partyRoomKeys.list(),
    queryFn: async () => {
      const result = await apiClient.partyRooms.list();
      if (!result.success) throw new Error(result.error.message);
      return (result.data as { partyRooms: PartyRoomResponse[] }).partyRooms;
    },
    // 인증 확인이 완료되고 user가 있을 때만 활성화
    enabled: !!user && !isLoading,
    staleTime: 0, // 항상 최신 데이터 fetch
    refetchOnMount: "always", // 마운트 시 항상 refetch
  });
}

export function usePartyRoom(id: string) {
  return useQuery({
    queryKey: partyRoomKeys.detail(id),
    queryFn: async () => {
      const result = await apiClient.partyRooms.get(id);
      if (!result.success) throw new Error(result.error.message);
      return result.data as PartyRoomResponse;
    },
    enabled: !!id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useToggleReady() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const result = await apiClient.partyRooms.toggleReady(roomId);
      if (!result.success) throw new Error(result.error.message);
      return { roomId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.detail(data.roomId) });
    },
  });
}

export function useStartReadyCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const result = await apiClient.partyRooms.startReadyCheck(roomId);
      if (!result.success) throw new Error(result.error.message);
      return { roomId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.detail(data.roomId) });
    },
  });
}

export function useKickMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, memberId }: { roomId: string; memberId: string }) => {
      const result = await apiClient.partyRooms.kick(roomId, memberId);
      if (!result.success) throw new Error(result.error.message);
      return { roomId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.detail(data.roomId) });
    },
  });
}

export function useLeaveParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const result = await apiClient.partyRooms.leave(roomId);
      if (!result.success) throw new Error(result.error.message);
      return { roomId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.list() });
    },
  });
}

export function useCompleteParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const result = await apiClient.partyRooms.complete(roomId);
      if (!result.success) throw new Error(result.error.message);
      return { roomId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.detail(data.roomId) });
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.list() });
    },
  });
}

export function useDisbandParty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const result = await apiClient.partyRooms.disband(roomId);
      if (!result.success) throw new Error(result.error.message);
      return { roomId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.list() });
    },
  });
}

export function useReviews(roomId: string) {
  return useQuery({
    queryKey: partyRoomKeys.reviews(roomId),
    queryFn: async () => {
      const result = await apiClient.partyRooms.getReviews(roomId);
      if (!result.success) throw new Error(result.error.message);
      return result.data as ReviewResponse[];
    },
    enabled: !!roomId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      targetMemberId,
      tags,
    }: {
      roomId: string;
      targetMemberId: string;
      tags: ReviewTag[];
    }) => {
      const result = await apiClient.partyRooms.submitReview(roomId, { targetMemberId, tags });
      if (!result.success) throw new Error(result.error.message);
      return { roomId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.reviews(data.roomId) });
    },
  });
}

export function useCreatePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, options }: { roomId: string; options: string[] }) => {
      const result = await apiClient.partyRooms.createPoll(roomId, options);
      if (!result.success) throw new Error(result.error.message);
      return { roomId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.detail(data.roomId) });
    },
  });
}

export function useVotePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, optionIndex }: { roomId: string; optionIndex: number }) => {
      const result = await apiClient.partyRooms.votePoll(roomId, optionIndex);
      if (!result.success) throw new Error(result.error.message);
      return { roomId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.detail(data.roomId) });
    },
  });
}

/**
 * 파티방 생성/변경을 실시간으로 구독하여 파티방 목록 자동 갱신
 */
export function usePartyRoomUpdatesSubscription() {
  const { connected, subscribe, unsubscribe } = useWebSocket();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const subscriptionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!connected || !user) return;

    subscriptionIdRef.current = subscribe(`/user/queue/party-room-updates`, () => {
      queryClient.invalidateQueries({ queryKey: partyRoomKeys.list() });
    });

    return () => {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [connected, user, subscribe, unsubscribe, queryClient]);
}
