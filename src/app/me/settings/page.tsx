"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDiscordStatus, useDiscordLink, useDiscordUnlink } from "@/lib/hooks/use-discord";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/lib/hooks/use-notifications";
import { ArrowLeft, Link2, Unlink, Bell, MessageSquare, UserPlus, UserCheck, UserX } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoading: authLoading, checkAuth } = useAuth();
  const searchParams = useSearchParams();
  const discordParam = searchParams.get("discord");

  const { data: discordStatus, isLoading: discordLoading, refetch: refetchDiscord } = useDiscordStatus();
  const { data: preferences, isLoading: prefsLoading } = useNotificationPreferences();
  const linkDiscord = useDiscordLink();
  const unlinkDiscord = useDiscordUnlink();
  const updatePreferences = useUpdateNotificationPreferences();

  // Discord 콜백 후 상태 갱신
  useEffect(() => {
    if (discordParam === "linked") {
      refetchDiscord();
      checkAuth();
    }
  }, [discordParam, refetchDiscord, checkAuth]);

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
          message="설정 페이지를 이용하려면 로그인해주세요."
        />
      </PageContainer>
    );
  }

  const isDiscordLinked = discordStatus?.linked ?? user.discordLinked;
  const discordUsername = discordStatus?.discordUsername ?? user.discordUsername;

  const handleTogglePreference = (key: string, currentValue: boolean) => {
    updatePreferences.mutate({ [key]: !currentValue });
  };

  return (
    <PageContainer>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/me">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader title="설정" />
      </div>

      {/* Discord 연동 결과 메시지 */}
      {discordParam === "linked" && (
        <Card className="mb-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-4">
            <p className="text-sm text-green-700 dark:text-green-300">
              디스코드가 성공적으로 연동되었습니다!
            </p>
          </CardContent>
        </Card>
      )}
      {discordParam === "error" && (
        <Card className="mb-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              디스코드 연동에 실패했습니다. 다시 시도해주세요.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Discord 연동 섹션 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            디스코드 연동
          </CardTitle>
          <CardDescription>
            디스코드를 연동하면 모집 신청, DM 등의 알림을 디스코드 DM으로 받을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {discordLoading ? (
            <div className="text-sm text-muted-foreground">로딩 중...</div>
          ) : isDiscordLinked ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="success">연동됨</Badge>
                <span className="text-sm font-medium">{discordUsername}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => unlinkDiscord.mutate()}
                disabled={unlinkDiscord.isPending}
              >
                <Unlink className="h-4 w-4 mr-1" />
                {unlinkDiscord.isPending ? "해제 중..." : "연동 해제"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => linkDiscord.mutate()}
              disabled={linkDiscord.isPending}
            >
              <Link2 className="h-4 w-4 mr-1" />
              {linkDiscord.isPending ? "연동 중..." : "디스코드 연동하기"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 알림 설정 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            알림 설정
          </CardTitle>
          <CardDescription>
            {isDiscordLinked
              ? "디스코드 DM으로 수신할 알림을 선택하세요."
              : "디스코드를 연동하면 알림 설정을 변경할 수 있습니다."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isDiscordLinked ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              디스코드 연동 후 이용 가능합니다.
            </div>
          ) : prefsLoading ? (
            <div className="text-sm text-muted-foreground">로딩 중...</div>
          ) : preferences ? (
            <div className="space-y-4">
              <NotificationToggle
                icon={<UserPlus className="h-4 w-4" />}
                label="모집 신청 접수"
                description="내 모집글에 새로운 지원이 들어왔을 때"
                checked={preferences.notifyApplicationReceived}
                onChange={() => handleTogglePreference("notifyApplicationReceived", preferences.notifyApplicationReceived)}
                disabled={updatePreferences.isPending}
              />
              <NotificationToggle
                icon={<UserCheck className="h-4 w-4" />}
                label="신청 수락"
                description="내 지원이 수락되었을 때"
                checked={preferences.notifyApplicationAccepted}
                onChange={() => handleTogglePreference("notifyApplicationAccepted", preferences.notifyApplicationAccepted)}
                disabled={updatePreferences.isPending}
              />
              <NotificationToggle
                icon={<UserX className="h-4 w-4" />}
                label="신청 거절"
                description="내 지원이 거절되었을 때"
                checked={preferences.notifyApplicationRejected}
                onChange={() => handleTogglePreference("notifyApplicationRejected", preferences.notifyApplicationRejected)}
                disabled={updatePreferences.isPending}
              />
              <NotificationToggle
                icon={<MessageSquare className="h-4 w-4" />}
                label="DM 수신"
                description="새 DM을 5분 이상 읽지 않았을 때"
                checked={preferences.notifyDmReceived}
                onChange={() => handleTogglePreference("notifyDmReceived", preferences.notifyDmReceived)}
                disabled={updatePreferences.isPending}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function NotificationToggle({
  icon,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-muted-foreground">{icon}</div>
        <div>
          <Label className="text-sm font-medium cursor-pointer" onClick={onChange}>
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
