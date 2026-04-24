"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BossMultiSelector } from "@/components/domain/BossMultiSelector";
import { apiClient } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WorldGroupBadge } from "@/components/domain/WorldGroupBadge";
import { CharacterDetailDialog } from "@/components/domain/CharacterDetailDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import { usePost, useApplyToPost, useClosePost, useCancelPost, useWithdrawApplication, usePostUpdates, useGuestCharacterInfo } from "@/lib/hooks/use-posts";
import { useCharacters } from "@/lib/hooks/use-characters";
import { useBossNames } from "@/lib/hooks/use-boss-names";
import { useAuth } from "@/lib/hooks/use-auth";
import { useChatStore } from "@/lib/stores/chat-store";
import {
  ArrowLeft,
  Calendar,
  Users,
  Loader2,
  Send,
  Crown,
  Settings,
  XCircle,
  CheckCircle,
  Clock,
  UserPlus,
  User,
  Swords,
  MessageCircle,
  Pencil,
  Trash2,
  AlertTriangle,
  Gem,
  UserCircle2,
  ExternalLink,
  KeyRound,
  Lock,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatMeso, formatNumber } from "@/lib/utils";
import { TemperatureWithTags } from "@/components/domain/TemperatureWithTags";
import { ServerLogo } from "@/components/domain/ServerLogo";
import type { PostResponse, PublicCharacterResponse } from "@/types/api";

function renderLinkedText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-primary break-all"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

interface SelectedMemberInfo {
  character: PublicCharacterResponse;
  ownerUserId?: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const { data: postDetail, isLoading, error, refetch } = usePost(postId);
  const { formatBossNames, getCrystalInfo } = useBossNames();
  const { user } = useAuth();
  const { data: charactersData } = useCharacters({ enabled: !!user });
  const applyMutation = useApplyToPost();
  const closeMutation = useClosePost();
  const cancelMutation = useCancelPost();
  const withdrawMutation = useWithdrawApplication();

  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [applyMessage, setApplyMessage] = useState("");
  const [selectedMemberInfo, setSelectedMemberInfo] = useState<SelectedMemberInfo | null>(null);
  const [dmCharacterSelectOpen, setDmCharacterSelectOpen] = useState(false);
  const [selectedDmCharacterId, setSelectedDmCharacterId] = useState("");

  const setDraftDm = useChatStore((s) => s.setDraftDm);

  // 실시간 지원 상태 변경 구독
  usePostUpdates(postId);

  const post = postDetail?.post;
  const applications = postDetail?.applications ?? [];
  const authorCharacter = postDetail?.authorCharacter;

  const isGuestPost = !!post?.guest;

  // 비회원 글: 캐릭터 상세(전투력/장비 등)는 저장하지 않고 매 조회마다 Nexon API 재조회
  const { data: guestCharacterInfo } = useGuestCharacterInfo(postId, isGuestPost);

  // 비회원 글이면 기본 authorCharacter 뼈대에 실시간 조회 값을 덮어씌움
  const enrichedAuthorCharacter = useMemo(() => {
    if (!authorCharacter) return null;
    if (!isGuestPost || !guestCharacterInfo) return authorCharacter;
    return {
      ...authorCharacter,
      characterName: guestCharacterInfo.characterName ?? authorCharacter.characterName,
      worldName: guestCharacterInfo.worldName ?? authorCharacter.worldName,
      characterClass: guestCharacterInfo.characterClass ?? authorCharacter.characterClass,
      characterLevel: guestCharacterInfo.characterLevel ?? authorCharacter.characterLevel,
      characterImageUrl: guestCharacterInfo.characterImageUrl ?? authorCharacter.characterImageUrl,
      combatPower: guestCharacterInfo.combatPower ?? authorCharacter.combatPower,
      equipmentJson: guestCharacterInfo.equipmentJson ?? authorCharacter.equipmentJson,
    };
  }, [authorCharacter, isGuestPost, guestCharacterInfo]);

  // 작성자 여부 확인 (비회원 글은 작성자가 없음)
  const isOwner = !isGuestPost && !!user?.id && user.id === post?.authorId;

  // 현재 사용자의 활성 지원 상태 확인
  const myApplication = applications.find(
    (a) => a.applicantId === user?.id && (a.status === "APPLIED" || a.status === "ACCEPTED")
  );
  const wasRejected = !myApplication && applications.some(
    (a) => a.applicantId === user?.id && a.status === "REJECTED"
  );

