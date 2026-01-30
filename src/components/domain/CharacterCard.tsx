"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WorldGroupBadge } from "./WorldGroupBadge";
import { VerificationBadge } from "./VerificationBadge";
import type { CharacterResponse } from "@/types/api";
import { formatRelativeTime } from "@/lib/utils";
import { Shield, User, Swords } from "lucide-react";

interface CharacterCardProps {
  character: CharacterResponse;
  showActions?: boolean;
}

export function CharacterCard({ character, showActions = true }: CharacterCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-col items-center text-center space-y-4 pb-2">
        <div className="h-48 w-48 rounded-full overflow-hidden bg-muted">
          {character.characterImageUrl ? (
            <img
              src={character.characterImageUrl}
              alt={character.characterName}
              className="w-full h-full object-cover scale-[2.5] object-[45%_35%]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h3 className="font-semibold text-xl">{character.characterName}</h3>
            <VerificationBadge status={character.verificationStatus} />
          </div>
          <p className="text-base text-muted-foreground">
            Lv.{character.characterLevel} {character.characterClass}
          </p>
          {character.combatPower > 0 && (
            <div className="flex items-center justify-center gap-1 text-orange-600">
              <Swords className="h-4 w-4" />
              <span className="font-semibold">{character.combatPower.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2">
            <WorldGroupBadge worldGroup={character.worldGroup} />
            <span className="text-sm text-muted-foreground">{character.worldName}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-center">
        <div className="text-xs text-muted-foreground">
          등록일: {formatRelativeTime(character.claimedAt)}
          {character.verifiedAt && (
            <> | 인증일: {formatRelativeTime(character.verifiedAt)}</>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/characters/${character.id}`}>상세보기</Link>
          </Button>
          {character.verificationStatus !== "VERIFIED_OWNER" && (
            <Button size="sm" asChild className="flex-1">
              <Link href={`/characters/${character.id}/verify`}>
                <Shield className="h-4 w-4 mr-1" />
                인증하기
              </Link>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export function CharacterCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center space-y-4 pb-2">
        <div className="h-48 w-48 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2 flex flex-col items-center">
          <div className="h-6 w-36 bg-muted animate-pulse rounded" />
          <div className="h-5 w-28 bg-muted animate-pulse rounded" />
          <div className="h-5 w-24 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="h-4 w-44 bg-muted animate-pulse rounded" />
      </CardContent>
      <CardFooter className="gap-2">
        <div className="h-9 flex-1 bg-muted animate-pulse rounded" />
        <div className="h-9 flex-1 bg-muted animate-pulse rounded" />
      </CardFooter>
    </Card>
  );
}
