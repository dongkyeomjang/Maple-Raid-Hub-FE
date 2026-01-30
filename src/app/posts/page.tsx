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
import { Plus, Swords, Crown } from "lucide-react";
import type { WorldGroup } from "@/types/api";

type ViewFilter = "all" | "mine";

export default function PostsPage() {
  const [worldGroupFilter, setWorldGroupFilter] = useState<WorldGroup | "ALL">("ALL");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const { isAuthenticated, user } = useAuth();

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(
      worldGroupFilter === "ALL" ? undefined : { worldGroup: worldGroupFilter }
    );

  const allPosts = data?.pages.flatMap((page) => page.content) || [];

  // 내 모집글만 필터링
  const posts = viewFilter === "mine" && user
    ? allPosts.filter((post) => post.authorId === user.id)
    : allPosts;

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
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={viewFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewFilter("all")}
          >
            전체 모집글
          </Button>
          <Button
            variant={viewFilter === "mine" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewFilter("mine")}
          >
            <Crown className="h-4 w-4 mr-1" />
            내 모집글
          </Button>
        </div>
      )}

      {/* World Group Filter */}
      <Tabs
        value={worldGroupFilter}
        onValueChange={(v) => setWorldGroupFilter(v as WorldGroup | "ALL")}
        className="mb-6"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isOwner={user?.id === post.authorId}
              />
            ))}
          </div>

          {hasNextPage && viewFilter === "all" && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
