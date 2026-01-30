"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { PartyMemberResponse } from "@/types/api";
import { cn } from "@/lib/utils";
import { Check, Clock, User, AlertCircle } from "lucide-react";

interface ReadyCheckProps {
  members: PartyMemberResponse[];
  isLeader: boolean;
  onStartReadyCheck: () => void;
  onToggleReady: () => void;
  myUserId: string | null;
  isReadyCheckActive?: boolean;
  isStarting?: boolean;
}

export function ReadyCheck({
  members,
  isLeader,
  onStartReadyCheck,
  onToggleReady,
  myUserId,
  isReadyCheckActive,
  isStarting,
}: ReadyCheckProps) {
  const readyCount = members.filter((m) => m.isReady).length;
  const totalCount = members.length;
  const allReady = readyCount === totalCount;
  const myMember = members.find((m) => m.userId === myUserId);
  const amIReady = myMember?.isReady || false;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            준비 상태
          </span>
          <span
            className={cn(
              "text-sm font-normal px-2 py-1 rounded",
              allReady ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            )}
          >
            {readyCount}/{totalCount} 준비됨
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Progress value={(readyCount / totalCount) * 100} className="h-2" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {members.map((member) => (
            <div
              key={member.userId}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border",
                member.isReady
                  ? "border-green-200 bg-green-50"
                  : "border-muted bg-muted/30"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {member.isLeader ? "파티장" : "멤버"}
                </p>
              </div>
              {member.isReady ? (
                <Check className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </div>

        {isReadyCheckActive && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              준비 확인이 진행 중입니다. 모든 멤버가 준비해주세요!
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            className="flex-1"
            variant={amIReady ? "secondary" : "default"}
            onClick={onToggleReady}
          >
            {amIReady ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                준비 완료
              </>
            ) : (
              "준비하기"
            )}
          </Button>

          {isLeader && (
            <Button
              variant="outline"
              onClick={onStartReadyCheck}
              disabled={isStarting}
            >
              준비 확인 시작
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
