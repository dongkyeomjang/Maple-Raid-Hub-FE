"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/lib/websocket/WebSocketProvider";
import {
  useChatStore,
  PartyChatMessage,
  DmChatMessage,
  DmRoom,
  PartyChatRoom,
} from "@/lib/stores/chat-store";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/hooks/use-auth";

// DM 방 목록 훅
export function useDmRooms() {
  const { user } = useAuth();
  const { connected } = useWebSocket();
  const setDmRooms = useChatStore((s) => s.setDmRooms);
  const prevConnectedRef = useRef(false);

  const query = useQuery({
    queryKey: ["dm", "rooms"],
    queryFn: async () => {
      const result = await api.dm.getRooms();
      if (result.success && result.data) {
        return result.data as DmRoom[];
      }
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to fetch DM rooms");
      }
      return [];
    },
    enabled: !!user,
  });

  // WebSocket 재연결 시 방 목록 새로고침
  useEffect(() => {
    if (prevConnectedRef.current === false && connected === true) {
      // 끊어졌다가 다시 연결됨 -> refetch
      query.refetch();
    }
    prevConnectedRef.current = connected;
  }, [connected, query]);

  useEffect(() => {
    if (query.data) {
      setDmRooms(query.data);
    }
  }, [query.data, setDmRooms]);

  return query;
}

// 백엔드에서 오는 DM 메시지 응답 타입 (createdAt 사용)
interface DmMessageApiResponse {
  id: string;
  roomId: string;
  senderId: string | null;
  senderNickname: string | null;
  senderCharacterId: string | null;
  senderCharacterName: string | null;
  senderCharacterImageUrl: string | null;
  content: string;
  type: "TEXT" | "SYSTEM";
  createdAt: string;  // 백엔드는 createdAt으로 반환
}

// DM 메시지 페이지 응답 타입
interface DmMessagesPage {
  messages: DmMessageApiResponse[];
  hasMore: boolean;
  nextCursor: string | null;
}

// 백엔드 응답을 프론트엔드 포맷으로 변환
function transformDmMessage(msg: DmMessageApiResponse): DmChatMessage {
  return {
    ...msg,
    timestamp: msg.createdAt,  // createdAt -> timestamp 변환
  };
}

// DM 메시지 훅 (무한 스크롤 지원)
export function useDmMessages(roomId: string | null) {
  const { user } = useAuth();
  const setDmMessages = useChatStore((s) => s.setDmMessages);
  const dmMessages = useChatStore((s) => s.dmMessages);

  // 페이지네이션 상태
  const [paginationState, setPaginationState] = useState<{
    hasMore: boolean;
    nextCursor: string | null;
  }>({ hasMore: false, nextCursor: null });

  const query = useQuery({
    queryKey: ["dm", "messages", roomId],
    queryFn: async () => {
      if (!roomId) return { messages: [], hasMore: false, nextCursor: null };
      const result = await api.dm.getMessages(roomId);
      if (result.success && result.data) {
        return result.data as DmMessagesPage;
      }
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to fetch messages");
      }
      return { messages: [], hasMore: false, nextCursor: null };
    },
    enabled: !!user && !!roomId,
  });

  // 초기 메시지 설정 및 페이지네이션 상태 초기화
  useEffect(() => {
    if (roomId && query.data?.messages) {
      // 백엔드 응답을 프론트엔드 포맷으로 변환
      const transformedMessages = query.data.messages.map(transformDmMessage);
      setDmMessages(roomId, transformedMessages);
      setPaginationState({
        hasMore: query.data.hasMore,
        nextCursor: query.data.nextCursor,
      });
    }
  }, [roomId, query.data, setDmMessages]);

  // 방이 바뀌면 페이지네이션 상태 초기화
  useEffect(() => {
    setPaginationState({ hasMore: false, nextCursor: null });
  }, [roomId]);

  // 이전 메시지 더 가져오기
  const fetchMore = useCallback(async () => {
    if (!roomId || !paginationState.hasMore || !paginationState.nextCursor) return null;

    const result = await api.dm.getMessages(roomId, 50, paginationState.nextCursor);
    if (result.success && result.data) {
      const page = result.data as DmMessagesPage;
      const currentMessages = dmMessages[roomId] || [];
      // 백엔드 응답을 프론트엔드 포맷으로 변환하고 이전 메시지를 앞에 추가
      const transformedMessages = page.messages.map(transformDmMessage);
      setDmMessages(roomId, [...transformedMessages, ...currentMessages]);
      // 페이지네이션 상태 업데이트
      setPaginationState({
        hasMore: page.hasMore,
        nextCursor: page.nextCursor,
      });
      return page;
    }
    return null;
  }, [roomId, paginationState, dmMessages, setDmMessages]);

  return {
    ...query,
    hasMore: paginationState.hasMore,
    fetchMore,
  };
}

