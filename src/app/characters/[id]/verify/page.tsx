"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerificationStepper, type VerificationStep } from "@/components/domain/VerificationStepper";
import { ChallengeInstructionCard } from "@/components/domain/ChallengeInstructionCard";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingPage } from "@/components/common/LoadingSpinner";
import {
  useCharacter,
  useChallenge,
  useStartChallenge,
  useCheckChallenge,
} from "@/lib/hooks/use-characters";
import { ArrowLeft, Shield, Check, AlertCircle } from "lucide-react";

export default function VerifyCharacterPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const { data: character, isLoading: charLoading } = useCharacter(characterId);
  const { data: challenge, isLoading: challengeLoading } = useChallenge(characterId);
  const startMutation = useStartChallenge();
  const checkMutation = useCheckChallenge();

  const [lastCheckResult, setLastCheckResult] = useState<{
    verified: boolean;
    message: string;
  } | null>(null);

  // Determine current step
  let currentStep: VerificationStep = "start";
  if (challenge?.status === "PENDING") {
    currentStep = "equip";
  }
  if (challenge?.status === "SUCCESS" || character?.verificationStatus === "VERIFIED_OWNER") {
    currentStep = "complete";
  }

  const handleStartChallenge = async () => {
    await startMutation.mutateAsync(characterId);
  };

  const handleCheckChallenge = async () => {
    if (!challenge) return;
    try {
      const { result } = await checkMutation.mutateAsync({
        challengeId: challenge.id,
        characterId,
      });
      setLastCheckResult({
        verified: result.status === "SUCCESS",
        message: result.message,
      });

      if (result.status === "SUCCESS") {
        setTimeout(() => {
          router.push("/posts");
        }, 2000);
      }
    } catch (error) {
      // 에러 메시지를 UI에 표시
      setLastCheckResult({
        verified: false,
        message: error instanceof Error ? error.message : "확인 중 오류가 발생했습니다.",
      });
    }
  };

  if (charLoading || challengeLoading) {
    return (
      <PageContainer>
        <LoadingPage message="인증 정보를 불러오는 중..." />
      </PageContainer>
    );
  }

  if (!character) {
    return (
      <PageContainer>
        <ErrorState
          title="캐릭터를 찾을 수 없습니다"
          message="존재하지 않는 캐릭터입니다."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/characters/${characterId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            캐릭터 상세
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">캐릭터 인증</h1>
        <p className="text-muted-foreground">
          {character.characterName} 캐릭터의 소유권을 인증합니다.
        </p>
      </div>

      <VerificationStepper currentStep={currentStep} className="mb-8" />

      {currentStep === "start" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              인증 시작
            </CardTitle>
            <CardDescription>
              캐릭터 소유권을 확인하기 위해 심볼 기반 인증을 진행합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium">인증 방법</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>인증을 시작하면 해제해야 할 심볼 2개가 표시됩니다.</li>
                <li>게임에서 해당 심볼들을 해제합니다 (정확히 2개만).</li>
                <li>해제 후 &apos;확인&apos; 버튼을 눌러 인증을 완료합니다.</li>
              </ol>
            </div>

            {/* 심볼 해제 안내 */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-blue-800">심볼 해제 방법</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><span className="font-medium">해제 방법:</span> 장비 → 심볼 탭 → 해제하려는 심볼 더블클릭</li>
                <li><span className="font-medium">재장착:</span> 인증 완료 후 아이템 창에서 더블클릭으로 다시 장착 가능</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">주의사항</p>
                <ul className="mt-1 space-y-1">
                  <li>- 인증 시간은 30분입니다.</li>
                  <li>- 확인은 최대 10회까지 가능합니다.</li>
                  <li>- 각 확인 사이에 60초의 대기 시간이 있습니다.</li>
                  <li>- 심볼 변경 사항이 API에 반영되기까지 최대 15분이 소요될 수 있습니다.</li>
                  <li>- 레벨 260 이상의 캐릭터만 인증 가능합니다.</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleStartChallenge}
              disabled={startMutation.isPending}
              className="w-full"
            >
              {startMutation.isPending ? "준비 중..." : "인증 시작하기"}
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === "equip" && challenge && (
        <ChallengeInstructionCard
          challenge={challenge}
          onCheck={handleCheckChallenge}
          isChecking={checkMutation.isPending}
          lastCheckResult={lastCheckResult}
        />
      )}

      {currentStep === "complete" && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>인증 완료!</CardTitle>
            <CardDescription>
              캐릭터 소유권이 확인되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              이제 이 캐릭터로 파티 모집에 참여할 수 있습니다.
            </p>
            <Button asChild>
              <Link href="/posts">파티 모집글 보기</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
