"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, Clock, Save, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeGridSelector, TimeSlot } from "./TimeGridSelector";
import { AvailabilityHeatmap, HeatmapSlot } from "./AvailabilityHeatmap";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

interface ScheduleSectionProps {
  partyRoomId: string;
  isLeader: boolean;
  memberCount: number;
  scheduledTime?: string | null;
  scheduleConfirmed?: boolean;
}

interface AvailabilityData {
  memberAvailabilities: Array<{
    id: string;
    partyRoomId: string;
    userId: string;
    userNickname: string;
    characterName: string;
    slots: Array<{ date: string; time: string }>;
    updatedAt: string;
  }>;
  heatmap: HeatmapSlot[];
  startDate: string;
  endDate: string;
}

export function ScheduleSection({
  partyRoomId,
  isLeader,
  memberCount,
  scheduledTime,
  scheduleConfirmed,
}: ScheduleSectionProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  // 확정된 시간이 있으면 전체 현황 탭이 기본
  const [activeTab, setActiveTab] = useState<"my" | "all">(scheduleConfirmed ? "all" : "my");
  const [hasChanges, setHasChanges] = useState(false);

  // 가용시간 데이터 조회
  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ["availability", partyRoomId],
    queryFn: async () => {
      const result = await api.availability.getAll(partyRoomId);
      if (result.success && result.data) {
        return result.data as AvailabilityData;
      }
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to fetch availability");
      }
      throw new Error("No data returned");
    },
    refetchInterval: 30000,
  });

  // 시간 형식 정규화 (HH:mm:ss -> HH:mm)
  const normalizeTime = (time: string): string => {
    return time.substring(0, 5);
  };

  // 내 가용시간으로 초기화
  useEffect(() => {
    if (availabilityData && user) {
      const myAvailability = availabilityData.memberAvailabilities.find(
        (a) => a.userId === user.id
      );
      if (myAvailability) {
        // 백엔드에서 오는 시간 형식을 HH:mm으로 정규화
        const normalizedSlots = myAvailability.slots.map((slot) => ({
          date: slot.date,
          time: normalizeTime(slot.time),
        }));
        setSelectedSlots(normalizedSlots);
        setHasChanges(false);
      }
    }
  }, [availabilityData, user]);

  // 가용시간 저장
  const { mutate: saveAvailability, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const result = await api.availability.save(partyRoomId, selectedSlots);
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to save availability");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability", partyRoomId] });
      setHasChanges(false);
      // 저장 후 전체 현황 탭으로 전환
      setActiveTab("all");
    },
  });

  // 일정 확정
  const { mutate: confirmSchedule, isPending: isConfirming } = useMutation({
    mutationFn: async ({ date, time }: { date: string; time: string }) => {
      const scheduledTime = new Date(`${date}T${time}:00`).toISOString();
      const result = await api.availability.confirmSchedule(partyRoomId, scheduledTime);
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to confirm schedule");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partyRoom", partyRoomId] });
      queryClient.invalidateQueries({ queryKey: ["partyRooms"] });
    },
  });

  const handleSlotsChange = (newSlots: TimeSlot[]) => {
    setSelectedSlots(newSlots);
    setHasChanges(true);
  };

  const handleConfirmTime = (date: string, time: string) => {
    const message = scheduleConfirmed
      ? `${date} ${time}로 일정을 변경하시겠습니까?`
      : `${date} ${time}로 일정을 확정하시겠습니까?`;
    if (confirm(message)) {
      confirmSchedule({ date, time });
    }
  };

  // 확정된 시간 파싱
  const confirmedTimeData = useMemo(() => {
    if (!scheduledTime || !scheduleConfirmed) return null;
    try {
      const dt = parseISO(scheduledTime);
      return {
        date: format(dt, "yyyy-MM-dd"),
        time: format(dt, "HH:mm"),
      };
    } catch {
      return null;
    }
  }, [scheduledTime, scheduleConfirmed]);

  // 확정된 일정 표시
  const confirmedTimeDisplay = useMemo(() => {
    if (!scheduledTime || !scheduleConfirmed) return null;
    try {
      const dt = parseISO(scheduledTime);
      return format(dt, "M월 d일 (E) HH:mm", { locale: ko });
    } catch {
      return null;
    }
  }, [scheduledTime, scheduleConfirmed]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          일정 조율
        </CardTitle>
        {confirmedTimeDisplay && (
          <div className="flex items-center gap-2 mt-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                확정된 일정
              </p>
              <p className="text-lg font-bold text-green-900 dark:text-green-100">
                {confirmedTimeDisplay}
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "my" | "all")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="my" className="gap-1.5">
              <Clock className="h-4 w-4" />
              내 가능시간
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-1.5">
              <Users className="h-4 w-4" />
              전체 현황
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              드래그하여 가능한 시간대를 선택하세요
            </p>

            <TimeGridSelector
              selectedSlots={selectedSlots}
              onSlotsChange={handleSlotsChange}
              startHour={9}
              endHour={24}
              disabled={isSaving}
            />

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                {selectedSlots.length}개 시간대 선택됨
              </p>
              <Button
                onClick={() => saveAvailability()}
                disabled={!hasChanges || isSaving}
                className="gap-1.5"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                파티원들의 가능한 시간을 확인하세요
              </p>
              <p className="text-sm font-medium">
                {availabilityData?.memberAvailabilities.length || 0}/{memberCount}명 응답
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <AvailabilityHeatmap
                heatmapData={availabilityData?.heatmap || []}
                totalMembers={memberCount}
                startHour={9}
                endHour={24}
                isLeader={isLeader}
                onConfirmTime={isLeader ? handleConfirmTime : undefined}
                confirmedTime={confirmedTimeData}
              />
            )}

            {/* 응답한 멤버 목록 */}
            {availabilityData && availabilityData.memberAvailabilities.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">응답 현황</p>
                <div className="flex flex-wrap gap-2">
                  {availabilityData.memberAvailabilities.map((a) => (
                    <span
                      key={a.userId}
                      className="px-2 py-1 bg-muted rounded text-xs"
                    >
                      {a.characterName} ({a.slots.length}개)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 파티장 가이드 문구 */}
            {isLeader && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {scheduleConfirmed
                    ? "시간을 변경하려면 위 히트맵에서 원하는 시간을 클릭하세요."
                    : "출발 시간을 확정하려면 위 히트맵에서 원하는 시간을 클릭하세요."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
