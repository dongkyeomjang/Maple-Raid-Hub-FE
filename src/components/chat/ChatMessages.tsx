"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Send, ArrowLeft, User, Loader2, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PartyChatMessage, DmChatMessage } from "@/lib/stores/chat-store";
import type { PartyMemberResponse } from "@/types/api";

interface MemberInfo {
  name: string | null;
  imageUrl: string | null;
}

interface ChatMessagesProps {
  type: "party" | "dm";
  roomName: string;
  messages: PartyChatMessage[] | DmChatMessage[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
  isConnected: boolean;
  members?: PartyMemberResponse[];
  hasMore?: boolean;
  onLoadMore?: () => Promise<unknown>;
  isLoadingMore?: boolean;
  onEvaluate?: (userId: string, name: string) => void;
  targetUserId?: string;
  targetName?: string;
}

export function ChatMessages({
  type,
  roomName,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  isConnected,
  members,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
  onEvaluate,
  targetUserId,
  targetName,
}: ChatMessagesProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 이전 메시지 로드 중인지 추적 (스크롤 위치 유지용)
  const isLoadingOlderRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const prevFirstMessageIdRef = useRef<string | null>(null);
  const shouldScrollToBottomRef = useRef(true);

  // userId로 멤버 정보 조회
  const getMemberInfo = (userId: string | null): MemberInfo | null => {
    if (!userId || !members) return null;
    const member = members.find((m) => m.userId === userId);
    if (!member) return null;
    return {
      name: member.characterName,
      imageUrl: member.characterImageUrl,
    };
  };

  // 메시지 변경 시 스크롤 처리
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;

    const currentFirstMessageId = messages[0]?.id;

    // 이전 메시지가 로드된 경우 (첫 메시지 ID가 바뀜) - 스크롤 위치 유지
    if (isLoadingOlderRef.current && prevFirstMessageIdRef.current !== currentFirstMessageId) {
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      container.scrollTop = scrollDiff;
      isLoadingOlderRef.current = false;
    }
    // 새 메시지가 끝에 추가된 경우 또는 초기 로드 - 맨 아래로 스크롤
    else if (shouldScrollToBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }

    prevFirstMessageIdRef.current = currentFirstMessageId;
  }, [messages]);

  // 스크롤 이벤트 핸들러 - 상단 도달 시 이전 메시지 로드
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // 사용자가 스크롤을 위로 올렸는지 확인 (맨 아래에서 100px 이상 떨어진 경우)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    shouldScrollToBottomRef.current = isNearBottom;

    // 상단 도달 시 이전 메시지 로드
    if (!hasMore || isLoadingMore || !onLoadMore || isLoadingOlderRef.current) return;

    if (container.scrollTop < 100) {
      isLoadingOlderRef.current = true;
      prevScrollHeightRef.current = container.scrollHeight;
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !isConnected) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
    inputRef.current?.focus();
    // 메시지 전송 후 맨 아래로 스크롤 예약
    shouldScrollToBottomRef.current = true;
    // 약간의 지연 후 스크롤 (메시지가 추가된 후)
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{roomName}</h3>
          <p className="text-xs text-muted-foreground">
            {isConnected ? (
              <span className="text-green-500">연결됨</span>
            ) : (
              <span className="text-yellow-500">연결 중...</span>
            )}
          </p>
        </div>
        {onEvaluate && (
          type === "dm" && targetUserId && targetName ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEvaluate(targetUserId, targetName)}
              title="매너 평가"
            >
              <Thermometer className="h-4 w-4" />
            </Button>
          ) : type === "party" && members && members.length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="매너 평가">
                  <Thermometer className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">평가할 멤버 선택</p>
                {members
                  .filter((m) => m.userId !== currentUserId)
                  .map((member) => (
                    <button
                      key={member.userId}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-sm text-left"
                      onClick={() => onEvaluate(member.userId, member.characterName || "알 수 없음")}
                    >
                      <div className="h-6 w-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {member.characterImageUrl ? (
                          <img
                            src={member.characterImageUrl}
                            alt={member.characterName || ""}
                            className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <span className="truncate">{member.characterName || "알 수 없음"}</span>
                    </button>
                  ))}
              </PopoverContent>
            </Popover>
          ) : null
        )}
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3"
        onScroll={handleScroll}
      >
        {/* 로딩 인디케이터 */}
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* 더 불러오기 버튼 (선택적) */}
        {hasMore && !isLoadingMore && (
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => onLoadMore?.()}
            >
              이전 메시지 보기
            </Button>
          </div>
        )}

        {messages.length === 0 && !isLoadingMore ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            메시지가 없습니다
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUserId}
              type={type}
              memberInfo={getMemberInfo(message.senderId)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isConnected ? "메시지를 입력하세요..." : "연결 중..."}
            disabled={!isConnected}
            className="flex-1 h-9 text-sm"
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9"
            disabled={!isConnected || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function MessageItem({
  message,
  isOwnMessage,
  type,
  memberInfo,
}: {
  message: PartyChatMessage | DmChatMessage;
  isOwnMessage: boolean;
  type: "party" | "dm";
  memberInfo: MemberInfo | null;
}) {
  const isSystemMessage = type === "party"
    ? (message as PartyChatMessage).type !== "CHAT"
    : (message as DmChatMessage).type === "SYSTEM";

  if (isSystemMessage) {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  // DM인 경우 캐릭터 정보 우선, 파티인 경우 memberInfo 우선
  const dmMessage = type === "dm" ? (message as DmChatMessage) : null;
  const displayName = dmMessage?.senderCharacterName || memberInfo?.name || message.senderNickname;
  const displayImageUrl = dmMessage?.senderCharacterImageUrl || memberInfo?.imageUrl;

  return (
    <div className={cn("flex gap-2", isOwnMessage ? "flex-row-reverse" : "flex-row")}>
      {!isOwnMessage && (
        <Avatar className="h-7 w-7 shrink-0 overflow-hidden">
          {displayImageUrl ? (
            <img
              src={displayImageUrl}
              alt={displayName || ""}
              className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
            />
          ) : (
            <AvatarFallback className="text-xs">
              {displayName?.charAt(0).toUpperCase() || <User className="h-3 w-3" />}
            </AvatarFallback>
          )}
        </Avatar>
      )}
      <div className={cn("flex flex-col max-w-[75%]", isOwnMessage ? "items-end" : "items-start")}>
        {!isOwnMessage && (
          <span className="text-xs font-medium mb-0.5">{displayName}</span>
        )}
        <div
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm break-words",
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-muted-foreground mt-0.5">
          {formatDistanceToNow(new Date(message.timestamp), {
            addSuffix: true,
            locale: ko,
          })}
        </span>
      </div>
    </div>
  );
}
