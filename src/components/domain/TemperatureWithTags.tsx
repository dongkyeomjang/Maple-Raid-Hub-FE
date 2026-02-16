"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TemperatureBadge } from "./TemperatureBadge";
import { useTagSummary } from "@/lib/hooks/use-manner";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MannerTag } from "@/types/api";

const TAG_LABELS: Record<MannerTag, string> = {
  GOOD_CONTACT: "연락이 잘돼요",
  PUNCTUAL: "시간 약속을 잘 지켜요",
  KIND: "친절하고 매너가 좋아요",
  CARRIES_LOG: "통나무를 들어줘요",
  GOOD_CONTROL: "컨트롤이 좋아요",
  BAD_CONTACT: "연락이 잘 안돼요",
  LATE: "시간 약속을 안 지켜요",
  NO_SHOW: "노쇼를 했어요",
  RUDE: "불친절해요",
  TOXIC: "비매너 언행이 있었어요",
};

const POSITIVE_TAGS = new Set<MannerTag>([
  "GOOD_CONTACT", "PUNCTUAL", "KIND", "CARRIES_LOG", "GOOD_CONTROL",
]);

interface TemperatureWithTagsProps {
  temperature: number;
  userId: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function TemperatureWithTags({
  temperature,
  userId,
  size = "md",
  showLabel = false,
}: TemperatureWithTagsProps) {
  const [open, setOpen] = useState(false);
  const { data: tagSummary, isLoading } = useTagSummary(open ? userId : null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center hover:opacity-80 transition-opacity cursor-pointer">
          <TemperatureBadge
            temperature={temperature}
            size={size}
            showLabel={showLabel}
            showIcon
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">매너 평가</span>
            {tagSummary && (
              <span className="text-xs text-muted-foreground">
                총 {tagSummary.totalEvaluations}회
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : !tagSummary || tagSummary.tagCounts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">
              아직 받은 평가가 없습니다.
            </p>
          ) : (
            <div className="space-y-1.5">
              {tagSummary.tagCounts.map(({ tag, count }) => {
                const isPositive = POSITIVE_TAGS.has(tag);
                return (
                  <div
                    key={tag}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isPositive ? (
                        <ThumbsUp className="h-3 w-3 text-green-500 flex-shrink-0" />
                      ) : (
                        <ThumbsDown className="h-3 w-3 text-red-500 flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "truncate text-xs",
                          isPositive ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                        )}
                      >
                        {TAG_LABELS[tag] || tag}
                      </span>
                    </div>
                    <span className="text-xs font-medium tabular-nums text-muted-foreground flex-shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
