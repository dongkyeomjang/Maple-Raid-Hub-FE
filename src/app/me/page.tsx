"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TemperatureBadge } from "@/components/domain/TemperatureBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePartyRooms } from "@/lib/hooks/use-party-rooms";
import { useMyApplications, useMyPosts, useWithdrawApplication } from "@/lib/hooks/use-posts";
import { useMyEvaluations } from "@/lib/hooks/use-manner";
import { useBossNames } from "@/lib/hooks/use-boss-names";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { useDiscordStatus } from "@/lib/hooks/use-discord";
import { User, Calendar, Users, MessageSquare, Clock, Swords, Crown, Settings, CheckCircle, Bell, Link2, XCircle, Loader2, Thermometer } from "lucide-react";

const VALID_TABS = ["parties", "applications", "posts", "evaluations"];

export default function MyPage() {
  return (
    <Suspense fallback={<PageContainer><LoadingPage message="로딩 중..." /></PageContainer>}>
      <MyPageContent />
    </Suspense>
  );
}

function MyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab = VALID_TABS.includes(tabParam ?? "") ? tabParam! : "parties";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`/me?${params.toString()}`, { scroll: false });
  };

  const { user, isLoading: authLoading } = useAuth();
  const { data: partyRooms, isLoading: roomsLoading, error: roomsError } = usePartyRooms();
  const { data: applications, isLoading: appsLoading } = useMyApplications();
  const { data: myPosts, isLoading: postsLoading } = useMyPosts();
  const { formatBossNames } = useBossNames();
  const { data: discordStatus } = useDiscordStatus();
  const { data: evaluations, isLoading: evalLoading } = useMyEvaluations();
  const withdrawMutation = useWithdrawApplication();

  if (authLoading) {
    return (
      <PageContainer>
        <LoadingPage message="로딩 중..." />
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <ErrorState
          title="로그인이 필요합니다"
          message="마이페이지를 이용하려면 로그인해주세요."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="마이페이지" />

      {/* User Profile Card */}
      <Card className="mb-6 border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20 border-4 border-muted shadow-lg">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {user.nickname?.slice(0, 2) || <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-h2 font-bold">{user.nickname}</h2>
              </div>
              <p className="text-body-sm text-muted-foreground">{user.username}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                <TemperatureBadge temperature={user.temperature} showLabel decimals={2} />
                <span className="text-tiny text-muted-foreground">
                  가입일: {formatRelativeTime(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discord Notification Banner */}
      {user && (
        <Link href="/me/settings">
          {(discordStatus?.linked ?? user.discordLinked) ? (
            <Card className="mb-6 border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900">
                      <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">디스코드 알림 설정</p>
                      <p className="text-xs text-muted-foreground">
                        {discordStatus?.discordUsername ?? user.discordUsername} 연동됨 · 알림 설정 관리하기
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" className="flex-shrink-0">연동됨</Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900">
                      <Link2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">디스코드를 연동해보세요</p>
                      <p className="text-xs text-muted-foreground">
                        모집 신청, DM 등의 알림을 디스코드로 받을 수 있어요
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning" className="flex-shrink-0">미연동</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </Link>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4 w-full grid grid-cols-4">
          <TabsTrigger value="parties" className="gap-1.5 text-xs sm:text-sm sm:gap-2">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">내 파티</span>
            <span className="sm:hidden">파티</span>
            ({partyRooms?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-1.5 text-xs sm:text-sm sm:gap-2">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">지원 현황</span>
            <span className="sm:hidden">지원</span>
            ({applications?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-1.5 text-xs sm:text-sm sm:gap-2">
            <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">내 모집글</span>
            <span className="sm:hidden">모집</span>
            ({myPosts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="gap-1.5 text-xs sm:text-sm sm:gap-2">
            <Thermometer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">받은 평가</span>
            <span className="sm:hidden">평가</span>
            ({evaluations?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* My Posts */}
        <TabsContent value="posts">
          {postsLoading ? (
            <LoadingPage message="모집글 목록을 불러오는 중..." />
          ) : !myPosts?.length ? (
            <EmptyState
              icon={<Crown className="h-8 w-8 text-muted-foreground" />}
              title="작성한 모집글이 없습니다"
              description="새로운 파티를 모집해보세요."
              action={{
                label: "모집글 작성",
                onClick: () => { window.location.href = "/posts/new"; },
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {formatBossNames(post.bossIds ?? [])}
                      </CardTitle>
                      <PostStatusBadge status={post.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {post.preferredTime ? post.preferredTime.split("T")[0] : "날짜 미정"}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {post.currentMembers}/{post.requiredMembers} 파티원
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/posts/${post.id}`}>
                          상세 보기
                        </Link>
                      </Button>
                      {post.status === "RECRUITING" && (
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/posts/${post.id}/manage`}>
                            <Settings className="h-4 w-4 mr-1" />
                            관리
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Parties */}
        <TabsContent value="parties">
          {roomsLoading ? (
            <LoadingPage message="파티 목록을 불러오는 중..." />
          ) : roomsError ? (
            <ErrorState title="파티 목록을 불러올 수 없습니다" />
          ) : !partyRooms?.length ? (
            <EmptyState
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              title="참여 중인 파티가 없습니다"
              description="모집글에 지원하거나 새로운 파티를 모집해보세요."
              action={{
                label: "모집글 보기",
                onClick: () => {},
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partyRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {room.bossIds?.length > 0 ? formatBossNames(room.bossIds) : "파티"}
                      </CardTitle>
                      <PartyStatusBadge status={room.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 flex flex-col flex-1">
                    {room.scheduleConfirmed && room.scheduledTime ? (
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800 min-h-[52px]">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-green-700 dark:text-green-300 font-medium">확정된 출발 시간</p>
                          <p className="text-sm font-bold text-green-800 dark:text-green-200 truncate">
                            {formatDateTime(room.scheduledTime)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border border-border min-h-[52px]">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">시간 미정</span>
                      </div>
                    )}

                    {/* 파티원 목록 */}
                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs text-muted-foreground font-medium">파티원 ({room.members?.length ?? 0})</p>
                      <div className="flex flex-wrap gap-2">
                        {room.members?.map((member) => (
                          <div
                            key={member.userId}
                            className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-lg"
                          >
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                              {member.characterImageUrl ? (
                                <img
                                  src={member.characterImageUrl}
                                  alt={member.characterName || ""}
                                  className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-medium truncate max-w-[80px]">
                                {member.characterName || "알 수 없음"}
                              </span>
                              {member.worldName && (
                                <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">{member.worldName}</span>
                              )}
                            </div>
                            {member.isLeader && (
                              <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full mt-auto" asChild>
                      <Link href={`/chat/${room.id}`}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        파티방 입장
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Applications */}
        <TabsContent value="applications">
          {appsLoading ? (
            <LoadingPage message="지원 현황을 불러오는 중..." />
          ) : !applications?.length ? (
            <EmptyState
              icon={<Swords className="h-8 w-8 text-muted-foreground" />}
              title="지원 내역이 없습니다"
              description="관심 있는 파티에 지원해보세요."
              action={{
                label: "모집글 보기",
                onClick: () => {},
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow h-full">
                  <Link href={`/posts/${app.postId}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">
                          {app.bossIds?.length > 0 ? formatBossNames(app.bossIds) : "모집글"}
                        </CardTitle>
                        <ApplicationStatusBadge status={app.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {/* 파티장 정보 */}
                      {app.authorCharacterName && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            {app.authorCharacterImageUrl ? (
                              <img
                                src={app.authorCharacterImageUrl}
                                alt={app.authorCharacterName}
                                className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Crown className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm">
                              {app.authorCharacterName}
                              {app.authorWorldName && <span className="text-xs text-muted-foreground"> · {app.authorWorldName}</span>}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {app.currentMembers}/{app.requiredMembers}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatRelativeTime(app.appliedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Link>
                  {app.status === "APPLIED" && (
                    <CardContent className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        disabled={withdrawMutation.isPending}
                        onClick={async (e) => {
                          e.preventDefault();
                          if (confirm("지원을 취소하시겠습니까?")) {
                            await withdrawMutation.mutateAsync({
                              postId: app.postId,
                              applicationId: app.id,
                            });
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
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Received Evaluations */}
        <TabsContent value="evaluations">
          {evalLoading ? (
            <LoadingPage message="받은 평가를 불러오는 중..." />
          ) : !evaluations?.length ? (
            <EmptyState
              icon={<Thermometer className="h-8 w-8 text-muted-foreground" />}
              title="받은 평가가 없습니다"
              description="다른 사용자로부터 매너 평가를 받으면 여기에 표시됩니다."
            />
          ) : (
            <div className="space-y-3">
              {evaluations.map((evaluation) => (
                <Card key={evaluation.id}>
                  <CardContent className="py-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <EvaluationContextBadge context={evaluation.context} />
                        </div>
                        <div className={cn(
                          "text-sm font-bold px-2 py-1 rounded shrink-0",
                          evaluation.temperatureChange > 0
                            ? "text-green-600 bg-green-50 dark:bg-green-950"
                            : evaluation.temperatureChange < 0
                              ? "text-red-600 bg-red-50 dark:bg-red-950"
                              : "text-gray-500 bg-gray-50 dark:bg-gray-900"
                        )}>
                          {evaluation.temperatureChange > 0 ? "+" : ""}{evaluation.temperatureChange.toFixed(2)}°C
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {evaluation.tags.map((tag) => (
                          <EvaluationTagBadge key={tag} tag={tag} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(evaluation.createdAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

const TAG_LABELS: Record<string, string> = {
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

const POSITIVE_TAGS = ["GOOD_CONTACT", "PUNCTUAL", "KIND", "CARRIES_LOG", "GOOD_CONTROL"];
const NEGATIVE_TAGS = ["BAD_CONTACT", "LATE", "NO_SHOW", "RUDE", "TOXIC"];

function EvaluationTagBadge({ tag }: { tag: string }) {
  const isPositive = POSITIVE_TAGS.includes(tag);
  const isNegative = NEGATIVE_TAGS.includes(tag);

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        isPositive && "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400",
        isNegative && "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400",
        !isPositive && !isNegative && "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
      )}
    >
      {TAG_LABELS[tag] || tag}
    </Badge>
  );
}

function EvaluationContextBadge({ context }: { context: string }) {
  const config: Record<string, { label: string; variant: "default" | "secondary" }> = {
    DM: { label: "DM", variant: "secondary" },
    PARTY_CHAT: { label: "파티 채팅", variant: "secondary" },
    PARTY_PAGE: { label: "파티 페이지", variant: "secondary" },
  };
  const { label } = config[context] || { label: context };
  return <Badge variant="secondary" className="text-xs">{label}</Badge>;
}

function PostStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "warning" }> = {
    RECRUITING: { label: "모집 중", variant: "success" },
    CLOSED: { label: "마감", variant: "secondary" },
    CANCELED: { label: "취소", variant: "warning" },
    EXPIRED: { label: "만료", variant: "destructive" },
  };

  const { label, variant } = config[status] || config.RECRUITING;
  return <Badge variant={variant}>{label}</Badge>;
}

function PartyStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "warning" }> = {
    ACTIVE: { label: "활성", variant: "success" },
    COMPLETED: { label: "완료", variant: "secondary" },
    CANCELED: { label: "취소", variant: "destructive" },
  };

  const { label, variant } = config[status] || config.ACTIVE;
  return <Badge variant={variant}>{label}</Badge>;
}

function ApplicationStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "warning" }> = {
    APPLIED: { label: "대기 중", variant: "warning" },
    ACCEPTED: { label: "수락됨", variant: "success" },
    REJECTED: { label: "거절됨", variant: "destructive" },
    CANCELED: { label: "취소됨", variant: "secondary" },
    WITHDRAWN: { label: "취소됨", variant: "secondary" },
  };

  const { label, variant } = config[status] || config.APPLIED;
  return <Badge variant={variant}>{label}</Badge>;
}
