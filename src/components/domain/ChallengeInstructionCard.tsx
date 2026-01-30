"use client";

import {useState, useEffect} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {AlertCircle, Clock, RefreshCw, CheckCircle, XCircle} from "lucide-react";
import type {ChallengeResponse} from "@/types/api";
import {cn} from "@/lib/utils";

interface ChallengeInstructionCardProps {
    challenge: ChallengeResponse;
    onCheck: () => void;
    isChecking: boolean;
    lastCheckResult?: { verified: boolean; message: string } | null;
}

export function ChallengeInstructionCard({
                                             challenge,
                                             onCheck,
                                             isChecking,
                                             lastCheckResult,
                                         }: ChallengeInstructionCardProps) {
    // 실시간 타이머를 위한 state
    const [now, setNow] = useState(() => Date.now());
    const [cooldownSeconds, setCooldownSeconds] = useState(challenge.secondsUntilNextCheck);

    // 매초 현재 시간 업데이트
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
            setCooldownSeconds((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // challenge가 변경되면 cooldown 초기화
    useEffect(() => {
        setCooldownSeconds(challenge.secondsUntilNextCheck);
    }, [challenge.secondsUntilNextCheck]);

    const expiresAt = new Date(challenge.expiresAt).getTime();
    const timeRemaining = Math.max(0, expiresAt - now);
    const minutesRemaining = Math.floor(timeRemaining / 1000 / 60);
    const secondsRemaining = Math.floor((timeRemaining / 1000) % 60);

    const checksRemaining = challenge.maxChecks - challenge.checkCount;
    const canCheckNow = cooldownSeconds <= 0;
    const checksProgress = (challenge.checkCount / challenge.maxChecks) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary"/>
                    심볼 인증 안내
                </CardTitle>
                <CardDescription>
                    캐릭터 소유권을 확인하기 위해 아래 심볼들을 해제해주세요
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Timer */}
                <div className={cn(
                    "flex items-center justify-between p-4 rounded-lg",
                    timeRemaining <= 0
                        ? "bg-red-100 border border-red-300"
                        : minutesRemaining < 5
                            ? "bg-yellow-100 border border-yellow-300"
                            : "bg-muted"
                )}>
                    <div className="flex items-center gap-2">
                        <Clock className={cn(
                            "h-5 w-5",
                            timeRemaining <= 0
                                ? "text-red-600"
                                : minutesRemaining < 5
                                    ? "text-yellow-600"
                                    : "text-muted-foreground"
                        )}/>
                        <span className="text-sm font-medium">남은 시간</span>
                    </div>
                    <span className={cn(
                        "text-lg font-bold tabular-nums",
                        timeRemaining <= 0
                            ? "text-red-600"
                            : minutesRemaining < 5
                                ? "text-yellow-600"
                                : ""
                    )}>
            {timeRemaining <= 0
                ? "만료됨"
                : `${minutesRemaining}:${secondsRemaining.toString().padStart(2, "0")}`
            }
          </span>
                </div>

                {/* Instruction */}
                <div className="space-y-2">
                    <h4 className="font-semibold">인증 방법</h4>
                    <div className="p-4 border rounded-lg bg-background">
                        <p className="text-sm leading-relaxed">
                            게임에 접속하여 아래 <span className="font-semibold text-primary">2개의 심볼</span>을 해제해주세요.
                            해제 후 아래 &apos;확인하기&apos; 버튼을 눌러 인증을 완료하세요.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            * 심볼 변경 사항이 API에 반영되기까지 최대 15분이 소요될 수 있습니다.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            * 심볼 해제 이후 캐시샵을 입장했다가 퇴장하면 더 빠르게 반영될 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* Required Symbols */}
                <div className="space-y-2">
                    <h4 className="font-semibold">해제할 심볼</h4>
                    <div className="p-4 border rounded-lg bg-red-50 border-red-200 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"/>
                            <p className="font-medium text-red-700">{challenge.requiredSymbol1}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"/>
                            <p className="font-medium text-red-700">{challenge.requiredSymbol2}</p>
                        </div>
                        <p className="text-xs text-red-600 mt-2">
                            * 정확히 위 2개의 심볼만 해제해주세요. 다른 심볼은 해제하지 마세요.
                        </p>
                    </div>
                </div>

                {/* Check Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>확인 가능 횟수</span>
                        <span className="font-medium">{checksRemaining}/{challenge.maxChecks}</span>
                    </div>
                    <Progress value={checksProgress}/>
                </div>

                {/* Last Check Result */}
                {lastCheckResult && (
                    <div
                        className={cn(
                            "p-4 rounded-lg flex items-start gap-3",
                            lastCheckResult.verified
                                ? "bg-green-50 border border-green-200"
                                : "bg-yellow-50 border border-yellow-200"
                        )}
                    >
                        {lastCheckResult.verified ? (
                            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5"/>
                        ) : (
                            <XCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5"/>
                        )}
                        <p
                            className={cn(
                                "text-sm",
                                lastCheckResult.verified ? "text-green-800" : "text-yellow-800"
                            )}
                        >
                            {lastCheckResult.message}
                        </p>
                    </div>
                )}

                {/* Cooldown Notice */}
                {!canCheckNow && (
                    <div className="p-3 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">
                            다음 확인까지 <span className="font-medium tabular-nums">{cooldownSeconds}초</span> 기다려주세요
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        onClick={onCheck}
                        disabled={isChecking || !canCheckNow || checksRemaining <= 0 || timeRemaining <= 0}
                        className="flex-1"
                    >
                        {isChecking ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin"/>
                                확인 중...
                            </>
                        ) : timeRemaining <= 0 ? (
                            "시간 만료"
                        ) : (
                            "심볼 해제 확인하기"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