  // Filter characters that can apply (verified, same world group)
  const eligibleCharacters =
    charactersData?.filter(
      (c) =>
        c.verificationStatus === "VERIFIED_OWNER" && c.worldGroup === post?.worldGroup
    ) || [];

  // 유저가 인증된 캐릭터를 하나라도 소유하고 있는지 확인
  const hasVerifiedCharacter = charactersData?.some(
    (c) => c.verificationStatus === "VERIFIED_OWNER"
  ) ?? false;

  const handleApply = async () => {
    if (!selectedCharacterId) return;

    await applyMutation.mutateAsync({
      postId,
      data: {
        characterId: selectedCharacterId,
        message: applyMessage || null,
      },
    });

    setApplyDialogOpen(false);
    setSelectedCharacterId("");
    setApplyMessage("");
    refetch();
  };

  const handleClosePost = async () => {
    const currentCount = post?.currentMembers ?? 1;
    if (confirm(`현재 ${currentCount}명으로 파티를 결성하시겠습니까?\n\n• 파티룸이 생성됩니다\n• 대기 중인 지원자는 자동으로 거절됩니다\n• 이 모집글은 마이페이지에서 사라집니다`)) {
      await closeMutation.mutateAsync(postId);
      refetch();
    }
  };

  const handleCancelPost = async () => {
    await cancelMutation.mutateAsync(postId);
    router.push("/posts");
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingPage message="모집글을 불러오는 중..." />
      </PageContainer>
    );
  }

  if (error || !post) {
    return (
      <PageContainer>
        <ErrorState
          title="모집글을 찾을 수 없습니다"
          message={error?.message || "존재하지 않는 모집글입니다."}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "warning" }> = {
    RECRUITING: { label: "모집 중", variant: "success" },
    CLOSED: { label: "마감", variant: "secondary" },
    CANCELED: { label: "취소", variant: "warning" },
    EXPIRED: { label: "만료", variant: "destructive" },
  };

  const statusConfig = statusLabels[post.status] || statusLabels.RECRUITING;
  const bossIds = post.bossIds ?? [];
  const displayName = formatBossNames(bossIds);
  const crystalInfo = getCrystalInfo(bossIds, post.requiredMembers);
  const canApply = post.status === "RECRUITING" && post.currentMembers < post.requiredMembers;

  // 지원자 통계
  const pendingApplications = applications.filter((a) => a.status === "APPLIED");
  const acceptedApplications = applications.filter((a) => a.status === "ACCEPTED");

  return (
    <PageContainer>
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // 모집글 작성/수정 직후(회원/비회원) 진입한 경우에만 목록으로 복귀. 그 외는 기존 뒤로가기 동작 유지
            if (typeof window !== "undefined") {
              const returnToListId = sessionStorage.getItem("postReturnToListId");
              if (returnToListId && returnToListId === postId) {
                sessionStorage.removeItem("postReturnToListId");
                router.push("/posts");
                return;
              }
            }
            router.back();
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로가기
        </Button>
        <div className="flex items-center gap-2">
          {isGuestPost && (
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
            >
              <UserCircle2 className="h-3 w-3 mr-1" />
              비회원 작성
            </Badge>
          )}
          {isOwner && (
            <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
              <Crown className="h-3 w-3 mr-1" />
              내 모집글
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {displayName}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <WorldGroupBadge worldGroup={post.worldGroup} />
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    {post.currentMembers}/{post.requiredMembers}
                  </div>
                  <p className="text-sm text-muted-foreground">파티원</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">
                  {post.preferredTime ? post.preferredTime.split("T")[0] : "상의 후 결정"}
                </span>
              </div>

              {crystalInfo.totalCrystal > 0 && (
                <div className="flex items-center gap-2">
                  <Gem className="h-5 w-5 text-violet-500" />
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-medium text-violet-600 dark:text-violet-400 cursor-help">
                          1인당 {formatMeso(crystalInfo.perPerson)} 메소
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[280px]">
                        <div className="space-y-1.5 py-1">
                          <p className="text-xs font-semibold">결정석 계산</p>
                          {crystalInfo.breakdown.map((b, i) => (
                            <div key={i} className="flex justify-between gap-6 text-xs">
                              <span className="text-muted-foreground">{b.name}</span>
                              <span className="tabular-nums">{formatNumber(b.price)}</span>
                            </div>
                          ))}
                          {crystalInfo.breakdown.length > 1 && (
                            <div className="flex justify-between gap-6 text-xs border-t pt-1">
                              <span className="text-muted-foreground">합계</span>
                              <span className="tabular-nums font-medium">{formatNumber(crystalInfo.totalCrystal)}</span>
                            </div>
                          )}
                          <div className="flex justify-between gap-6 text-xs border-t pt-1">
                            <span className="text-muted-foreground">{formatNumber(crystalInfo.totalCrystal)} / {post.requiredMembers}명</span>
                            <span className="tabular-nums font-semibold text-violet-600 dark:text-violet-400">{formatNumber(crystalInfo.perPerson)}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-sm text-muted-foreground">
                    (합계 {formatMeso(crystalInfo.totalCrystal)})
                  </span>
                </div>
              )}

              {post.status === "RECRUITING" && post.createdAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(new Date(post.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("ko-KR")} 자동 마감
                  </span>
                </div>
              )}

              {post.description && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">설명</h4>
                  <p className="text-sm whitespace-pre-line">{renderLinkedText(post.description)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 파티장 정보 */}
          {enrichedAuthorCharacter && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  {isGuestPost ? "작성자 캐릭터 (비회원)" : "파티장"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CharacterInfoCard
                  character={enrichedAuthorCharacter}
                  ownerUserId={post.authorId ?? undefined}
                  onClick={() => setSelectedMemberInfo({
                    character: enrichedAuthorCharacter,
                    ownerUserId: post.authorId ?? undefined,
                  })}
                />
                {/* 회원 글 + 비작성자 + 로그인 + 인증된 캐릭터 소유자만 DM 버튼 표시 */}
                {!isGuestPost && !isOwner && user && hasVerifiedCharacter && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setDmCharacterSelectOpen(true)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    파티장에게 문의하기
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* 현재 파티원 (수락된 지원자) */}
          {!isGuestPost && acceptedApplications.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  파티원 ({acceptedApplications.length}명)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {acceptedApplications.map((app) => (
                    app.character && (
                      <CharacterInfoCard
                        key={app.id}
                        character={app.character}
                        ownerUserId={app.applicantId}
                        onClick={() => setSelectedMemberInfo({ character: app.character!, ownerUserId: app.applicantId })}
                      />
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - 비회원 글 / 작성자 / 비작성자에 따라 다른 UI */}
        <div className="space-y-4">
          {isGuestPost ? (
            <>
              <GuestContactCard contactLink={post.contactLink} />
              <GuestOwnerPanel post={post} onChanged={() => refetch()} />
            </>
          ) : isOwner ? (
            /* 작성자용 관리 패널 */
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    모집글 관리
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href={`/posts/${postId}/manage`}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      지원자 관리
                      {pendingApplications.length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {pendingApplications.length}
                        </Badge>
                      )}
                    </Link>
                  </Button>

                  {post.status === "RECRUITING" && (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/posts/${postId}/edit`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          모집글 수정
                        </Link>
                      </Button>
                      <div className="space-y-1">
                        <Button
                          variant="outline"
                          className="w-full border-green-500/50 text-green-600 hover:bg-green-50 hover:text-green-700 disabled:border-muted disabled:text-muted-foreground disabled:hover:bg-transparent"
                          onClick={handleClosePost}
                          disabled={closeMutation.isPending || post.currentMembers < 2}
                        >
                          {closeMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          현재 인원으로 파티 결성
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          {post.currentMembers < 2
                            ? "파티원이 1명 이상 필요합니다"
                            : `${post.currentMembers}명으로 파티를 시작합니다`}
                        </p>
                      </div>
                      {(!post.partyRoomId || post.currentMembers <= 1) && (
                        <div className="space-y-1 pt-2 border-t">
                          <Button
                            variant="ghost"
                            className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setCancelDialogOpen(true)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            모집 취소
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">
                            모집글을 삭제합니다
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 지원자 현황 요약 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">지원 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">대기 중</span>
                      </div>
                      <Badge variant="warning">{pendingApplications.length}명</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">수락됨</span>
                      </div>
                      <Badge variant="success">{acceptedApplications.length}명</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* 비작성자용 지원 패널 */
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {myApplication ? "지원 현황" : "지원하기"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {myApplication?.status === "APPLIED" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">지원이 완료되었습니다</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">파티장의 수락을 기다리고 있습니다.</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      disabled={withdrawMutation.isPending}
                      onClick={async () => {
                        if (confirm("지원을 취소하시겠습니까?")) {
                          await withdrawMutation.mutateAsync({
                            postId,
                            applicationId: myApplication.id,
                          });
                          refetch();
                        }
                      }}
                    >
                      {withdrawMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      지원 취소
                    </Button>
                  </div>
                ) : myApplication?.status === "ACCEPTED" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">지원이 수락되었습니다</p>
                        <p className="text-xs text-green-600 dark:text-green-400">파티에 합류하게 됩니다.</p>
                      </div>
                    </div>
                  </div>
                ) : !canApply ? (
                  <p className="text-sm text-muted-foreground">
                    현재 지원을 받지 않는 모집글입니다.
                  </p>
                ) : eligibleCharacters.length === 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      지원 가능한 캐릭터가 없습니다.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      같은 월드 그룹의 인증된 캐릭터가 필요합니다.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/characters">캐릭터 관리</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {wasRejected && (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                        <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">이전 지원이 거절되었습니다. 다시 지원할 수 있습니다.</p>
                      </div>
                    )}
                    <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          {wasRejected ? "다시 지원하기" : "지원하기"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>파티 지원</DialogTitle>
                          <DialogDescription>
                            {displayName} 파티에 지원합니다.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>캐릭터</Label>
                            <Select
                              value={selectedCharacterId}
                              onValueChange={setSelectedCharacterId}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="캐릭터 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                {eligibleCharacters.map((char) => (
                                  <SelectItem key={char.id} value={char.id}>
                                    {char.characterName} (Lv.{char.characterLevel})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>메시지 (선택사항)</Label>
                            <Textarea
                              value={applyMessage}
                              onChange={(e) => setApplyMessage(e.target.value)}
                              placeholder="파티장에게 전할 메시지"
                              rows={3}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setApplyDialogOpen(false)}
                          >
                            취소
                          </Button>
                          <Button
                            onClick={handleApply}
                            disabled={
                              !selectedCharacterId ||
                              applyMutation.isPending
                            }
                          >
                            {applyMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                지원 중...
                              </>
                            ) : (
                              "지원하기"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 캐릭터 상세 정보 모달 */}
      <CharacterDetailDialog
        character={selectedMemberInfo?.character ?? null}
        open={!!selectedMemberInfo}
        onOpenChange={(open) => !open && setSelectedMemberInfo(null)}
        ownerUserId={selectedMemberInfo?.ownerUserId}
      />

      {/* 모집 취소 확인 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              모집글 삭제
            </DialogTitle>
            <DialogDescription className="pt-2">
              이 모집글을 완전히 삭제합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
              <p className="text-sm font-medium text-destructive">
                삭제하면 다음과 같이 처리됩니다:
              </p>
              <ul className="text-sm text-destructive/80 space-y-1 ml-4 list-disc">
                <li>모집글이 영구적으로 삭제됩니다</li>
                <li>대기 중인 모든 지원이 취소됩니다</li>
                <li>파티가 결성되지 않습니다</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              파티를 구성하려면 "현재 인원으로 파티 결성"을 사용하세요.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              돌아가기
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelPost}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  삭제 중...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  모집글 삭제
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DM 캐릭터 선택 다이얼로그 */}
      <Dialog open={dmCharacterSelectOpen} onOpenChange={setDmCharacterSelectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>문의 보내기</DialogTitle>
            <DialogDescription>
              어떤 캐릭터로 {authorCharacter?.characterName}님에게 문의할까요?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {charactersData
              ?.filter((c) => c.verificationStatus === "VERIFIED_OWNER")
              .map((char) => (
                <button
                  key={char.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    selectedDmCharacterId === char.id
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedDmCharacterId(char.id)}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {char.characterImageUrl ? (
                      <img
                        src={char.characterImageUrl}
                        alt={char.characterName}
                        className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{char.characterName}</div>
                    <div className="text-sm text-muted-foreground">
                      Lv.{char.characterLevel} {char.characterClass}
                    </div>
                  </div>
                  {selectedDmCharacterId === char.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDmCharacterSelectOpen(false);
                setSelectedDmCharacterId("");
              }}
            >
              취소
            </Button>
            <Button
              disabled={!selectedDmCharacterId}
              onClick={() => {
                const selectedChar = charactersData?.find(
                  (c) => c.id === selectedDmCharacterId
                );
                if (selectedChar && post && !isGuestPost && post.authorId && authorCharacter && authorCharacter.id) {
                  setDraftDm({
                    targetUserId: post.authorId,
                    targetName: authorCharacter.characterName,
                    targetCharacterId: authorCharacter.id,
                    targetCharacterImageUrl: authorCharacter.characterImageUrl,
                    postId: postId,
                    senderCharacterId: selectedChar.id,
                    senderCharacterName: selectedChar.characterName,
                    senderCharacterImageUrl: selectedChar.characterImageUrl,
                  });
                  setDmCharacterSelectOpen(false);
                  setSelectedDmCharacterId("");
                }
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              문의하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

function GuestOwnerPanel({ post, onChanged }: { post: PostResponse; onChanged: () => void }) {
  const router = useRouter();
  const storageKey = `guestPostPassword-${post.id}`;

  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 수정 폼 상태
  const [editBossIds, setEditBossIds] = useState<string[]>([]);
  const [editRequiredMembers, setEditRequiredMembers] = useState(2);
  const [editScheduledAt, setEditScheduledAt] = useState("");
  const [editScheduleTbd, setEditScheduleTbd] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const isEditable = post.status === "RECRUITING";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(storageKey);
    if (stored) setAuthenticated(true);
  }, [storageKey]);

  const getPassword = () => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(storageKey) ?? "";
  };

  const handleVerify = async () => {
    if (!passwordInput) {
      setVerifyError("비밀번호를 입력해주세요.");
      return;
    }
    setVerifyLoading(true);
    setVerifyError(null);
    try {
      const result = await apiClient.posts.verifyGuestPassword(post.id, passwordInput);
      if (!result.success) {
        setVerifyError(result.error.message || "비밀번호가 일치하지 않습니다.");
        return;
      }
      sessionStorage.setItem(storageKey, passwordInput);
      setAuthenticated(true);
      setVerifyOpen(false);
      setPasswordInput("");
    } catch {
      setVerifyError("비밀번호 검증에 실패했습니다.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const openEdit = () => {
    setEditBossIds(post.bossIds ?? []);
    setEditRequiredMembers(post.requiredMembers);
    if (post.preferredTime) {
      setEditScheduledAt(post.preferredTime.split("T")[0]);
      setEditScheduleTbd(false);
    } else {
      setEditScheduledAt("");
      setEditScheduleTbd(true);
    }
    setEditDescription(post.description ?? "");
    setEditError(null);
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (editBossIds.length === 0) {
      setEditError("최소 1개 이상의 보스를 선택해주세요.");
      return;
    }
    if (!editScheduleTbd && !editScheduledAt) {
      setEditError("예정 날짜를 입력하거나 '상의 후 결정'을 선택해주세요.");
      return;
    }
    setActionLoading(true);
    setEditError(null);
    try {
      const result = await apiClient.posts.update(post.id, {
        bossIds: editBossIds,
        requiredMembers: editRequiredMembers,
        preferredTime: editScheduleTbd ? undefined : new Date(editScheduledAt).toISOString(),
        clearPreferredTime: editScheduleTbd,
        description: editDescription || undefined,
        clearDescription: !editDescription,
        guestPassword: getPassword(),
      });
      if (!result.success) {
        setEditError(result.error.message || "수정에 실패했습니다.");
        return;
      }
      // 수정 직후 뒤로가기 시 목록으로 돌아가도록 플래그 저장
      if (typeof window !== "undefined") {
        sessionStorage.setItem("postReturnToListId", post.id);
      }
      setEditOpen(false);
      onChanged();
    } catch {
      setEditError("수정에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const result = await apiClient.posts.deleteGuest(post.id, getPassword());
      if (!result.success) {
        alert(result.error.message || "모집 종료에 실패했습니다.");
        return;
      }
      sessionStorage.removeItem(storageKey);
      router.push("/posts");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-amber-600" />
          작성자 메뉴
        </CardTitle>
        <CardDescription>
          비밀번호 인증 후 수정ㆍ모집 종료를 할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {!authenticated ? (
          <>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setVerifyOpen(true)}
              disabled={!isEditable}
            >
              <Lock className="h-4 w-4 mr-2" />
              {isEditable ? "비밀번호 입력하고 관리하기" : "모집이 종료된 글입니다"}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-md">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-xs text-emerald-800 dark:text-emerald-300">작성자 인증 완료</span>
            </div>
            {isEditable && (
              <>
                <Button className="w-full" variant="outline" onClick={openEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  모집글 수정
                </Button>
                <Button
                  className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  variant="ghost"
                  onClick={() => setCancelOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  모집 종료
                </Button>
              </>
            )}
            <Button
              className="w-full text-muted-foreground"
              variant="ghost"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem(storageKey);
                setAuthenticated(false);
              }}
            >
              인증 해제
            </Button>
          </>
        )}
      </CardContent>

      {/* 비밀번호 검증 다이얼로그 */}
      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>작성자 비밀번호 입력</DialogTitle>
            <DialogDescription>작성 시 설정한 비밀번호를 입력해주세요.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify();
              }}
            />
            {verifyError && (
              <p className="text-sm text-destructive mt-2">{verifyError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyOpen(false)}>
              취소
            </Button>
            <Button onClick={handleVerify} disabled={verifyLoading}>
              {verifyLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수정 다이얼로그 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>모집글 수정</DialogTitle>
            <DialogDescription>비회원 모집글의 내용을 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>보스 선택</Label>
              <BossMultiSelector value={editBossIds} onChange={setEditBossIds} />
            </div>
            <div className="space-y-2">
              <Label>모집 인원</Label>
              <Select
                value={editRequiredMembers.toString()}
                onValueChange={(v) => setEditRequiredMembers(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}명
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>예정 날짜</Label>
              <div className="flex items-center space-x-2 mb-1">
                <Checkbox
                  id="editScheduleTbd"
                  checked={editScheduleTbd}
                  onCheckedChange={(checked) => {
                    setEditScheduleTbd(checked === true);
                    if (checked) setEditScheduledAt("");
                  }}
                />
                <label htmlFor="editScheduleTbd" className="text-sm font-medium">
                  상의 후 결정
                </label>
              </div>
              {!editScheduleTbd && (
                <Input
                  type="date"
                  value={editScheduledAt}
                  onChange={(e) => setEditScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>메모</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
            {editError && <p className="text-sm text-destructive">{editError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditSubmit} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              수정하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 모집 종료 확인 */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              모집 종료
            </DialogTitle>
            <DialogDescription className="pt-2">
              이 모집글을 종료합니다. 종료 후에는 목록에서 보이지 않으며 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              모집 종료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function GuestContactCard({ contactLink }: { contactLink: string | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-amber-600" />
          비회원 모집글
        </CardTitle>
        <CardDescription>
          이 모집글은 비회원이 작성했습니다. 지원 기능을 사용할 수 없으니 아래 연락수단으로 직접 연락해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>연락수단</Label>
          <div className="p-3 bg-muted/50 rounded-lg text-sm break-all">
            {renderContactLink(contactLink)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function renderContactLink(contactLink: string | null) {
  if (!contactLink) {
    return <span className="text-muted-foreground">연락수단이 입력되지 않았습니다.</span>;
  }
  const trimmed = contactLink.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return (
      <a
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-primary underline font-medium"
      >
        {trimmed}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }
  return <span className="whitespace-pre-line">{trimmed}</span>;
}

function CharacterInfoCard({
  character,
  ownerUserId,
  onClick,
}: {
  character: PublicCharacterResponse;
  ownerUserId?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
      onClick={onClick}
    >
      <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
        {character.characterImageUrl ? (
          <img
            src={character.characterImageUrl}
            alt={character.characterName}
            className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{character.characterName}</span>
          {character.ownerTemperature != null && ownerUserId && (
            <div onClick={(e) => e.stopPropagation()}>
              <TemperatureWithTags
                temperature={character.ownerTemperature}
                userId={ownerUserId}
                size="sm"
              />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Lv.{character.characterLevel} {character.characterClass}
          {character.worldName && <span className="inline-flex items-center gap-0.5"> · <ServerLogo serverName={character.worldName} size="xs" /> {character.worldName}</span>}
        </p>
        {character.combatPower > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Swords className="h-3 w-3 text-orange-500" />
            <span className="text-orange-600 font-medium">{character.combatPower.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

