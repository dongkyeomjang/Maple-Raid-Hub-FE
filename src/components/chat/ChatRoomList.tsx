"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore, DmRoom, PartyChatRoom } from "@/lib/stores/chat-store";

interface ChatRoomListProps {
  type: "party" | "dm";
  rooms: PartyChatRoom[] | DmRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export function ChatRoomList({ type, rooms, selectedRoomId, onSelectRoom }: ChatRoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
        <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm">
          {type === "party" ? "참여 중인 파티가 없습니다" : "DM이 없습니다"}
        </p>
      </div>
    );
  }

  // 최신 메시지 순으로 정렬 (가장 최근 메시지가 위로)
  const sortByLastMessage = <T extends { lastMessageAt: string | null }>(a: T, b: T): number => {
    if (!a.lastMessageAt && !b.lastMessageAt) return 0;
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  };

  return (
    <div className="divide-y">
      {type === "party"
        ? [...(rooms as PartyChatRoom[])]
            .sort(sortByLastMessage)
            .map((room) => (
              <PartyChatRoomItem
                key={room.id}
                room={room}
                isSelected={selectedRoomId === room.id}
                onSelect={() => onSelectRoom(room.id)}
              />
            ))
        : [...(rooms as DmRoom[])]
            .sort(sortByLastMessage)
            .map((room) => (
              <DmRoomItem
                key={room.id}
                room={room}
                isSelected={selectedRoomId === room.id}
                onSelect={() => onSelectRoom(room.id)}
              />
            ))}
    </div>
  );
}

function formatMemberNames(names: string[], maxLength = 25): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];

  let result = names[0];
  let count = 1;

  for (let i = 1; i < names.length; i++) {
    const next = `${result}, ${names[i]}`;
    if (next.length > maxLength) {
      const remaining = names.length - count;
      if (remaining > 0) {
        return `${result} 외 ${remaining}명`;
      }
      break;
    }
    result = next;
    count++;
  }

  return result;
}

function PartyChatRoomItem({
  room,
  isSelected,
  onSelect,
}: {
  room: PartyChatRoom;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const memberDisplay = formatMemberNames(room.memberNames);

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full px-4 py-3 text-left transition-colors hover:bg-muted/50",
        isSelected && "bg-muted"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm truncate">{room.name}</span>
            {room.unreadCount > 0 && (
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium">
                {room.unreadCount}
              </span>
            )}
          </div>
          {memberDisplay && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {memberDisplay}
            </p>
          )}
          {room.lastMessageAt && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDistanceToNow(new Date(room.lastMessageAt), {
                addSuffix: true,
                locale: ko,
              })}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function DmRoomItem({
  room,
  isSelected,
  onSelect,
}: {
  room: DmRoom;
  isSelected: boolean;
  onSelect: () => void;
}) {
  // 캐릭터 정보가 있으면 캐릭터명, 없으면 유저 닉네임 사용
  const displayName = room.otherCharacterName || room.otherUserNickname;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full px-4 py-3 text-left transition-colors hover:bg-muted/50",
        isSelected && "bg-muted"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
          {room.otherCharacterImageUrl ? (
            <img
              src={room.otherCharacterImageUrl}
              alt={displayName}
              className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
            />
          ) : (
            <span className="text-blue-500 font-medium text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm truncate">{displayName}</span>
            {room.unreadCount > 0 && (
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium">
                {room.unreadCount}
              </span>
            )}
          </div>
          {room.lastMessageAt && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDistanceToNow(new Date(room.lastMessageAt), {
                addSuffix: true,
                locale: ko,
              })}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
