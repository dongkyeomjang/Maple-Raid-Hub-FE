"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MannerEvaluationModal } from "@/components/domain/MannerEvaluationModal";
import { usePartyRoom, useLeaveParty, useKickMember } from "@/lib/hooks/use-party-rooms";
import { useAuth } from "@/lib/hooks/use-auth";
import { useBossNames } from "@/lib/hooks/use-boss-names";
import {
  ArrowLeft,
  Users,
  User,
  Crown,
  Thermometer,
  LogOut,
  UserX,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { ScheduleSection } from "@/components/schedule";
import { useRouter } from "next/navigation";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const { user } = useAuth();
  const { formatBossNames } = useBossNames();

  const { data: room, isLoading, error, refetch } = usePartyRoom(roomId);
  const leaveMutation = useLeaveParty();
  const kickMutation = useKickMember();

  const [mannerModal, setMannerModal] = useState<{
    isOpen: boolean;
    targetUserId: string | null;
    targetName: string;
  }>({ isOpen: false, targetUserId: null, targetName: "" });

  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [kickTarget, setKickTarget] = useState<{
    userId: string;
    name: string;
  } | null>(null);

  // Check if current user is leader
  const isLeader = room?.members?.some(
    (m) => m.userId === user?.id && m.isLeader
  ) || false;

  const handleLeave = async () => {
    await leaveMutation.mutateAsync(roomId);
    setLeaveDialogOpen(false);
    router.push("/me");
  };

  const handleKick = async () => {
    if (!kickTarget) return;
    await kickMutation.mutateAsync({ roomId, memberId: kickTarget.userId });
    setKickTarget(null);
    refetch();
  };

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
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {member.userId !== user?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="매너 평가"
                        onClick={() =>
                          setMannerModal({
                            isOpen: true,
                            targetUserId: member.userId,
                            targetName: member.characterName || "알 수 없음",
                          })
                        }
                      >
                        <Thermometer className="h-4 w-4" />
                      </Button>
                    )}
                    {/* 파티장이 다른 멤버를 추방 */}
                    {isLeader && member.userId !== user?.id && room.status === "ACTIVE" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="추방"
                        onClick={() =>
                          setKickTarget({
                            userId: member.userId,
                            name: member.characterName || "알 수 없음",
                          })
                        }
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* 탈퇴한 멤버 (매너 평가용) */}
              {room.leftMembers && room.leftMembers.length > 0 && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs text-muted-foreground mb-2">파티 탈퇴</p>
                  </div>
                  {room.leftMembers.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 opacity-60"
                    >
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {member.characterImageUrl ? (
                          <img
                            src={member.characterImageUrl}
                            alt={member.characterName || ""}
                            className="w-full h-full object-cover scale-[2.5] object-[45%_35%] grayscale"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate text-muted-foreground">
                            {member.characterName || "알 수 없음"}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            탈퇴
                          </Badge>
                        </div>
                      </div>
                      {member.userId !== user?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          title="매너 평가"
                          onClick={() =>
                            setMannerModal({
                              isOpen: true,
                              targetUserId: member.userId,
                              targetName: member.characterName || "알 수 없음",
                            })
                          }
                        >
                          <Thermometer className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* 탈퇴 버튼 (파티장이 아닌 경우만) */}
              {!isLeader && room.status === "ACTIVE" && (
                <div className="pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setLeaveDialogOpen(true)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    파티 탈퇴
                  </Button>
                </div>
              )}
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

      <MannerEvaluationModal
        isOpen={mannerModal.isOpen}
        onClose={() => setMannerModal((prev) => ({ ...prev, isOpen: false }))}
        targetUserId={mannerModal.targetUserId}
        targetName={mannerModal.targetName}
        context="PARTY_PAGE"
      />

      {/* 파티 탈퇴 확인 다이얼로그 */}
      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              파티 탈퇴
            </DialogTitle>
            <DialogDescription className="pt-2">
              정말 파티를 탈퇴하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
              <p className="text-sm font-medium text-destructive">탈퇴 시 다음과 같이 처리됩니다:</p>
              <ul className="text-sm text-destructive/80 space-y-1 ml-4 list-disc">
                <li>채팅방에서 나가집니다</li>
                <li>등록한 가능 시간이 삭제됩니다</li>
                <li>확정된 일정이 있다면 해제됩니다</li>
                <li>기존 파티원의 매너 평가 대상에는 남습니다</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaveDialogOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeave}
              disabled={leaveMutation.isPending}
            >
              {leaveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  탈퇴 중...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  파티 탈퇴
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 추방 확인 다이얼로그 */}
      <Dialog open={!!kickTarget} onOpenChange={(open) => !open && setKickTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              파티원 추방
            </DialogTitle>
            <DialogDescription className="pt-2">
              <span className="font-medium">{kickTarget?.name}</span>님을 추방하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
              <p className="text-sm font-medium text-destructive">추방 시 다음과 같이 처리됩니다:</p>
              <ul className="text-sm text-destructive/80 space-y-1 ml-4 list-disc">
                <li>해당 멤버가 채팅방에서 나가집니다</li>
                <li>해당 멤버의 가능 시간이 삭제됩니다</li>
                <li>확정된 일정이 있다면 해제됩니다</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKickTarget(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleKick}
              disabled={kickMutation.isPending}
            >
              {kickMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  추방 중...
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  추방
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
