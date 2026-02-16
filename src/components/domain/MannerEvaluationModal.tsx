"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { useCheckEvaluationAvailability, useSubmitMannerEvaluation } from "@/lib/hooks/use-manner";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { MannerTag, EvaluationContext } from "@/types/api";

interface MannerEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string | null;
  targetName: string;
  context: EvaluationContext;
}

const positiveTags: { id: MannerTag; label: string }[] = [
  { id: "GOOD_CONTACT", label: "연락이 잘돼요" },
  { id: "PUNCTUAL", label: "시간 약속을 잘 지켜요" },
  { id: "KIND", label: "친절하고 매너가 좋아요" },
  { id: "CARRIES_LOG", label: "통나무를 들어줘요" },
  { id: "GOOD_CONTROL", label: "컨트롤이 좋아요" },
];

const negativeTags: { id: MannerTag; label: string }[] = [
  { id: "BAD_CONTACT", label: "연락이 잘 안돼요" },
  { id: "LATE", label: "시간 약속을 안 지켜요" },
  { id: "NO_SHOW", label: "노쇼를 했어요" },
  { id: "RUDE", label: "불친절해요" },
  { id: "TOXIC", label: "비매너 언행이 있었어요" },
];

const positiveTagIds = new Set(positiveTags.map((t) => t.id));

export function MannerEvaluationModal({
  isOpen,
  onClose,
  targetUserId,
  targetName,
  context,
}: MannerEvaluationModalProps) {
  const [selectedTags, setSelectedTags] = useState<MannerTag[]>([]);
  const { data: availability, isLoading: availabilityLoading } = useCheckEvaluationAvailability(
    isOpen ? targetUserId : null
  );
  const submitMutation = useSubmitMannerEvaluation();

  useEffect(() => {
    if (!isOpen) {
      setSelectedTags([]);
    }
  }, [isOpen]);

  // 현재 선택된 태그의 카테고리 판별
  const selectedCategory: "positive" | "negative" | null =
    selectedTags.length === 0
      ? null
      : positiveTagIds.has(selectedTags[0])
        ? "positive"
        : "negative";

  const toggleTag = (tag: MannerTag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  };

  const handleSubmit = async () => {
    if (!targetUserId || selectedTags.length === 0) return;
    try {
      await submitMutation.mutateAsync({
        targetUserId,
        context,
        tags: selectedTags,
      });
      onClose();
    } catch {
      // error is handled by mutation state
    }
  };

  const handleClose = () => {
    setSelectedTags([]);
    onClose();
  };

  if (!targetUserId) return null;

  const canEvaluate = availability?.canEvaluate ?? false;
  const isPositiveDisabled = selectedCategory === "negative";
  const isNegativeDisabled = selectedCategory === "positive";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>매너 평가</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{targetName}</span>님에 대해 평가해주세요.
          </DialogDescription>
        </DialogHeader>

        {availabilityLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !canEvaluate ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {availability?.nextAvailableAt
                ? `다음 평가 가능 시간: ${formatDistanceToNow(new Date(availability.nextAvailableAt), { addSuffix: true, locale: ko })}`
                : "이 사용자에게는 평가할 수 없습니다."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              {/* Positive Tags */}
              <div className={cn("space-y-2", isPositiveDisabled && "opacity-40")}>
                <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                  <ThumbsUp className="h-4 w-4" />
                  긍정 평가
                </div>
                <div className="flex flex-wrap gap-2">
                  {positiveTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className={cn(
                        "transition-colors",
                        isPositiveDisabled
                          ? "cursor-not-allowed"
                          : "cursor-pointer",
                        selectedTags.includes(tag.id) && "bg-green-600 hover:bg-green-700"
                      )}
                      onClick={() => !isPositiveDisabled && toggleTag(tag.id)}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Negative Tags */}
              <div className={cn("space-y-2", isNegativeDisabled && "opacity-40")}>
                <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
                  <ThumbsDown className="h-4 w-4" />
                  부정 평가
                </div>
                <div className="flex flex-wrap gap-2">
                  {negativeTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className={cn(
                        "transition-colors",
                        isNegativeDisabled
                          ? "cursor-not-allowed"
                          : "cursor-pointer",
                        selectedTags.includes(tag.id) && "bg-red-600 hover:bg-red-700"
                      )}
                      onClick={() => !isNegativeDisabled && toggleTag(tag.id)}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                * 긍정 또는 부정 중 한 종류에서 1~3개 태그를 선택할 수 있습니다.
                <br />* 같은 사용자에게 30일에 1회만 평가할 수 있습니다.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                취소
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedTags.length === 0 || submitMutation.isPending}
              >
                {submitMutation.isPending ? "제출 중..." : "평가 제출"}
              </Button>
            </DialogFooter>

            {submitMutation.isError && (
              <p className="text-xs text-red-500 text-center">
                {submitMutation.error?.message || "평가 제출에 실패했습니다."}
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
