"use client";

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
import { useMyApplications, useMyPosts } from "@/lib/hooks/use-posts";
import { useBossNames } from "@/lib/hooks/use-boss-names";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import { User, Calendar, Users, MessageSquare, Clock, Swords, Crown, Settings, CheckCircle } from "lucide-react";

export default function MyPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: partyRooms, isLoading: roomsLoading, error: roomsError } = usePartyRooms();
  const { data: applications, isLoading: appsLoading } = useMyApplications();
  const { data: myPosts, isLoading: postsLoading } = useMyPosts();
  const { formatBossNames } = useBossNames();

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
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user.nickname}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <TemperatureBadge temperature={user.temperature} showLabel />
                <span className="text-xs text-muted-foreground">
                  가입일: {formatRelativeTime(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="parties">
        <TabsList className="mb-4">
          <TabsTrigger value="parties" className="gap-2">
            <Users className="h-4 w-4" />
            내 파티 ({partyRooms?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-2">
            <Clock className="h-4 w-4" />
            지원 현황 ({applications?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-2">
            <Crown className="h-4 w-4" />
            내 모집글 ({myPosts?.length || 0})
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
                <Card key={room.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {room.bossIds?.length > 0 ? formatBossNames(room.bossIds) : "파티"}
                      </CardTitle>
                      <PartyStatusBadge status={room.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {room.scheduleConfirmed && room.scheduledTime ? (
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-green-700 dark:text-green-300 font-medium">확정된 출발 시간</p>
                          <p className="text-sm font-bold text-green-800 dark:text-green-200 truncate">
                            {formatDateTime(room.scheduledTime)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">시간 미정</span>
                      </div>
                    )}

                    {/* 파티원 목록 */}
                    <div className="space-y-1.5">
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
                            <span className="text-xs font-medium truncate max-w-[80px]">
                              {member.characterName || "알 수 없음"}
                            </span>
                            {member.isLeader && (
                              <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" asChild>
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
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">지원</p>
                        <p className="text-xs text-muted-foreground">
                          지원일: {formatRelativeTime(app.appliedAt)}
                        </p>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
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
    WITHDRAWN: { label: "철회됨", variant: "secondary" },
  };

  const { label, variant } = config[status] || config.APPLIED;
  return <Badge variant={variant}>{label}</Badge>;
}
