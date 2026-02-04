"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
import { ChatRoomList } from "./ChatRoomList";
import { ChatMessages } from "./ChatMessages";
import { DraftDmChat } from "./DraftDmChat";
import { cn } from "@/lib/utils";

export function ChatPanel() {
  const { user } = useAuth();
  const isOpen = useChatStore((s) => s.isOpen);
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

  // 읽지 않은 메시지 카운트 계산
  const partyUnreadCount = partyRooms.reduce((sum, r) => sum + r.unreadCount, 0);
  const dmUnreadCount = dmRooms.reduce((sum, r) => sum + r.unreadCount, 0);

  // 로딩 상태
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
        .filter((room) => room.status === "ACTIVE")
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

  if (!user || !isOpen) return null;

  const handleSelectRoom = (roomId: string, type: "party" | "dm") => {
    selectRoom(roomId, type);
  };

  const handleSendMessage = (content: string) => {
    if (!user) return;

    if (selectedRoomType === "party") {
      sendPartyMessage(content, user.nickname);
    } else {
      // DM 전송 시 내 캐릭터 ID 포함
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

  // 임시 DM에서 메시지 전송 시 방 생성 + 메시지 전송
  const handleDraftDmSend = async (content: string) => {
    if (!draftDm) return;

    try {
      // 1. DM 방 생성
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

      // 2. 메시지 전송
      const messageResult = await api.dm.sendMessage(
        roomId,
        content,
        draftDm.senderCharacterId
      );

      if (!messageResult.success) {
        throw new Error(messageResult.error?.message || "메시지 전송에 실패했습니다.");
      }

      // 3. DM 방 목록 새로고침
      const roomsResult = await api.dm.getRooms();
      if (roomsResult.success && roomsResult.data) {
        setDmRooms((roomsResult.data as { dmRooms: DmRoom[] }).dmRooms);
      }

      // 4. 임시 DM 초기화하고 생성된 방 선택
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

  return (
    <Card
      className={cn(
        "fixed bottom-24 right-6 w-[360px] h-[500px] z-40",
        "shadow-xl flex flex-col overflow-hidden",
        "animate-in slide-in-from-bottom-5 duration-200"
      )}
    >
      {/* 임시 DM 모드 */}
      {draftDm ? (
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
        />
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "party" | "dm")}
          className="flex flex-col h-full"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
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
      )}
    </Card>
  );
}
