"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDiscordLink } from "@/lib/hooks/use-discord";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/hooks/use-auth";
import { Link2 } from "lucide-react";

interface DiscordLinkPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiscordLinkPromptModal({ isOpen, onClose }: DiscordLinkPromptModalProps) {
  const linkDiscord = useDiscordLink();
  const { checkAuth } = useAuth();
  const [dismissing, setDismissing] = useState(false);

  const handleLink = () => {
    linkDiscord.mutate();
  };

  const handleDismiss = async () => {
    setDismissing(true);
    try {
      await apiClient.auth.dismissDiscordPrompt();
      await checkAuth();
    } catch {
      // ignore
    }
    setDismissing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            디스코드 알림 연동
          </DialogTitle>
          <DialogDescription>
            디스코드를 연동하면 모집 신청, DM 등의 알림을 휴대폰에서 받을 수 있어요!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            디스코드 앱의 알림 설정이 켜져 있으면, 파티 지원/수락/거절, DM 수신 시 실시간으로 알림을 받을 수 있습니다.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleDismiss}
            disabled={dismissing}
          >
            {dismissing ? "처리 중..." : "나중에 하기"}
          </Button>
          <Button
            onClick={handleLink}
            disabled={linkDiscord.isPending}
          >
            <Link2 className="h-4 w-4 mr-1" />
            {linkDiscord.isPending ? "연동 중..." : "연동하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
