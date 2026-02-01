import type { ApiResponse, ErrorResponse } from "@/types/api";

// Environment configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

// Backend API response format
interface BackendApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    errorCode: string;
    message: string;
    details?: Record<string, unknown>;
  } | null;
  timestamp: string;
}

// Generic fetch wrapper - 쿠키 기반 인증 (서버가 모든 토큰 관리)
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // 쿠키 자동 전송
    });

    // Handle empty response (204 No Content)
    if (response.status === 204) {
      return { success: true, data: null as T };
    }

    const text = await response.text();
    if (!text) {
      return { success: true, data: null as T };
    }

    // Parse the backend response
    const backendResponse = JSON.parse(text) as BackendApiResponse<T>;

    // Transform to frontend ApiResponse format
    if (backendResponse.success && backendResponse.data !== null) {
      return { success: true, data: backendResponse.data };
    }

    if (backendResponse.error) {
      return {
        success: false,
        error: {
          code: backendResponse.error.errorCode,
          message: backendResponse.error.message,
          details: backendResponse.error.details as Record<string, string> | undefined,
        },
      };
    }

    // If success is true but data is null
    return { success: true, data: null as T };
  } catch (error) {
    // Network errors or JSON parsing errors
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "네트워크 오류가 발생했습니다",
      },
    };
  }
}

// 인증이 필요한 API 호출 (백엔드가 자동으로 토큰 갱신 처리)
const fetchApiWithRefresh = fetchApi;

