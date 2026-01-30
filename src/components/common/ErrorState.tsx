"use client";

import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/brand/Mascot";
import { RefreshCw } from "lucide-react";
import { EASTER_EGGS } from "@/components/brand/brand-constants";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showMascot?: boolean;
}

export function ErrorState({
  title = "이런! 뭔가 잘못됐어요",
  message = "데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  onRetry,
  showMascot = true,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {showMascot ? (
        <div className="mb-4">
          <Mascot variant="thinking" size="lg" animate={false} />
        </div>
      ) : (
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <span className="text-3xl">😢</span>
        </div>
      )}
      <h3 className="text-h3 font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-body-sm text-muted-foreground mb-6 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="group">
          <RefreshCw className="h-4 w-4 mr-2 group-hover:animate-spin" />
          다시 시도
        </Button>
      )}
    </div>
  );
}
