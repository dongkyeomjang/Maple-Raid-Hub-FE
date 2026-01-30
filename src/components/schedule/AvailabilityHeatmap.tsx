"use client";

import { useMemo } from "react";
import { format, parseISO, addDays, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export interface HeatmapSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  availableCount: number;
  availableUserIds: string[];
}

interface AvailabilityHeatmapProps {
  heatmapData: HeatmapSlot[];
  totalMembers: number;
  startHour?: number;
  endHour?: number;
  daysToShow?: number;
  isLeader: boolean;
  onConfirmTime?: (date: string, time: string) => void;
  confirmedTime?: { date: string; time: string } | null;
}

export function AvailabilityHeatmap({
  heatmapData,
  totalMembers,
  startHour = 9,
  endHour = 24,
  daysToShow = 7,
  isLeader,
  onConfirmTime,
  confirmedTime,
}: AvailabilityHeatmapProps) {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(today, i));

  // 30분 단위 시간 생성
  const times: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    times.push(`${hour.toString().padStart(2, "0")}:00`);
    times.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  // 시간 형식 정규화 (HH:mm:ss -> HH:mm)
  const normalizeTime = (time: string): string => {
    return time.substring(0, 5); // "09:00:00" -> "09:00"
  };

  // 히트맵 데이터를 맵으로 변환
  const heatmapMap = useMemo(() => {
    const map = new Map<string, HeatmapSlot>();
    heatmapData.forEach((slot) => {
      // 백엔드에서 오는 time이 "HH:mm:ss" 형식일 수 있으므로 정규화
      const normalizedTime = normalizeTime(slot.time);
      map.set(`${slot.date}_${normalizedTime}`, slot);
    });
    return map;
  }, [heatmapData]);

  const getSlotData = (date: Date, time: string): HeatmapSlot | null => {
    const dateStr = format(date, "yyyy-MM-dd");
    const normalizedTime = normalizeTime(time);
    return heatmapMap.get(`${dateStr}_${normalizedTime}`) || null;
  };

  const getHeatColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (totalMembers === 0) return "bg-gray-100";

    const ratio = count / totalMembers;
    if (ratio >= 1) return "bg-green-500";
    if (ratio >= 0.75) return "bg-green-400";
    if (ratio >= 0.5) return "bg-yellow-400";
    if (ratio >= 0.25) return "bg-orange-300";
    return "bg-red-200";
  };

  const isConfirmed = (date: Date, time: string) => {
    if (!confirmedTime) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    return confirmedTime.date === dateStr && confirmedTime.time === time;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full max-h-[450px] overflow-y-auto">
        {/* 헤더: 날짜 */}
        <div className="flex border-b sticky top-0 bg-background z-10">
          <div className="w-16 flex-shrink-0" />
          {dates.map((date) => (
            <div
              key={date.toISOString()}
              className="flex-1 min-w-[60px] text-center py-2 border-l"
            >
              <div className="text-xs text-muted-foreground">
                {format(date, "E", { locale: ko })}
              </div>
              <div className="text-sm font-medium">{format(date, "M/d")}</div>
            </div>
          ))}
        </div>

        {/* 그리드 본문 */}
        <div>
          {times.map((time) => (
            <div key={time} className="flex">
              {/* 시간 라벨 */}
              <div
                className={cn(
                  "w-16 flex-shrink-0 h-6 flex items-center justify-end pr-2 text-xs text-muted-foreground",
                  time.endsWith(":30") && "opacity-50"
                )}
              >
                {time.endsWith(":00") ? time : ""}
              </div>

              {/* 셀들 */}
              {dates.map((date) => {
                const slotData = getSlotData(date, time);
                const count = slotData?.availableCount || 0;
                const confirmed = isConfirmed(date, time);

                return (
                  <div
                    key={`${date.toISOString()}-${time}`}
                    className={cn(
                      "flex-1 min-w-[60px] h-6 border-l border-b relative group",
                      getHeatColor(count),
                      confirmed && "ring-2 ring-primary ring-inset",
                      time.endsWith(":00") && "border-t border-t-muted-foreground/20"
                    )}
                    title={`${count}/${totalMembers}명 가능`}
                  >
                    {/* 카운트 표시 (전원 가능 시) */}
                    {count === totalMembers && count > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}

                    {/* 확정/변경 버튼 (리더만, 호버 시) */}
                    {isLeader && count > 0 && onConfirmTime && !confirmed && (
                      <button
                        onClick={() => onConfirmTime(format(date, "yyyy-MM-dd"), time)}
                        className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100",
                          "flex items-center justify-center bg-black/30",
                          "text-white text-[10px] font-medium transition-opacity"
                        )}
                      >
                        {confirmedTime ? "변경" : "확정"}
                      </button>
                    )}

                    {/* 확정됨 표시 */}
                    {confirmed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                        <span className="text-[10px] font-bold text-primary">확정</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap items-center justify-end gap-3 mt-3 text-xs text-muted-foreground">
        <span className="font-medium">가능 인원:</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-100 border rounded" />
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-200 rounded" />
          <span>1+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-orange-300 rounded" />
          <span>25%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-400 rounded" />
          <span>50%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-400 rounded" />
          <span>75%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span>전원</span>
        </div>
      </div>
    </div>
  );
}
