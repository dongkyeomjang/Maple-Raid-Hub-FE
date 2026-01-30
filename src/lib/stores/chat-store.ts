import { create } from "zustand";

// 파티 채팅 메시지
export interface PartyChatMessage {
  id: string;
  partyRoomId: string;
  senderId: string | null;
  senderNickname: string | null;
  content: string;
  type: "CHAT" | "SYSTEM" | "JOIN" | "LEAVE" | "READY" | "READY_CHECK" | "ALL_READY";
  timestamp: string;
}

// DM 채팅 메시지
export interface DmChatMessage {
  id: string;
  roomId: string;
  senderId: string | null;
  senderNickname: string | null;
  senderCharacterId: string | null;
  senderCharacterName: string | null;
  senderCharacterImageUrl: string | null;
  content: string;
  type: "TEXT" | "SYSTEM";
  timestamp: string;
}

// DM 방 정보
export interface DmRoom {
  id: string;
  postId: string | null;
  otherUserId: string;
  otherUserNickname: string;
  otherCharacterId: string | null;
  otherCharacterName: string | null;
  otherCharacterImageUrl: string | null;
  myCharacterId: string | null;
  myCharacterName: string | null;
  myCharacterImageUrl: string | null;
  unreadCount: number;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
  createdAt: string;
}

// 파티 채팅방 정보 (최소한의 정보)
export interface PartyChatRoom {
  id: string;
  name: string; // 보스명 등
  memberNames: string[]; // 참여자 캐릭터명 목록
  unreadCount: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

// 알림
export interface ChatNotification {
  type: "dm" | "party";
  roomId: string;
  senderNickname: string;
  message: string;
  timestamp: string;
}

// 임시 DM (방 생성 전 상태)
export interface DraftDm {
  targetUserId: string;
  targetName: string;
  targetCharacterId: string | null;
  targetCharacterImageUrl: string | null;
  postId: string | null;
  senderCharacterId: string;
  senderCharacterName: string;
  senderCharacterImageUrl: string | null;
}

interface ChatStore {
  // 채팅 패널 상태
  isOpen: boolean;
  activeTab: "party" | "dm";
  selectedRoomId: string | null;
  selectedRoomType: "party" | "dm" | null;

  // 임시 DM (방 생성 전)
  draftDm: DraftDm | null;

  // DM 방 목록
  dmRooms: DmRoom[];

  // 파티 채팅방 목록
  partyRooms: PartyChatRoom[];

  // 메시지 캐시 (roomId -> messages)
  partyMessages: Record<string, PartyChatMessage[]>;
  dmMessages: Record<string, DmChatMessage[]>;

  // 알림
  notifications: ChatNotification[];
  totalUnreadCount: number;

  // Actions
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  setActiveTab: (tab: "party" | "dm") => void;
  selectRoom: (roomId: string, type: "party" | "dm") => void;
  clearSelection: () => void;

  // 임시 DM 관리
  setDraftDm: (draft: DraftDm) => void;
  clearDraftDm: () => void;

  // DM 방 관리
  setDmRooms: (rooms: DmRoom[]) => void;
  updateDmRoom: (room: DmRoom) => void;
  incrementDmUnread: (roomId: string, lastMessageAt?: string) => void;
  clearDmUnread: (roomId: string) => void;

  // 파티 채팅방 관리
  setPartyRooms: (rooms: PartyChatRoom[]) => void;
  updatePartyRoom: (room: PartyChatRoom) => void;
  incrementPartyUnread: (roomId: string, lastMessageAt?: string) => void;
  clearPartyUnread: (roomId: string) => void;

  // 메시지 관리
  addPartyMessage: (roomId: string, message: PartyChatMessage) => void;
  setPartyMessages: (roomId: string, messages: PartyChatMessage[]) => void;
  addDmMessage: (roomId: string, message: DmChatMessage) => void;
  setDmMessages: (roomId: string, messages: DmChatMessage[]) => void;

  // 알림
  addNotification: (notification: ChatNotification) => void;
  clearNotifications: () => void;
  recalculateTotalUnread: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // 초기 상태
  isOpen: false,
  activeTab: "party",
  selectedRoomId: null,
  selectedRoomType: null,
  draftDm: null,
  dmRooms: [],
  partyRooms: [],
  partyMessages: {},
  dmMessages: {},
  notifications: [],
  totalUnreadCount: 0,

