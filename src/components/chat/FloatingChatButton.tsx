"use client";

import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/stores/chat-store";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

export function FloatingChatButton() {
  const { user } = useAuth();
  const isOpen = useChatStore((s) => s.isOpen);
  const togglePanel = useChatStore((s) => s.togglePanel);
  const totalUnreadCount = useChatStore((s) => s.totalUnreadCount);

  // 비로그인 시 버튼 숨김
  if (!user) {
    return null;
  }

  return (
    <Button
      onClick={togglePanel}
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50",
        "transition-all duration-200 hover:scale-110",
        isOpen ? "bg-gray-600 hover:bg-gray-700" : "bg-primary hover:bg-primary/90"
      )}
      size="icon"
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <>
          <MessageCircle className="h-6 w-6" />
          {totalUnreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-1 -right-1 flex items-center justify-center",
                "min-w-[22px] h-[22px] px-1.5 rounded-full",
                "bg-red-500 text-white text-xs font-bold animate-pulse"
              )}
            >
              {totalUnreadCount > 300 ? "300+" : totalUnreadCount}
            </span>
          )}
        </>
      )}
    </Button>
  );
}
