"use client";

import { useState, useRef } from "react";
import { Send, ArrowLeft, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DraftDmChatProps {
  targetName: string;
  senderCharacterName: string;
  senderCharacterImageUrl: string | null;
  onSendMessage: (content: string) => Promise<void>;
  onBack: () => void;
}

export function DraftDmChat({
  targetName,
  senderCharacterName,
  senderCharacterImageUrl,
  onSendMessage,
  onBack,
}: DraftDmChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(inputValue.trim());
      setInputValue("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{targetName}</h3>
          <p className="text-xs text-muted-foreground">새 대화</p>
        </div>
      </div>

      {/* Empty Message Area with Guide */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
          <span className="text-blue-500 font-bold text-2xl">
            {targetName.charAt(0).toUpperCase()}
          </span>
        </div>
        <h4 className="font-medium text-lg mb-1">{targetName}</h4>
        <p className="text-sm text-muted-foreground mb-4">
          새로운 대화를 시작합니다
        </p>

        {/* 보내는 캐릭터 정보 */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
          <div className="h-6 w-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {senderCharacterImageUrl ? (
              <img
                src={senderCharacterImageUrl}
                alt={senderCharacterName}
                className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{senderCharacterName}</span>
            (으)로 보냅니다
          </span>
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isSending}
            className="flex-1 h-9 text-sm"
            autoFocus
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9"
            disabled={isSending || !inputValue.trim()}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