  // 패널 제어
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  openPanel: () => set({ isOpen: true }),
  closePanel: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab, selectedRoomId: null, selectedRoomType: null }),

  selectRoom: (roomId, type) =>
    set({
      selectedRoomId: roomId,
      selectedRoomType: type,
      draftDm: null, // 방 선택 시 임시 DM 초기화
    }),

  clearSelection: () => set({ selectedRoomId: null, selectedRoomType: null, draftDm: null }),

  // 임시 DM 관리
  setDraftDm: (draft) =>
    set({
      draftDm: draft,
      activeTab: "dm",
      selectedRoomId: null,
      selectedRoomType: null,
      isOpen: true,
    }),

  clearDraftDm: () => set({ draftDm: null }),

  // DM 방 관리
  setDmRooms: (rooms) => {
    const dmUnread = rooms.reduce((sum, r) => sum + r.unreadCount, 0);
    const partyUnread = get().partyRooms.reduce((sum, r) => sum + r.unreadCount, 0);
    set({ dmRooms: rooms, totalUnreadCount: dmUnread + partyUnread });
  },

  updateDmRoom: (room) =>
    set((state) => ({
      dmRooms: state.dmRooms.map((r) => (r.id === room.id ? room : r)),
    })),

  incrementDmUnread: (roomId, lastMessageAt) => {
    set((state) => {
      const now = lastMessageAt || new Date().toISOString();
      const newDmRooms = state.dmRooms.map((r) =>
        r.id === roomId
          ? { ...r, unreadCount: r.unreadCount + 1, lastMessageAt: now }
          : r
      );
      const dmUnread = newDmRooms.reduce((sum, r) => sum + r.unreadCount, 0);
      const partyUnread = state.partyRooms.reduce((sum, r) => sum + r.unreadCount, 0);
      return { dmRooms: newDmRooms, totalUnreadCount: dmUnread + partyUnread };
    });
  },

  clearDmUnread: (roomId) => {
    set((state) => {
      const newDmRooms = state.dmRooms.map((r) =>
        r.id === roomId ? { ...r, unreadCount: 0 } : r
      );
      const dmUnread = newDmRooms.reduce((sum, r) => sum + r.unreadCount, 0);
      const partyUnread = state.partyRooms.reduce((sum, r) => sum + r.unreadCount, 0);
      return { dmRooms: newDmRooms, totalUnreadCount: dmUnread + partyUnread };
    });
  },

  // 파티 채팅방 관리
  setPartyRooms: (rooms) => {
    const partyUnread = rooms.reduce((sum, r) => sum + r.unreadCount, 0);
    const dmUnread = get().dmRooms.reduce((sum, r) => sum + r.unreadCount, 0);
    set({ partyRooms: rooms, totalUnreadCount: partyUnread + dmUnread });
  },

  updatePartyRoom: (room) =>
    set((state) => ({
      partyRooms: state.partyRooms.map((r) => (r.id === room.id ? room : r)),
    })),

  incrementPartyUnread: (roomId, lastMessageAt) => {
    set((state) => {
      const now = lastMessageAt || new Date().toISOString();
      const newPartyRooms = state.partyRooms.map((r) =>
        r.id === roomId
          ? { ...r, unreadCount: r.unreadCount + 1, lastMessageAt: now }
          : r
      );
      const partyUnread = newPartyRooms.reduce((sum, r) => sum + r.unreadCount, 0);
      const dmUnread = state.dmRooms.reduce((sum, r) => sum + r.unreadCount, 0);
      return { partyRooms: newPartyRooms, totalUnreadCount: dmUnread + partyUnread };
    });
  },

  clearPartyUnread: (roomId) => {
    set((state) => {
      const newPartyRooms = state.partyRooms.map((r) =>
        r.id === roomId ? { ...r, unreadCount: 0 } : r
      );
      const partyUnread = newPartyRooms.reduce((sum, r) => sum + r.unreadCount, 0);
      const dmUnread = state.dmRooms.reduce((sum, r) => sum + r.unreadCount, 0);
      return { partyRooms: newPartyRooms, totalUnreadCount: dmUnread + partyUnread };
    });
  },

  // 메시지 관리
  addPartyMessage: (roomId, message) =>
    set((state) => ({
      partyMessages: {
        ...state.partyMessages,
        [roomId]: [...(state.partyMessages[roomId] || []), message],
      },
      // 해당 방의 lastMessage, lastMessageAt 업데이트
      partyRooms: state.partyRooms.map((r) =>
        r.id === roomId
          ? { ...r, lastMessage: message.content, lastMessageAt: message.timestamp }
          : r
      ),
    })),

  setPartyMessages: (roomId, messages) =>
    set((state) => ({
      partyMessages: {
        ...state.partyMessages,
        [roomId]: messages,
      },
    })),

  addDmMessage: (roomId, message) =>
    set((state) => ({
      dmMessages: {
        ...state.dmMessages,
        [roomId]: [...(state.dmMessages[roomId] || []), message],
      },
      // 해당 방의 lastMessageContent, lastMessageAt 업데이트
      dmRooms: state.dmRooms.map((r) =>
        r.id === roomId
          ? { ...r, lastMessageContent: message.content, lastMessageAt: message.timestamp }
          : r
      ),
    })),

  setDmMessages: (roomId, messages) =>
    set((state) => ({
      dmMessages: {
        ...state.dmMessages,
        [roomId]: messages,
      },
    })),

  // 알림
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification].slice(-10), // 최대 10개 유지
    })),

  clearNotifications: () => set({ notifications: [] }),

  recalculateTotalUnread: () => {
    const state = get();
    const dmUnread = state.dmRooms.reduce((sum, r) => sum + r.unreadCount, 0);
    const partyUnread = state.partyRooms.reduce((sum, r) => sum + r.unreadCount, 0);
    set({ totalUnreadCount: dmUnread + partyUnread });
  },
}));
