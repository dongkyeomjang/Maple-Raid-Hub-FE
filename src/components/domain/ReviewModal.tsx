"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { PendingReview, ReviewTag } from "@/types/api";
import { cn } from "@/lib/utils";
import { User, ThumbsUp, ThumbsDown } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingReview: PendingReview | null;
  onSubmit: (tags: ReviewTag[]) => void;
  isSubmitting: boolean;
}

const positiveTags: { id: ReviewTag; label: string }[] = [
  { id: "SKILLED", label: "실력 좋음" },
  { id: "PUNCTUAL", label: "시간 준수" },
  { id: "GOOD_COMM", label: "소통 원활" },
  { id: "FRIENDLY", label: "친절함" },
  { id: "LEADER_MATERIAL", label: "리더십 있음" },
];

const negativeTags: { id: ReviewTag; label: string }[] = [
  { id: "UNSKILLED", label: "실력 부족" },
  { id: "LATE", label: "지각/늦음" },
  { id: "BAD_COMM", label: "소통 불량" },
  { id: "RUDE", label: "불친절함" },
  { id: "NO_SHOW", label: "노쇼" },
];

export function ReviewModal({
  isOpen,
  onClose,
  pendingReview,
  onSubmit,
  isSubmitting,
}: ReviewModalProps) {
  const [selectedTags, setSelectedTags] = useState<ReviewTag[]>([]);

  const toggleTag = (tag: ReviewTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (selectedTags.length > 0) {
      onSubmit(selectedTags);
      setSelectedTags([]);
    }
  };

  const handleClose = () => {
    setSelectedTags([]);
    onClose();
  };

  if (!pendingReview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>파티원 리뷰</DialogTitle>
          <DialogDescription>
            파티원의 활동에 대해 평가해주세요. 선택한 태그에 따라 온도가 변동됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Target Member */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar>
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{pendingReview.characterName}</p>
              <p className="text-sm text-muted-foreground">{pendingReview.nickname}</p>
            </div>
          </div>

          {/* Positive Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <ThumbsUp className="h-4 w-4" />
              긍정적 평가
            </div>
            <div className="flex flex-wrap gap-2">
              {positiveTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedTags.includes(tag.id) &&
                      "bg-green-600 hover:bg-green-700"
                  )}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Negative Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-red-700">
              <ThumbsDown className="h-4 w-4" />
              부정적 평가
            </div>
            <div className="flex flex-wrap gap-2">
              {negativeTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedTags.includes(tag.id) &&
                      "bg-red-600 hover:bg-red-700"
                  )}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground">
            * 긍정적 태그는 온도를 올리고, 부정적 태그는 온도를 낮춥니다.
            <br />* 태그를 최소 1개 이상 선택해주세요.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedTags.length === 0 || isSubmitting}
          >
            {isSubmitting ? "제출 중..." : "리뷰 제출"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
