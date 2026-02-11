"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import { usePartyRoom } from "@/lib/hooks/use-party-rooms";
import { useAuth } from "@/lib/hooks/use-auth";
import { useBossNames } from "@/lib/hooks/use-boss-names";
import {
  ArrowLeft,
  Users,
  User,
  Crown,
} from "lucide-react";
import { ScheduleSection } from "@/components/schedule";

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { user } = useAuth();
  const { formatBossNames } = useBossNames();

  const { data: room, isLoading, error, refetch } = usePartyRoom(roomId);

  // Check if current user is leader
  const isLeader = room?.members?.some(
    (m) => m.userId === user?.id && m.isLeader
  ) || false;

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingPage message="파티방 정보를 불러오는 중..." />
      </PageContainer>
    );
  }

  if (error || !room) {
    return (
      <PageContainer>
        <ErrorState
          title="파티방을 찾을 수 없습니다"
          message={error?.message || "존재하지 않는 파티방입니다."}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  const displayName = room.bossIds?.length > 0 ? formatBossNames(room.bossIds) : "파티";

  return (
    <PageContainer>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/me">
            <ArrowLeft className="h-4 w-4 mr-2" />
            내 파티 목록
          </Link>
        </Button>
      </div>

      {/* Room Header */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{displayName}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={room.status === "ACTIVE" ? "success" : "secondary"}>
                  {room.status === "ACTIVE" ? "진행 중" : room.status === "COMPLETED" ? "완료" : "취소"}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{room.members?.length ?? 0}</span>
              </div>
              <span className="text-xs text-muted-foreground">파티원</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 파티원 목록 */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5" />
                파티원
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {room.members?.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {member.characterImageUrl ? (
                      <img
                        src={member.characterImageUrl}
                        alt={member.characterName || ""}
                        className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {member.characterName || "알 수 없음"}
                        {member.userId === user?.id && (
                          <span className="text-xs text-muted-foreground ml-1">(나)</span>
                        )}
                      </span>
                      {member.isLeader && (
                        <Badge variant="warning" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          파티장
                        </Badge>
                      )}
                    </div>
                    {member.worldName && (
                      <p className="text-xs text-muted-foreground">{member.worldName}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 일정 조율 (When2Meet 스타일) */}
        <div className="lg:col-span-2 space-y-6">
          <ScheduleSection
            partyRoomId={roomId}
            isLeader={isLeader}
            memberCount={room.members?.length || 0}
            scheduledTime={room.scheduledTime}
            scheduleConfirmed={room.scheduleConfirmed}
          />
        </div>
      </div>
    </PageContainer>
  );
}
