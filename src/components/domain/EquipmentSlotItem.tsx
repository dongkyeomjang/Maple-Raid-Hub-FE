"use client";

import { useState } from "react";
import type { EquipmentSlot, PotentialGrade } from "@/types/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EquipmentTooltip } from "./EquipmentTooltip";
import { EquipmentDetailDialog } from "./EquipmentDetailDialog";

interface EquipmentSlotItemProps {
  slot: EquipmentSlot | null;
  slotName: string;
  displayName: string;
  /** 오른쪽 열에 위치한 경우 true - 툴팁 방향 결정에 사용 */
  isRightColumn?: boolean;
}

const gradeColors: Record<PotentialGrade, string> = {
  "레어": "text-blue-600 dark:text-blue-400",
  "에픽": "text-purple-600 dark:text-purple-400",
  "유니크": "text-yellow-600 dark:text-yellow-400",
  "레전드리": "text-green-600 dark:text-green-400",
};

const gradeBgColors: Record<PotentialGrade, string> = {
  "레어": "bg-blue-100 dark:bg-blue-500/20",
  "에픽": "bg-purple-100 dark:bg-purple-500/20",
  "유니크": "bg-yellow-100 dark:bg-yellow-500/20",
  "레전드리": "bg-green-100 dark:bg-green-500/20",
};

export function EquipmentSlotItem({
  slot,
  slotName,
  displayName,
  isRightColumn = false,
}: EquipmentSlotItemProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const potentialGrade = slot?.details.potentialOptionGrade as PotentialGrade | null;
  const additionalGrade = slot?.details.additionalPotentialOptionGrade as PotentialGrade | null;
  const starforce = slot ? parseInt(slot.details.starforce || "0", 10) : 0;

  // 빈 슬롯
  if (!slot) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded border border-border/50 bg-muted/30 h-11">
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700/50 rounded flex items-center justify-center shrink-0">
          <span className="text-[7px] text-muted-foreground text-center leading-tight">
            {displayName}
          </span>
        </div>
        <span className="text-xs text-muted-foreground truncate flex-1">-</span>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 px-2 py-1.5 rounded border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer w-full h-11 text-left"
          >
            {/* 아이콘 */}
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded shrink-0 overflow-hidden">
              {slot.itemIcon ? (
                <img
                  src={slot.itemIcon}
                  alt={slot.itemName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[7px] text-muted-foreground flex items-center justify-center h-full">
                  {displayName}
                </span>
              )}
            </div>

            {/* 아이템 이름 */}
            <span className="flex-1 min-w-0 text-xs text-foreground truncate">
              {slot.itemName}
            </span>

            {/* 스타포스 */}
            {starforce > 0 && (
              <span className="text-[10px] text-yellow-400 shrink-0">
                ★{starforce}
              </span>
            )}

            {/* 윗잠재 등급 */}
            {potentialGrade && (
              <span
                className={`text-[10px] px-1 py-0.5 rounded shrink-0 ${
                  gradeColors[potentialGrade] || "text-gray-400"
                } ${gradeBgColors[potentialGrade] || "bg-muted"}`}
              >
                {potentialGrade}
              </span>
            )}

            {/* 아랫잠재(에디셔널) 등급 */}
            {additionalGrade && (
              <span
                className={`text-[10px] px-1 py-0.5 rounded shrink-0 ${
                  gradeColors[additionalGrade] || "text-gray-400"
                } ${gradeBgColors[additionalGrade] || "bg-muted"}`}
              >
                {additionalGrade}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side={isRightColumn ? "left" : "right"} className="p-0 bg-transparent border-0">
          <EquipmentTooltip slot={slot} />
        </TooltipContent>
      </Tooltip>

      <EquipmentDetailDialog
        slot={slot}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </TooltipProvider>
  );
}
