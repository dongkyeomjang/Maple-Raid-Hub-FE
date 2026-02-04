"use client";

import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {WorldGroupBadge} from "./WorldGroupBadge";
import type {PostResponse} from "@/types/api";
import {cn, formatRelativeTime} from "@/lib/utils";
import {useBossNames} from "@/lib/hooks/use-boss-names";
import {Calendar, ChevronRight, Clock, Crown, User} from "lucide-react";

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
                <div className="flex items-center gap-2 mb-1 min-h-[20px]">
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
                {/* 계정 닉네임 */}
                <div className="flex items-center gap-1.5 text-caption text-muted-foreground mt-1">
                  <User className="h-3 w-3" />
                  {post.authorNickname && (
                    <span className="font-medium text-foreground/70">{post.authorNickname}</span>
                  )}
                  {post.preferredTime && (
                    <>
                      <span>·</span>
                      <span>{post.preferredTime.split("T")[0]}</span>
                    </>
                  )}
                </div>
                {/* 캐릭터 이미지 & 닉네임 */}
                {(post.characterImageUrl || post.characterName) && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="relative h-6 w-6 rounded-full border border-border/50 overflow-hidden shrink-0">
                      {post.characterImageUrl ? (
                        <img
                          src={post.characterImageUrl}
                          alt={post.characterName || "캐릭터"}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-[10px]">
                          ?
                        </div>
                      )}
                    </div>
                    {post.characterName && (
                      <span className="text-caption text-muted-foreground">{post.characterName}</span>
                    )}
                  </div>
                )}
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
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center flex-wrap gap-1.5">
              {isOwner && (
                <Badge variant="default" size="sm" className="bg-primary/10 text-primary border-primary/20">
                  <Crown className="h-3 w-3 mr-0.5" />
                  내 글
                </Badge>
              )}
              <WorldGroupBadge worldGroup={post.worldGroup} size="sm" showEmoji />
              <Badge variant={statusConfig.variant} size="sm">
                {statusConfig.label}
              </Badge>
            </div>
            <h3 className="font-semibold text-body truncate">
              {displayName}
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center px-2 py-1 bg-muted/50 rounded-md">
            <div className={cn(
              "text-h3 font-bold tabular-nums leading-none",
              isFull ? "text-error" : "text-primary"
            )}>
              {post.currentMembers}
              <span className="text-caption font-normal text-muted-foreground">
                /{post.requiredMembers}
              </span>
            </div>
            <p className="text-tiny text-muted-foreground">파티원</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-2 pt-0 space-y-1.5">
        <div className="flex items-center gap-1.5 text-caption">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-foreground">{post.preferredTime ? post.preferredTime.split("T")[0] : "상의 후 결정"}</span>
        </div>

        {post.description && (
          <div className="px-2 py-1.5 bg-muted/30 rounded-md">
            <p className="text-caption text-muted-foreground line-clamp-1">
              {post.description}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center px-4 pb-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative h-7 w-7 rounded-full border border-border/50 overflow-hidden shrink-0">
            {post.characterImageUrl ? (
              <img
                src={post.characterImageUrl}
                alt={post.characterName || "캐릭터"}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-[10px]">
                ?
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            {post.authorNickname && (
              <span className="text-caption font-medium text-foreground/70 truncate">{post.authorNickname}</span>
            )}
            <span className="text-tiny text-muted-foreground">{formatRelativeTime(post.createdAt)}</span>
          </div>
        </div>
        <Button
          size="sm"
          variant={isOwner ? "default" : "outline"}
          asChild
          className={cn(
            "transition-colors h-7 text-xs px-2.5",
            !isOwner && "group-hover:bg-primary group-hover:text-white group-hover:border-primary"
          )}
        >
          <Link href={`/posts/${post.id}`}>
            {isOwner ? "관리" : "보기"}
            <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
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
