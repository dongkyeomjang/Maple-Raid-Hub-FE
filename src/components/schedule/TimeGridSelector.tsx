"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { format, addDays, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

interface TimeGridSelectorProps {
  selectedSlots: TimeSlot[];
  onSlotsChange: (slots: TimeSlot[]) => void;
  startHour?: number;
  endHour?: number;
  daysToShow?: number;
  disabled?: boolean;
}

export function TimeGridSelector({
  selectedSlots,
  onSlotsChange,
  startHour = 9,
  endHour = 24,
  daysToShow = 7,
  disabled = false,
}: TimeGridSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");
  const gridRef = useRef<HTMLDivElement>(null);
  const lastProcessedCell = useRef<string | null>(null);

  const today = startOfDay(new Date());
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(today, i));

  // 30분 단위 시간 생성
  const times: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    times.push(`${hour.toString().padStart(2, "0")}:00`);
    times.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  const isSelected = useCallback(
    (dateStr: string, time: string) => {
      return selectedSlots.some((slot) => slot.date === dateStr && slot.time === time);
    },
    [selectedSlots]
  );

  const isSelectedDate = useCallback(
    (date: Date, time: string) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return isSelected(dateStr, time);
    },
    [isSelected]
  );

  const toggleSlotByStr = useCallback(
    (dateStr: string, time: string, forceMode: "select" | "deselect") => {
      if (forceMode === "select") {
        if (!isSelected(dateStr, time)) {
          onSlotsChange([...selectedSlots, { date: dateStr, time }]);
        }
      } else {
        onSlotsChange(
          selectedSlots.filter((slot) => !(slot.date === dateStr && slot.time === time))
        );
      }
    },
    [selectedSlots, onSlotsChange, isSelected]
  );

  const handlePointerDown = (e: React.PointerEvent, date: Date, time: string) => {
    if (disabled) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const dateStr = format(date, "yyyy-MM-dd");
    const mode = isSelected(dateStr, time) ? "deselect" : "select";
    setIsDragging(true);
    setDragMode(mode);
    lastProcessedCell.current = `${dateStr}_${time}`;
    toggleSlotByStr(dateStr, time, mode);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled) return;

    // 현재 포인터 위치의 요소 찾기
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;

    const dateStr = element.getAttribute("data-date");
    const time = element.getAttribute("data-time");
    if (!dateStr || !time) return;

    const cellKey = `${dateStr}_${time}`;
    if (lastProcessedCell.current === cellKey) return;

    lastProcessedCell.current = cellKey;
    toggleSlotByStr(dateStr, time, dragMode);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    lastProcessedCell.current = null;
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setIsDragging(false);
      lastProcessedCell.current = null;
    };
    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => window.removeEventListener("pointerup", handleGlobalPointerUp);
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <div
        ref={gridRef}
        className="inline-block min-w-full select-none max-h-[450px] overflow-y-auto touch-none"
        onPointerMove={handlePointerMove}
      >
        {/* 헤더: 날짜 */}
        <div className="flex border-b sticky top-0 bg-background z-10">
          <div className="w-16 flex-shrink-0" /> {/* 시간 컬럼 공간 */}
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
                const dateStr = format(date, "yyyy-MM-dd");
                const selected = isSelectedDate(date, time);
                return (
                  <div
                    key={`${dateStr}-${time}`}
                    data-date={dateStr}
                    data-time={time}
                    className={cn(
                      "flex-1 min-w-[60px] h-6 border-l border-b cursor-pointer transition-colors",
                      selected ? "bg-primary" : "bg-muted/30 hover:bg-muted",
                      disabled && "cursor-not-allowed opacity-50",
                      time.endsWith(":00") && "border-t border-t-muted-foreground/20"
                    )}
                    onPointerDown={(e) => handlePointerDown(e, date, time)}
                    onPointerUp={handlePointerUp}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-end gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-muted/30 border rounded" />
          <span>불가능</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-primary rounded" />
          <span>가능</span>
        </div>
      </div>
    </div>
  );
}
