"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostCard, PostCardSkeleton } from "@/components/domain/PostCard";
import { BossFilterSelector } from "@/components/domain/BossFilterSelector";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { usePosts } from "@/lib/hooks/use-posts";
import { useAuth } from "@/lib/hooks/use-auth";
import { useWorldGroups } from "@/lib/hooks/use-config";
import { ChevronLeft, ChevronRight, Clock, Plus, Swords, Crown, Globe } from "lucide-react";
import type { WorldGroup } from "@/types/api";

type ViewFilter = "all" | "mine";

const ITEMS_PER_PAGE = 6;

export default function PostsPage() {
  return (
    <Suspense>
      <PostsPageContent />
    </Suspense>
  );
}

function PostsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // 위치 필터: "ALL" | WorldGroup | 특정 서버명 (단일 state로 상호 배제 보장)
  const [locationFilter, setLocationFilter] = useState<string>("ALL");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [bossFilter, setBossFilter] = useState<string[]>([]);
  const { isAuthenticated, user } = useAuth();
  const { data: worldGroups } = useWorldGroups();

  const WORLD_GROUP_VALUES = useMemo(() => new Set(["ALL", "CHALLENGER", "EOS_HELIOS", "NORMAL"]), []);
  const isWorldGroupFilter = WORLD_GROUP_VALUES.has(locationFilter);
  const isServerFiltering = !isWorldGroupFilter;

  // Tabs / Select에 바인딩할 값
  const tabValue = isWorldGroupFilter ? locationFilter : "ALL";
  const serverValue = isServerFiltering ? locationFilter : "ALL";

  const currentPage = Number(searchParams.get("page")) || 1;
  const setCurrentPage = useCallback((pageOrFn: number | ((prev: number) => number)) => {
    const newPage = typeof pageOrFn === "function" ? pageOrFn(currentPage) : pageOrFn;
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    router.replace(`/posts${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }, [currentPage, searchParams, router]);

  // 서버 드롭다운에 표시할 서버 목록 (일반 → 에오스/헬리오스 → 챌린저스 순)
  const allServers = useMemo(() => {
    if (!worldGroups) return [];
    const order = ["NORMAL", "EOS_HELIOS", "CHALLENGER"];
    return [...worldGroups]
      .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
      .map((group) => ({
        groupName: group.displayName,
        worlds: group.worlds,
      }));
  }, [worldGroups]);

  const postsFilters = {
    ...(isWorldGroupFilter && locationFilter !== "ALL" && { worldGroup: locationFilter }),
    ...(bossFilter.length > 0 && { bossIds: bossFilter }),
  };

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(
      Object.keys(postsFilters).length > 0 ? postsFilters : undefined
    );

  const allPosts = data?.pages.flatMap((page) => page.content) || [];

  // 클라이언트 필터링: 서버 + 내 모집글
  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    if (isServerFiltering) {
      posts = posts.filter((post) => post.worldName === locationFilter);
    }

    if (viewFilter === "mine" && user) {
      posts = posts.filter((post) => post.authorId === user.id);
    }

    return posts;
  }, [allPosts, isServerFiltering, locationFilter, viewFilter, user]);

  // 페이지네이션: 클라이언트 필터 적용 시 클라이언트 계산, 아니면 서버 기반
  const serverTotalPages = data?.pages[0]?.totalPages ?? 1;
  const hasClientFilter = viewFilter === "mine" || isServerFiltering;
  const totalPages = hasClientFilter
    ? Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE))
    : serverTotalPages;
  const safePage = Math.min(currentPage, totalPages);
  const posts = filteredPosts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  // 현재 페이지 데이터가 미로드 시 또는 클라이언트 필터로 데이터 부족 시 자동 fetch
  const loadedPages = data?.pages.length ?? 0;
  const needsMoreData = hasClientFilter
    && filteredPosts.length < safePage * ITEMS_PER_PAGE
    && hasNextPage
    && !isFetchingNextPage;
  useEffect(() => {
    if (safePage > loadedPages && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    } else if (needsMoreData) {
      fetchNextPage();
    }
  }, [safePage, loadedPages, hasNextPage, isFetchingNextPage, fetchNextPage, needsMoreData]);

  const isPageLoading = safePage > loadedPages;

  // 필터 변경 시 페이지 초기화 — 탭/서버 모두 locationFilter 하나로 관리
  const handleLocationFilterChange = (v: string) => {
    setLocationFilter(v);
    setCurrentPage(1);
  };

  const handleViewFilterChange = (filter: ViewFilter) => {
    setViewFilter(filter);
    setCurrentPage(1);
  };

  const handleBossFilterChange = (bossIds: string[]) => {
    setBossFilter(bossIds);
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
      />

      {/* View Filter */}
      {isAuthenticated && (
        <div className="flex items-center gap-2 mb-1.5">
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

      {/* World Group Filter + Server Filter + Boss Filter + Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
          <Tabs
            value={tabValue}
            onValueChange={handleLocationFilterChange}
          >
            <TabsList>
              <TabsTrigger value="ALL">전체</TabsTrigger>
              <TabsTrigger value="CHALLENGER">챌린저스</TabsTrigger>
              <TabsTrigger value="EOS_HELIOS">에오스/헬리오스</TabsTrigger>
              <TabsTrigger value="NORMAL">일반</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1.5">
            <Select value={serverValue} onValueChange={handleLocationFilterChange}>
              <SelectTrigger className="h-9 w-[140px] text-sm">
                <Globe className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                <SelectValue placeholder="서버" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체 서버</SelectItem>
                <SelectSeparator />
                {allServers.map((group) => (
                  <SelectGroup key={group.groupName}>
                    <SelectLabel>{group.groupName}</SelectLabel>
                    {group.worlds.map((world) => (
                      <SelectItem key={world} value={world}>
                        {world}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <BossFilterSelector value={bossFilter} onChange={handleBossFilterChange} />
          </div>
        </div>
        {createPostButton}
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
        <Clock className="h-3 w-3" />
        모집글은 작성 후 7일이 지나면 자동으로 마감됩니다.
      </p>

      {error ? (
        <ErrorState
          title="모집글을 불러올 수 없습니다"
          message={error.message}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
          {isPageLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isOwner={user?.id === post.authorId}
                />
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-2 flex items-center justify-center gap-1">
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
