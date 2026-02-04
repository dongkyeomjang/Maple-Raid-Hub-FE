"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostCard, PostCardSkeleton } from "@/components/domain/PostCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { usePosts } from "@/lib/hooks/use-posts";
import { useAuth } from "@/lib/hooks/use-auth";
import { ChevronLeft, ChevronRight, Plus, Swords, Crown } from "lucide-react";
import type { WorldGroup } from "@/types/api";

type ViewFilter = "all" | "mine";

const ITEMS_PER_PAGE = 6;

export default function PostsPage() {
  const [worldGroupFilter, setWorldGroupFilter] = useState<WorldGroup | "ALL">("ALL");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated, user } = useAuth();

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(
      worldGroupFilter === "ALL" ? undefined : { worldGroup: worldGroupFilter }
    );

  const allPosts = data?.pages.flatMap((page) => page.content) || [];

  // 내 모집글만 필터링
  const filteredPosts = viewFilter === "mine" && user
    ? allPosts.filter((post) => post.authorId === user.id)
    : allPosts;

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const posts = filteredPosts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  // 필터 변경 시 페이지 초기화
  const handleWorldGroupChange = (v: string) => {
    setWorldGroupFilter(v as WorldGroup | "ALL");
    setCurrentPage(1);
  };

  const handleViewFilterChange = (filter: ViewFilter) => {
    setViewFilter(filter);
    setCurrentPage(1);
  };

  const createPostButton = isAuthenticated ? (
    <Button asChild>
      <Link href="/posts/new">
        <Plus className="h-4 w-4 mr-2" />
        모집글 작성
      </Link>
    </Button>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              모집글 작성
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>로그인 이후 이용 가능합니다</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <PageContainer>
      <PageHeader
        title="파티 모집"
        description="보스 레이드 파티를 모집하거나 참여하세요."
        actions={createPostButton}
      />

      {/* View Filter - 전체/내 모집글 */}
      {isAuthenticated && (
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant={viewFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewFilterChange("all")}
          >
            전체 모집글
          </Button>
          <Button
            variant={viewFilter === "mine" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewFilterChange("mine")}
          >
            <Crown className="h-4 w-4 mr-1" />
            내 모집글
          </Button>
        </div>
      )}

      {/* World Group Filter */}
      <Tabs
        value={worldGroupFilter}
        onValueChange={handleWorldGroupChange}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="ALL">전체</TabsTrigger>
          <TabsTrigger value="CHALLENGER">챌린저스</TabsTrigger>
          <TabsTrigger value="EOS_HELIOS">에오스/헬리오스</TabsTrigger>
          <TabsTrigger value="NORMAL">일반</TabsTrigger>
        </TabsList>
      </Tabs>

      {error ? (
        <ErrorState
          title="모집글을 불러올 수 없습니다"
          message={error.message}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={viewFilter === "mine" ? <Crown className="h-8 w-8 text-muted-foreground" /> : <Swords className="h-8 w-8 text-muted-foreground" />}
          title={viewFilter === "mine" ? "작성한 모집글이 없습니다" : "모집글이 없습니다"}
          description={viewFilter === "mine"
            ? "아직 작성한 모집글이 없습니다. 새 모집글을 작성해보세요!"
            : "아직 등록된 모집글이 없습니다. 첫 번째 모집글을 작성해보세요!"}
          action={{
            label: "모집글 작성하기",
            onClick: () => {
              if (isAuthenticated) {
                window.location.href = "/posts/new";
              }
            },
            disabled: !isAuthenticated,
            disabledTooltip: "로그인 이후 이용 가능합니다",
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isOwner={user?.id === post.authorId}
              />
            ))}
          </div>

          {/* 서버에서 다음 페이지 데이터 미리 로드 */}
          {hasNextPage && viewFilter === "all" && safePage >= totalPages && (
            <div className="mt-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "불러오는 중..." : "더 많은 글 불러오기"}
              </Button>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === safePage ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