// DM 방 생성/조회 훅
export function useCreateDmRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, targetUserId }: { postId?: string; targetUserId: string }) => {
      const result = await api.dm.createRoom(postId || null, targetUserId);
      if (result.success && result.data) {
        return result.data as DmRoom;
      }
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to create DM room");
      }
      throw new Error("No data returned");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dm", "rooms"] });
    },
  });
}

// DM 메시지 전송 훅 (REST API)
export function useSendDmMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, content }: { roomId: string; content: string }) => {
      const result = await api.dm.sendMessage(roomId, content);
      if (result.success && result.data) {
        return result.data;
      }
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to send message");
      }
      throw new Error("No data returned");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dm", "messages", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["dm", "rooms"] });
    },
  });
}

// DM 읽음 처리 훅
export function useMarkDmAsRead() {
  const clearDmUnread = useChatStore((s) => s.clearDmUnread);

  return useMutation({
    mutationFn: async (roomId: string) => {
      const result = await api.dm.markAsRead(roomId);
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to mark as read");
      }
    },
    onSuccess: (_, roomId) => {
      clearDmUnread(roomId);
    },
  });
}

// 파티 채팅 읽음 처리 훅
export function useMarkPartyAsRead() {
  const clearPartyUnread = useChatStore((s) => s.clearPartyUnread);

  return useMutation({
    mutationFn: async (roomId: string) => {
      const result = await api.partyRooms.markAsRead(roomId);
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to mark as read");
      }
    },
    onSuccess: (_, roomId) => {
      clearPartyUnread(roomId);
    },
  });
}

// 파티 채팅 메시지 페이지 응답 타입
interface PartyChatMessagesPage {
  messages: PartyChatMessage[];
  hasMore: boolean;
  nextCursor: string | null;
}

// 파티 채팅 메시지 조회 훅 (무한 스크롤 지원)
export function usePartyMessages(roomId: string | null) {
  const { user } = useAuth();
  const setPartyMessages = useChatStore((s) => s.setPartyMessages);
  const partyMessages = useChatStore((s) => s.partyMessages);

  // 페이지네이션 상태를 별도로 관리
  const [paginationState, setPaginationState] = useState<{
    hasMore: boolean;
    nextCursor: string | null;
  }>({ hasMore: false, nextCursor: null });

  const query = useQuery({
    queryKey: ["party", "messages", roomId],
    queryFn: async () => {
      if (!roomId) return { messages: [], hasMore: false, nextCursor: null };
      const result = await api.partyRooms.getMessages(roomId);
      if (result.success && result.data) {
        return result.data as PartyChatMessagesPage;
      }
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to fetch messages");
      }
      return { messages: [], hasMore: false, nextCursor: null };
    },
    enabled: !!user && !!roomId,
  });

  // 초기 메시지 설정 및 페이지네이션 상태 초기화
  useEffect(() => {
    if (roomId && query.data?.messages) {
      setPartyMessages(roomId, query.data.messages);
      setPaginationState({
        hasMore: query.data.hasMore,
        nextCursor: query.data.nextCursor,
      });
    }
  }, [roomId, query.data, setPartyMessages]);

  // 방이 바뀌면 페이지네이션 상태 초기화
  useEffect(() => {
    setPaginationState({ hasMore: false, nextCursor: null });
  }, [roomId]);

  // 이전 메시지 더 가져오기
  const fetchMore = useCallback(async () => {
    if (!roomId || !paginationState.hasMore || !paginationState.nextCursor) return null;

    const result = await api.partyRooms.getMessages(roomId, 50, paginationState.nextCursor);
    if (result.success && result.data) {
      const page = result.data as PartyChatMessagesPage;
      const currentMessages = partyMessages[roomId] || [];
      // 이전 메시지를 앞에 추가
      setPartyMessages(roomId, [...page.messages, ...currentMessages]);
      // 페이지네이션 상태 업데이트
      setPaginationState({
        hasMore: page.hasMore,
        nextCursor: page.nextCursor,
      });
      return page;
    }
    return null;
  }, [roomId, paginationState, partyMessages, setPartyMessages]);

  return {
    ...query,
    hasMore: paginationState.hasMore,
    fetchMore,
  };
}

