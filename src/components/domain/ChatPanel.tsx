"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessage } from "@/types/api";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Send, MessageCircle, User } from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function ChatPanel({
  messages,
  currentUserId,
  onSendMessage,
  isLoading,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="py-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="h-5 w-5" />
          파티 채팅
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            채팅 메시지가 없습니다
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

function ChatMessageItem({
  message,
  isOwnMessage,
}: {
  message: ChatMessage;
  isOwnMessage: boolean;
}) {
  if (message.type === "SYSTEM") {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("flex gap-2", isOwnMessage ? "flex-row-reverse" : "flex-row")}
    >
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwnMessage ? "items-end" : "items-start"
        )}
      >
        {!isOwnMessage && (
          <span className="text-xs font-medium mb-1">{message.senderNickname}</span>
        )}
        <div
          className={cn(
            "px-3 py-2 rounded-lg text-sm",
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          {message.content}
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