// API client with methods for each endpoint
export const api = {
  // Auth - 모든 토큰 관리는 서버가 쿠키로 처리
  auth: {
    signup: (data: { username: string; password: string; nickname: string }) =>
      fetchApi<void>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    login: (data: { username: string; password: string }) =>
      fetchApi<void>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    logout: () =>
      fetchApi<void>("/api/auth/logout", {
        method: "POST",
      }),

    me: () => fetchApi("/api/auth/me"),

    updateNickname: (nickname: string) =>
      fetchApiWithRefresh("/api/auth/nickname", {
        method: "PATCH",
        body: JSON.stringify({ nickname }),
      }),

    // OAuth 신규 가입 완료 (임시 토큰으로 닉네임 설정)
    oauthComplete: (nickname: string) =>
      fetchApi<void>("/api/auth/oauth/complete", {
        method: "POST",
        body: JSON.stringify({ nickname }),
      }),
  },

  // Characters
  characters: {
    list: () => fetchApiWithRefresh("/api/characters"),

    get: (id: string) => fetchApiWithRefresh(`/api/characters/${id}`),

    claim: (data: { characterName: string; worldName: string }) =>
      fetchApiWithRefresh("/api/characters", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    sync: (characterId: string) =>
      fetchApiWithRefresh(`/api/characters/${characterId}/sync`, {
        method: "POST",
      }),

    delete: (id: string) =>
      fetchApiWithRefresh(`/api/characters/${id}`, {
        method: "DELETE",
      }),
  },

  // Verification
  verification: {
    startChallenge: (characterId: string) =>
      fetchApiWithRefresh(`/api/verification/characters/${characterId}/challenges`, {
        method: "POST",
      }),

    getChallenge: (characterId: string) =>
      fetchApiWithRefresh(`/api/verification/characters/${characterId}/challenges/pending`),

    getChallengeById: (challengeId: string) =>
      fetchApiWithRefresh(`/api/verification/challenges/${challengeId}`),

    checkChallenge: (challengeId: string) =>
      fetchApiWithRefresh(`/api/verification/challenges/${challengeId}/check`, {
        method: "POST",
      }),
  },

  // Posts
  posts: {
    list: (params?: { worldGroup?: string; page?: number; size?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.worldGroup) searchParams.set("worldGroup", params.worldGroup);
      if (params?.page !== undefined) searchParams.set("page", params.page.toString());
      if (params?.size) searchParams.set("size", params.size.toString());
      const query = searchParams.toString();
      return fetchApiWithRefresh(`/api/posts${query ? `?${query}` : ""}`);
    },

    get: (id: string) => fetchApiWithRefresh(`/api/posts/${id}`),

    create: (data: {
      characterId: string;
      bossIds: string[];
      requiredMembers: number;
      preferredTime: string | null;
      description?: string | null;
    }) =>
      fetchApiWithRefresh("/api/posts", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (
      id: string,
      data: {
        bossIds?: string[];
        requiredMembers?: number;
        preferredTime?: string;
        clearPreferredTime?: boolean;
        description?: string;
        clearDescription?: boolean;
      }
    ) =>
      fetchApiWithRefresh(`/api/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    close: (id: string) =>
      fetchApiWithRefresh(`/api/posts/${id}/close`, {
        method: "POST",
      }),

    cancel: (id: string) =>
      fetchApiWithRefresh(`/api/posts/${id}`, {
        method: "DELETE",
      }),

    apply: (
      postId: string,
      data: { characterId: string; message?: string | null }
    ) =>
      fetchApiWithRefresh(`/api/posts/${postId}/applications`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getApplications: (postId: string) =>
      fetchApiWithRefresh(`/api/posts/${postId}/applications`),

    respondApplication: (postId: string, applicationId: string, accept: boolean) =>
      fetchApiWithRefresh(
        `/api/posts/${postId}/applications/${applicationId}/${accept ? "accept" : "reject"}`,
        { method: "POST" }
      ),

    withdrawApplication: (postId: string, applicationId: string) =>
      fetchApiWithRefresh(`/api/posts/${postId}/applications/${applicationId}`, {
        method: "DELETE",
      }),

    myApplications: () => fetchApiWithRefresh("/api/posts/my-applications"),

    myPosts: () => fetchApiWithRefresh("/api/posts/my-posts"),
  },

  // Party Rooms
  partyRooms: {
    list: () => fetchApiWithRefresh("/api/party-rooms"),

    get: (id: string) => fetchApiWithRefresh(`/api/party-rooms/${id}`),

    toggleReady: (id: string) =>
      fetchApiWithRefresh(`/api/party-rooms/${id}/ready`, {
        method: "POST",
      }),

    startReadyCheck: (id: string) =>
      fetchApiWithRefresh(`/api/party-rooms/${id}/ready-check`, {
        method: "POST",
      }),

    kick: (roomId: string, memberId: string) =>
      fetchApiWithRefresh(`/api/party-rooms/${roomId}/members/${memberId}`, {
        method: "DELETE",
      }),

    leave: (id: string) =>
      fetchApiWithRefresh(`/api/party-rooms/${id}/leave`, {
        method: "POST",
      }),

    complete: (id: string) =>
      fetchApiWithRefresh(`/api/party-rooms/${id}/complete`, {
        method: "POST",
      }),

    disband: (id: string) =>
      fetchApiWithRefresh(`/api/party-rooms/${id}/disband`, {
        method: "POST",
      }),

    getReviews: (id: string) => fetchApiWithRefresh(`/api/party-rooms/${id}/reviews`),

    getMessages: (id: string, limit = 50, before?: string) => {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (before) params.set("before", before);
      return fetchApiWithRefresh(`/api/party-rooms/${id}/messages?${params}`);
    },

    markAsRead: (id: string) =>
      fetchApiWithRefresh(`/api/party-rooms/${id}/read`, {
        method: "POST",
      }),

    submitReview: (roomId: string, data: { targetMemberId: string; tags: string[] }) =>
      fetchApiWithRefresh(`/api/party-rooms/${roomId}/reviews`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    createPoll: (roomId: string, options: string[]) =>
      fetchApiWithRefresh(`/api/party-rooms/${roomId}/poll`, {
        method: "POST",
        body: JSON.stringify({ options }),
      }),

    votePoll: (roomId: string, optionIndex: number) =>
      fetchApiWithRefresh(`/api/party-rooms/${roomId}/poll/vote`, {
        method: "POST",
        body: JSON.stringify({ optionIndex }),
      }),
  },

  // Chat
  chat: {
    getHistory: (roomId: string, cursor?: string) => {
      const query = cursor ? `?cursor=${cursor}` : "";
      return fetchApiWithRefresh(`/api/chat/${roomId}/messages${query}`);
    },

    createPoll: (roomId: string, options: string[]) =>
      fetchApiWithRefresh(`/api/chat/${roomId}/poll`, {
        method: "POST",
        body: JSON.stringify({ options }),
      }),

    votePoll: (roomId: string, pollId: string, optionIndex: number) =>
      fetchApiWithRefresh(`/api/chat/${roomId}/poll/${pollId}/vote`, {
        method: "POST",
        body: JSON.stringify({ optionIndex }),
      }),
  },

  // Direct Messages
  dm: {
    createRoom: (postId: string | null, targetUserId: string, senderCharacterId?: string, targetCharacterId?: string) =>
      fetchApiWithRefresh("/api/dm/rooms", {
        method: "POST",
        body: JSON.stringify({ postId, targetUserId, senderCharacterId, targetCharacterId }),
      }),

    getRooms: () => fetchApiWithRefresh("/api/dm/rooms"),

    getRoom: (roomId: string) => fetchApiWithRefresh(`/api/dm/rooms/${roomId}`),

    getMessages: (roomId: string, limit = 50, before?: string) => {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (before) params.set("before", before);
      return fetchApiWithRefresh(`/api/dm/rooms/${roomId}/messages?${params}`);
    },

    sendMessage: (roomId: string, content: string, senderCharacterId?: string) =>
      fetchApiWithRefresh(`/api/dm/rooms/${roomId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content, senderCharacterId }),
      }),

    markAsRead: (roomId: string) =>
      fetchApiWithRefresh(`/api/dm/rooms/${roomId}/read`, {
        method: "POST",
      }),
  },

  // Availability (When2Meet)
  availability: {
    save: (roomId: string, slots: Array<{ date: string; time: string }>) =>
      fetchApiWithRefresh(`/api/party-rooms/${roomId}/availability`, {
        method: "PUT",
        body: JSON.stringify({ slots }),
      }),

    getAll: (roomId: string) =>
      fetchApiWithRefresh(`/api/party-rooms/${roomId}/availability`),

    confirmSchedule: (roomId: string, scheduledTime: string) =>
      fetchApiWithRefresh(`/api/party-rooms/${roomId}/schedule`, {
        method: "POST",
        body: JSON.stringify({ scheduledTime }),
      }),
  },

  // Config (no auth required)
  config: {
    worldGroups: () => fetchApi("/api/config/world-groups"),
    bosses: () => fetchApi("/api/config/bosses"),
    bundles: () => fetchApi("/api/config/boss-bundles"),
  },

  // Stats (no auth required)
  stats: {
    site: () => fetchApi<{ userCount: number; averageTemperature: number }>("/api/stats"),
  },
};

// Export mock mode flag for conditional logic
export const isMockMode = MOCK_MODE;