// 파티 채팅 WebSocket 구독 훅
export function usePartyChatSubscription(partyRoomId: string | null) {
  const { connected, subscribe, unsubscribe, send } = useWebSocket();
  const { user } = useAuth();
  const addPartyMessage = useChatStore((s) => s.addPartyMessage);
  const incrementPartyUnread = useChatStore((s) => s.incrementPartyUnread);
  const selectedRoomId = useChatStore((s) => s.selectedRoomId);
  const subscriptionIdRef = useRef<string | null>(null);

  // 구독
  useEffect(() => {
    if (!connected || !partyRoomId) return;

    subscriptionIdRef.current = subscribe(`/topic/party/${partyRoomId}`, (message) => {
      const chatMessage = message as PartyChatMessage;
      addPartyMessage(partyRoomId, chatMessage);

      // 현재 보고 있는 방이 아니면 읽지 않음 카운트 증가
      if (selectedRoomId !== partyRoomId && chatMessage.senderId !== user?.id) {
        incrementPartyUnread(partyRoomId);
      }
    });

    return () => {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [connected, partyRoomId, subscribe, unsubscribe, addPartyMessage, incrementPartyUnread, selectedRoomId, user]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content: string, senderNickname: string) => {
      if (!partyRoomId || !connected) return;

      send(`/app/chat/${partyRoomId}`, {
        senderNickname,
        content,
      });
    },
    [partyRoomId, connected, send]
  );

  return { sendMessage, connected };
}

// DM WebSocket 구독 훅
export function useDmChatSubscription(dmRoomId: string | null) {
  const { connected, subscribe, unsubscribe, send } = useWebSocket();
  const { user } = useAuth();
  const addDmMessage = useChatStore((s) => s.addDmMessage);
  const incrementDmUnread = useChatStore((s) => s.incrementDmUnread);
  const selectedRoomId = useChatStore((s) => s.selectedRoomId);
  const subscriptionIdRef = useRef<string | null>(null);

  // 구독
  useEffect(() => {
    if (!connected || !dmRoomId) return;

    subscriptionIdRef.current = subscribe(`/topic/dm/${dmRoomId}`, (message) => {
      const chatMessage = message as DmChatMessage;
      addDmMessage(dmRoomId, chatMessage);

      // 현재 보고 있는 방이 아니면 읽지 않음 카운트 증가
      if (selectedRoomId !== dmRoomId && chatMessage.senderId !== user?.id) {
        incrementDmUnread(dmRoomId);
      }
    });

    return () => {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [connected, dmRoomId, subscribe, unsubscribe, addDmMessage, incrementDmUnread, selectedRoomId, user]);

  // 메시지 전송 (WebSocket)
  const sendMessage = useCallback(
    (content: string, senderNickname: string, senderCharacterId?: string) => {
      if (!dmRoomId || !connected) return;

      send(`/app/dm/${dmRoomId}`, {
        senderNickname,
        content,
        senderCharacterId,
      });
    },
    [dmRoomId, connected, send]
  );

  return { sendMessage, connected };
}

// 개인 알림 구독 훅
export function useNotificationSubscription() {
  const { connected, subscribe, unsubscribe } = useWebSocket();
  const { user } = useAuth();
  const addNotification = useChatStore((s) => s.addNotification);
  const setDmRooms = useChatStore((s) => s.setDmRooms);
  const subscriptionIdRef = useRef<string | null>(null);
  // selectedRoomId를 ref로 관리하여 구독 재생성 방지
  const selectedRoomIdRef = useRef<string | null>(null);

  // selectedRoomId 동기화
  useEffect(() => {
    selectedRoomIdRef.current = useChatStore.getState().selectedRoomId;
    const unsubscribeStore = useChatStore.subscribe((state) => {
      selectedRoomIdRef.current = state.selectedRoomId;
    });
    return unsubscribeStore;
  }, []);

  useEffect(() => {
    if (!connected || !user) return;

    subscriptionIdRef.current = subscribe(`/user/queue/notifications`, async (message) => {
      const notification = message as {
        roomId: string;
        senderNickname: string;
        message: string;
      };

      addNotification({
        type: "dm",
        roomId: notification.roomId,
        senderNickname: notification.senderNickname,
        message: notification.message,
        timestamp: new Date().toISOString(),
      });

      // 현재 보고 있는 방이 아니면 방 목록 새로고침 (새 메시지 미리보기, unread count 업데이트)
      if (selectedRoomIdRef.current !== notification.roomId) {
        try {
          const result = await api.dm.getRooms();
          if (result.success && result.data) {
            setDmRooms(result.data as DmRoom[]);
          }
        } catch (e) {
          console.error("Failed to refresh DM rooms:", e);
        }
      }
    });

    return () => {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [connected, user, subscribe, unsubscribe, addNotification, setDmRooms]);
}

// 파티룸을 채팅방으로 변환하는 유틸
export function partyRoomToChatRoom(
  partyRoom: {
    id: string;
    bossIds: string[];
    members: Array<{ userId: string; characterName: string | null; unreadCount: number }>;
    lastMessage?: string | null;
    lastMessageAt?: string | null;
  },
  getBossName: (id: string) => string,
  currentUserId: string
): PartyChatRoom {
  const name = partyRoom.bossIds.map(getBossName).join(", ") || "파티";
  const memberNames = partyRoom.members
    .map((m) => m.characterName)
    .filter((name): name is string => name !== null);

  // 현재 사용자의 unreadCount를 찾음
  const currentMember = partyRoom.members.find((m) => m.userId === currentUserId);
  const unreadCount = currentMember?.unreadCount ?? 0;

  return {
    id: partyRoom.id,
    name,
    memberNames,
    unreadCount,
    lastMessage: partyRoom.lastMessage ?? null,
    lastMessageAt: partyRoom.lastMessageAt ?? null,
  };
}

// 파티 채팅 알림 구독 훅
export function usePartyChatNotificationSubscription() {
  const { connected, subscribe, unsubscribe } = useWebSocket();
  const { user } = useAuth();
  const addNotification = useChatStore((s) => s.addNotification);
  const incrementPartyUnread = useChatStore((s) => s.incrementPartyUnread);
  const subscriptionIdRef = useRef<string | null>(null);
  // selectedRoomId를 ref로 관리하여 구독 재생성 방지
  const selectedRoomIdRef = useRef<string | null>(null);

  // selectedRoomId 동기화
  useEffect(() => {
    selectedRoomIdRef.current = useChatStore.getState().selectedRoomId;
    const unsubscribeStore = useChatStore.subscribe((state) => {
      selectedRoomIdRef.current = state.selectedRoomId;
    });
    return unsubscribeStore;
  }, []);

  useEffect(() => {
    if (!connected || !user) return;

    subscriptionIdRef.current = subscribe(`/user/queue/party-notifications`, (message) => {
      const notification = message as {
        roomId: string;
        senderNickname: string;
        message: string;
      };

      // 현재 보고 있는 방이 아닐 때만 처리
      if (selectedRoomIdRef.current !== notification.roomId) {
        incrementPartyUnread(notification.roomId);

        addNotification({
          type: "party",
          roomId: notification.roomId,
          senderNickname: notification.senderNickname,
          message: notification.message,
          timestamp: new Date().toISOString(),
        });
      }
    });

    return () => {
      if (subscriptionIdRef.current) {
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = null;
      }
    };
  }, [connected, user, subscribe, unsubscribe, addNotification, incrementPartyUnread]);
}
