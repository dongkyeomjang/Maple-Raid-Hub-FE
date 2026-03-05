"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageCircle, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChatStore, PartyChatRoom, DmRoom } from "@/lib/stores/chat-store";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePartyRooms, usePartyRoomUpdatesSubscription } from "@/lib/hooks/use-party-rooms";
import { useBossNames } from "@/lib/hooks/use-boss-names";
import {
  useDmRooms,
  useDmMessages,
  usePartyMessages,
  useMarkDmAsRead,
  useMarkPartyAsRead,
  useDmChatSubscription,
  usePartyChatSubscription,
  useNotificationSubscription,
  usePartyChatNotificationSubscription,
  partyRoomToChatRoom,
} from "@/lib/hooks/use-chat";
import { api } from "@/lib/api/client";
import { ChatRoomList } from "@/components/chat/ChatRoomList";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { DraftDmChat } from "@/components/chat/DraftDmChat";
import { MannerEvaluationModal } from "@/components/domain/MannerEvaluationModal";
import { cn } from "@/lib/utils";
import type { EvaluationContext } from "@/types/api";

export default function ChatPage() {
  const { user } = useAuth();
  const activeTab = useChatStore((s) => s.activeTab);
  const setActiveTab = useChatStore((s) => s.setActiveTab);
  const selectedRoomId = useChatStore((s) => s.selectedRoomId);
  const selectedRoomType = useChatStore((s) => s.selectedRoomType);
  const selectRoom = useChatStore((s) => s.selectRoom);
  const clearSelection = useChatStore((s) => s.clearSelection);
  const draftDm = useChatStore((s) => s.draftDm);
  const clearDraftDm = useChatStore((s) => s.clearDraftDm);
  const dmRooms = useChatStore((s) => s.dmRooms);
  const partyRooms = useChatStore((s) => s.partyRooms);
  const setPartyRooms = useChatStore((s) => s.setPartyRooms);
  const setDmRooms = useChatStore((s) => s.setDmRooms);
  const partyMessages = useChatStore((s) => s.partyMessages);
  const dmMessages = useChatStore((s) => s.dmMessages);
  const clearPartyUnread = useChatStore((s) => s.clearPartyUnread);
  const clearDmUnread = useChatStore((s) => s.clearDmUnread);

  const { getBossName } = useBossNames();

  const partyUnreadCount = partyRooms.reduce((sum, r) => sum + r.unreadCount, 0);
  const dmUnreadCount = dmRooms.reduce((sum, r) => sum + r.unreadCount, 0);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [mannerModal, setMannerModal] = useState<{
    isOpen: boolean;
    targetUserId: string | null;
    targetName: string;
    context: EvaluationContext;
  }>({ isOpen: false, targetUserId: null, targetName: "", context: "DM" });

  // 데이터 로딩
  useDmRooms();
  const { data: partyRoomsData } = usePartyRooms();
  const { refetch: refetchDmMessages, hasMore: dmHasMore, fetchMore: fetchMoreDmMessages } = useDmMessages(
    selectedRoomType === "dm" ? selectedRoomId : null
  );
  const { refetch: refetchPartyMessages, hasMore: partyHasMore, fetchMore: fetchMorePartyMessages } = usePartyMessages(
    selectedRoomType === "party" ? selectedRoomId : null
  );
  const { mutate: markDmAsRead } = useMarkDmAsRead();
  const { mutate: markPartyAsRead } = useMarkPartyAsRead();

  // WebSocket 구독
  const { sendMessage: sendPartyMessage, connected: partyConnected } =
    usePartyChatSubscription(selectedRoomType === "party" ? selectedRoomId : null);
  const { sendMessage: sendDmMessage, connected: dmConnected } =
    useDmChatSubscription(selectedRoomType === "dm" ? selectedRoomId : null);
  useNotificationSubscription();
  usePartyChatNotificationSubscription();
  usePartyRoomUpdatesSubscription();

  // 파티룸 데이터를 채팅방으로 변환
  useEffect(() => {
    if (partyRoomsData && user) {
      const chatRooms: PartyChatRoom[] = partyRoomsData
        .map((room) => partyRoomToChatRoom(room, getBossName, user.id));
      setPartyRooms(chatRooms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyRoomsData, user]);

  // 방 선택 시 읽음 처리 및 메시지 로드
  useEffect(() => {
    if (selectedRoomId && selectedRoomType) {
      if (selectedRoomType === "dm") {
        markDmAsRead(selectedRoomId);
        clearDmUnread(selectedRoomId);
        refetchDmMessages();
      } else {
        markPartyAsRead(selectedRoomId);
        clearPartyUnread(selectedRoomId);
        refetchPartyMessages();
      }
    }
  }, [selectedRoomId, selectedRoomType, markDmAsRead, markPartyAsRead, clearDmUnread, clearPartyUnread, refetchDmMessages, refetchPartyMessages]);

  const handleEvaluate = useCallback((userId: string, name: string) => {
    const context: EvaluationContext = selectedRoomType === "dm" ? "DM" : "PARTY_CHAT";
    setMannerModal({ isOpen: true, targetUserId: userId, targetName: name, context });
  }, [selectedRoomType]);

  if (!user) {
    return (
      <div className="container py-16 text-center text-muted-foreground">
        로그인 후 이용할 수 있습니다.
      </div>
    );
  }

  const handleSelectRoom = (roomId: string, type: "party" | "dm") => {
    selectRoom(roomId, type);
  };

  const handleSendMessage = (content: string) => {
    if (!user) return;

    if (selectedRoomType === "party") {
      sendPartyMessage(content, user.nickname);
    } else {
      const myCharacterId = selectedDmRoom?.myCharacterId ?? undefined;
      sendDmMessage(content, user.nickname, myCharacterId);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      if (selectedRoomType === "party" && fetchMorePartyMessages) {
        await fetchMorePartyMessages();
      } else if (selectedRoomType === "dm" && fetchMoreDmMessages) {
        await fetchMoreDmMessages();
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDraftDmSend = async (content: string) => {
    if (!draftDm) return;

    try {
      const roomResult = await api.dm.createRoom(
        draftDm.postId,
        draftDm.targetUserId,
        draftDm.senderCharacterId,
        draftDm.targetCharacterId ?? undefined
      );

      if (!roomResult.success) {
        throw new Error(roomResult.error?.message || "DM 방 생성에 실패했습니다.");
      }

      const roomId = (roomResult.data as { id: string }).id;

      const messageResult = await api.dm.sendMessage(
        roomId,
        content,
        draftDm.senderCharacterId
      );

      if (!messageResult.success) {
        throw new Error(messageResult.error?.message || "메시지 전송에 실패했습니다.");
      }

      const roomsResult = await api.dm.getRooms();
      if (roomsResult.success && roomsResult.data) {
        setDmRooms((roomsResult.data as { dmRooms: DmRoom[] }).dmRooms);
      }

      clearDraftDm();
      selectRoom(roomId, "dm");
    } catch (error) {
      console.error("DM 전송 실패:", error);
      alert(error instanceof Error ? error.message : "DM 전송에 실패했습니다.");
    }
  };

  const selectedDmRoom = dmRooms.find((r) => r.id === selectedRoomId);
  const selectedPartyRoom = partyRooms.find((r) => r.id === selectedRoomId);
  const selectedPartyRoomData = partyRoomsData?.find((r) => r.id === selectedRoomId);

  const currentMessages =
    selectedRoomType === "party"
      ? partyMessages[selectedRoomId || ""] || []
      : dmMessages[selectedRoomId || ""] || [];

  const roomName =
    selectedRoomType === "party"
      ? selectedPartyRoom?.name || "파티 채팅"
      : selectedDmRoom?.otherCharacterName || selectedDmRoom?.otherUserNickname || "DM";

  const hasRoomSelected = !!(selectedRoomId && selectedRoomType) || !!draftDm;

  const roomListPanel = (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as "party" | "dm")}
      className="flex flex-col h-full"
    >
      <TabsList className="grid w-full grid-cols-2 rounded-none border-b shrink-0">
        <TabsTrigger value="party" className="gap-1.5 text-sm relative">
          <Users className="h-4 w-4" />
          파티 채팅
          {partyUnreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium min-w-[18px] text-center">
              {partyUnreadCount > 99 ? "99+" : partyUnreadCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="dm" className="gap-1.5 text-sm relative">
          <MessageCircle className="h-4 w-4" />
          개인DM
          {dmUnreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium min-w-[18px] text-center">
              {dmUnreadCount > 99 ? "99+" : dmUnreadCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="party" className="flex-1 overflow-y-auto m-0">
        <ChatRoomList
          type="party"
          rooms={partyRooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={(id) => handleSelectRoom(id, "party")}
        />
      </TabsContent>

      <TabsContent value="dm" className="flex-1 overflow-y-auto m-0">
        <ChatRoomList
          type="dm"
          rooms={dmRooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={(id) => handleSelectRoom(id, "dm")}
        />
      </TabsContent>
    </Tabs>
  );

  const messagePanel = draftDm ? (
    <DraftDmChat
      targetName={draftDm.targetName}
      senderCharacterName={draftDm.senderCharacterName}
      senderCharacterImageUrl={draftDm.senderCharacterImageUrl}
      onSendMessage={handleDraftDmSend}
      onBack={clearDraftDm}
    />
  ) : selectedRoomId && selectedRoomType ? (
    <ChatMessages
      type={selectedRoomType}
      roomName={roomName}
      messages={currentMessages}
      currentUserId={user.id}
      onSendMessage={handleSendMessage}
      onBack={clearSelection}
      isConnected={selectedRoomType === "party" ? partyConnected : dmConnected}
      members={selectedRoomType === "party" ? selectedPartyRoomData?.members : undefined}
      hasMore={selectedRoomType === "party" ? partyHasMore : dmHasMore}
      onLoadMore={handleLoadMore}
      isLoadingMore={isLoadingMore}
      onEvaluate={handleEvaluate}
      targetUserId={selectedRoomType === "dm" ? selectedDmRoom?.otherUserId : undefined}
      targetName={selectedRoomType === "dm" ? (selectedDmRoom?.otherCharacterName || selectedDmRoom?.otherUserNickname || "상대방") : undefined}
      disabled={selectedRoomType === "party" && selectedPartyRoomData?.status !== "ACTIVE"}
    />
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <MessageCircle className="h-16 w-16 mb-4 opacity-30" />
      <p className="text-lg font-medium">채팅방을 선택하세요</p>
      <p className="text-sm mt-1">좌측 목록에서 대화할 방을 선택해 주세요</p>
    </div>
  );

  return (
    <div className="container py-4 h-[calc(100vh-4rem)]">
      {/* Desktop: 2-column layout */}
      <div className="hidden md:flex h-full gap-0 border rounded-lg overflow-hidden bg-background">
        {/* 좌측: 방 목록 */}
        <div className="w-[320px] border-r flex flex-col shrink-0">
          {roomListPanel}
        </div>
        {/* 우측: 메시지 */}
        <div className="flex-1 flex flex-col min-w-0">
          {messagePanel}
        </div>
      </div>

      {/* Mobile: 방 미선택 시 목록만, 선택 시 메시지만 */}
      <div className="md:hidden h-full border rounded-lg overflow-hidden bg-background">
        {hasRoomSelected ? (
          <div className="h-full flex flex-col">
            {messagePanel}
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {roomListPanel}
          </div>
        )}
      </div>

      <MannerEvaluationModal
        isOpen={mannerModal.isOpen}
        onClose={() => setMannerModal((prev) => ({ ...prev, isOpen: false }))}
        targetUserId={mannerModal.targetUserId}
        targetName={mannerModal.targetName}
        context={mannerModal.context}
      />
    </div>
  );
}
