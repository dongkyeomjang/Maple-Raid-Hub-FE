"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorldGroupBadge } from "./WorldGroupBadge";
import type { PostResponse } from "@/types/api";
import { formatDateTime, formatRelativeTime, cn } from "@/lib/utils";
import { useBossNames } from "@/lib/hooks/use-boss-names";
import { Calendar, Clock, ChevronRight, Crown } from "lucide-react";

interface PostCardProps {
  post: PostResponse;
  variant?: "default" | "compact";
  isOwner?: boolean;
}

const statusLabels: Record<
  string,
  { label: string; variant: "success" | "warning" | "secondary" | "error" }
> = {
  RECRUITING: { label: "모집 중", variant: "success" },
  CLOSED: { label: "마감", variant: "secondary" },
  CANCELED: { label: "취소", variant: "warning" },
  EXPIRED: { label: "만료", variant: "error" },
};

export function PostCard({ post, variant = "default", isOwner = false }: PostCardProps) {
  const { formatBossNames } = useBossNames();
  const statusConfig = statusLabels[post.status] || statusLabels.RECRUITING;
  const isFull = post.currentMembers >= post.requiredMembers;

  const bossIds = post.bossIds ?? [];
  const displayName = formatBossNames(bossIds);

  if (variant === "compact") {
    return (
      <Link href={`/posts/${post.id}`} className="block">
        <Card interactive className={cn("group", isOwner && "ring-1 ring-primary/30")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {isOwner && (
                    <Badge variant="default" size="sm" className="bg-primary/10 text-primary border-primary/20">
                      <Crown className="h-3 w-3 mr-1" />
                      내 모집글
                    </Badge>
                  )}
                  <WorldGroupBadge worldGroup={post.worldGroup} size="sm" />
                  <Badge variant={statusConfig.variant} size="sm">
                    {statusConfig.label}
                  </Badge>
                </div>
                <h3 className="font-semibold text-body truncate">
                  {displayName}
                </h3>
                <p className="text-caption text-muted-foreground">
                  {formatDateTime(post.preferredTime)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className={cn(
                    "text-h3 font-bold tabular-nums",
                    isFull ? "text-error" : "text-primary"
                  )}>
                    {post.currentMembers}/{post.requiredMembers}
                  </div>
                  <p className="text-tiny text-muted-foreground">파티원</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card interactive className={cn("group", isOwner && "ring-1 ring-primary/30")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center flex-wrap gap-2">
              {isOwner && (
                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                  <Crown className="h-3 w-3 mr-1" />
                  내 모집글
                </Badge>
              )}
              <WorldGroupBadge worldGroup={post.worldGroup} showEmoji />
              <Badge variant={statusConfig.variant}>
                {statusConfig.label}
              </Badge>
            </div>
            <h3 className="font-semibold text-h3 truncate">
              {displayName}
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center px-3 py-2 bg-muted/50 rounded-lg">
            <div className={cn(
              "text-h2 font-bold tabular-nums leading-none",
              isFull ? "text-error" : "text-primary"
            )}>
              {post.currentMembers}
              <span className="text-body-sm font-normal text-muted-foreground">
                /{post.requiredMembers}
              </span>
            </div>
            <p className="text-tiny text-muted-foreground mt-0.5">파티원</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-body-sm">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-foreground">{formatDateTime(post.preferredTime)}</span>
        </div>

        {post.description && (
          <div className="p-2.5 bg-muted/30 rounded-lg">
            <p className="text-body-sm text-muted-foreground line-clamp-2">
              {post.description}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {formatRelativeTime(post.createdAt)}
        </div>
        <Button
          size="sm"
          variant={isOwner ? "default" : "outline"}
          asChild
          className={cn(
            "transition-colors",
            !isOwner && "group-hover:bg-primary group-hover:text-white group-hover:border-primary"
          )}
        >
          <Link href={isOwner ? `/posts/${post.id}/manage` : `/posts/${post.id}`}>
            {isOwner ? "관리하기" : "자세히 보기"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PostCardSkeleton({ variant = "default" }: { variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-muted animate-shimmer rounded-full" />
                <div className="h-5 w-14 bg-muted animate-shimmer rounded-full" />
              </div>
              <div className="h-5 w-32 bg-muted animate-shimmer rounded" />
              <div className="h-4 w-24 bg-muted animate-shimmer rounded" />
            </div>
            <div className="h-12 w-12 bg-muted animate-shimmer rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 bg-muted animate-shimmer rounded-full" />
              <div className="h-5 w-16 bg-muted animate-shimmer rounded-full" />
            </div>
            <div className="h-6 w-40 bg-muted animate-shimmer rounded" />
          </div>
          <div className="h-16 w-16 bg-muted animate-shimmer rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-5 w-36 bg-muted animate-shimmer rounded" />
        <div className="h-16 w-full bg-muted animate-shimmer rounded-lg" />
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 border-t border-border/50">
        <div className="h-4 w-16 bg-muted animate-shimmer rounded" />
        <div className="h-9 w-28 bg-muted animate-shimmer rounded-md" />
      </CardFooter>
    </Card>
  );
}
