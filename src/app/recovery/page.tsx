"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import { Progress } from "@/components/ui/progress";
import {
  useCreateRecoveryChallenge,
  useCheckRecoveryChallenge,
  usePendingRecoveryChallenge,
  useResetPassword,
} from "@/lib/hooks/use-recovery";
import { useWorldGroups } from "@/lib/hooks/use-config";
import {
  AlertTriangle,
  ArrowLeft,
  Search,
  Shield,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  KeyRound,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCapsLock } from "@/lib/hooks/use-caps-lock";

type RecoveryStep = "search" | "verify" | "result" | "reset" | "done";

export default function RecoveryPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<RecoveryStep>("search");

  // Search step
  const [characterName, setCharacterName] = useState("");
  const [worldName, setWorldName] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  // Verify step
  const [lastCheckResult, setLastCheckResult] = useState<{
    verified: boolean;
    message: string;
  } | null>(null);

  // Result step
  const [foundUsername, setFoundUsername] = useState<string | null>(null);
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);

  // Reset step
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Hooks
  const { data: worldGroups } = useWorldGroups();
  const createChallenge = useCreateRecoveryChallenge();
  const checkChallenge = useCheckRecoveryChallenge();
  const resetPassword = useResetPassword();

  const {
    data: pendingChallenge,
    isLoading: pendingLoading,
  } = usePendingRecoveryChallenge(characterName, worldName, {
    enabled: step === "verify" && !!characterName && !!worldName,
  });

  // World list from config
  const allWorlds = worldGroups?.flatMap((wg) => wg.worlds) ?? [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    if (!characterName.trim() || !worldName.trim()) {
      setSearchError("캐릭터명과 월드를 모두 입력해주세요.");
      return;
    }

    try {
      await createChallenge.mutateAsync({
        characterName: characterName.trim(),
        worldName: worldName.trim(),
      });
      setStep("verify");
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : "인증 챌린지 생성에 실패했습니다."
      );
    }
  };

  const handleCheck = async () => {
    if (!pendingChallenge?.id) return;
    setLastCheckResult(null);

    try {
      const result = await checkChallenge.mutateAsync({
        challengeId: pendingChallenge.id,
        characterName,
        worldName,
      });

      if (result.status === "SUCCESS" && result.username) {
        setFoundUsername(result.username);
        setRecoveryToken(result.recoveryToken);
        setStep("result");
      } else {
        setLastCheckResult({
          verified: false,
          message: result.message,
        });
      }
    } catch (err) {
      setLastCheckResult({
        verified: false,
        message: err instanceof Error ? err.message : "확인 중 오류가 발생했습니다.",
      });
    }
  };

  const hasKorean = (text: string) => /[\uAC00-\uD7AF\u3131-\u318E]/.test(text);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (newPassword.length < 6) {
      setResetError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    if (hasKorean(newPassword)) {
      setResetError("비밀번호에 한글이 포함되어 있습니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!recoveryToken) {
      setResetError("복구 토큰이 유효하지 않습니다.");
      return;
    }

    try {
      await resetPassword.mutateAsync({
        recoveryToken,
        newPassword,
      });
      setStep("done");
    } catch (err) {
      setResetError(
        err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent-50/30 flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-maple-pattern opacity-20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (step === "search") router.back();
            else if (step === "verify") setStep("search");
            else if (step === "reset") setStep("result");
          }}
          className={cn(
            "absolute -top-12 left-0 text-muted-foreground hover:text-foreground",
            (step === "result" || step === "done") && "invisible"
          )}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          뒤로
        </Button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <p className="text-caption text-muted-foreground mt-1">
            아이디 / 비밀번호 찾기
          </p>
        </div>

        {/* Step 1: Search */}
        {step === "search" && (
          <SearchStep
            characterName={characterName}
            setCharacterName={setCharacterName}
            worldName={worldName}
            setWorldName={setWorldName}
            allWorlds={allWorlds}
            error={searchError}
            isLoading={createChallenge.isPending}
            onSubmit={handleSearch}
          />
        )}

        {/* Step 2: Verify */}
        {step === "verify" && pendingChallenge?.exists && (
          <VerifyStep
            challenge={pendingChallenge}
            onCheck={handleCheck}
            isChecking={checkChallenge.isPending}
            lastCheckResult={lastCheckResult}
          />
        )}

        {step === "verify" && pendingLoading && (
          <Card className="shadow-elevated border-0 card-cute">
            <CardContent className="py-12 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">챌린지 정보를 불러오는 중...</p>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Result (Username found) */}
        {step === "result" && foundUsername && (
          <ResultStep
            username={foundUsername}
            onResetPassword={() => setStep("reset")}
            onGoToLogin={() => router.push("/login")}
          />
        )}

        {/* Step 4: Reset Password */}
        {step === "reset" && (
          <ResetPasswordStep
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={resetError}
            isLoading={resetPassword.isPending}
            onSubmit={handleResetPassword}
          />
        )}

        {/* Step 5: Done */}
        {step === "done" && <DoneStep onGoToLogin={() => router.push("/login")} />}

        {/* Footer */}
        <p className="text-center text-body-sm text-muted-foreground mt-6">
          계정이 기억나셨나요?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium underline-cute">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}

// ============================================
// Sub-components
// ============================================

function SearchStep({
  characterName,
  setCharacterName,
  worldName,
  setWorldName,
  allWorlds,
  error,
  isLoading,
  onSubmit,
}: {
  characterName: string;
  setCharacterName: (v: string) => void;
  worldName: string;
  setWorldName: (v: string) => void;
  allWorlds: string[];
  error: string | null;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <Card className="shadow-elevated border-0 card-cute">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-h1">계정을 찾아볼게요</CardTitle>
        <CardDescription className="text-body">
          인증된 캐릭터 정보로 계정을 찾을 수 있어요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-medium text-sm">이렇게 진행돼요</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>인증했던 캐릭터명과 월드를 입력합니다.</li>
              <li>캐릭터에 대한 소유권 인증을 진행합니다.</li>
              <li>인증 성공 시 아이디를 확인하고, 비밀번호를 재설정할 수 있어요.</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Label htmlFor="characterName">캐릭터명</Label>
            <Input
              id="characterName"
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="캐릭터명을 입력하세요"
              required
              className="h-12 input-warm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="worldName">월드</Label>
            <select
              id="worldName"
              value={worldName}
              onChange={(e) => setWorldName(e.target.value)}
              required
              className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 input-warm"
            >
              <option value="">월드를 선택하세요</option>
              {allWorlds.map((world) => (
                <option key={world} value={world}>
                  {world}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error-bg text-error-text text-body-sm flex items-center gap-2">
              <span className="text-lg">😢</span>
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-body btn-maple" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                확인 중...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                계정 찾기
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function VerifyStep({
  challenge,
  onCheck,
  isChecking,
  lastCheckResult,
}: {
  challenge: {
    requiredSymbol1: string | null;
    requiredSymbol2: string | null;
    expiresAt: string | null;
    checkCount: number;
    maxChecks: number;
    secondsUntilNextCheck: number | null;
  };
  onCheck: () => void;
  isChecking: boolean;
  lastCheckResult: { verified: boolean; message: string } | null;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [cooldownSeconds, setCooldownSeconds] = useState(challenge.secondsUntilNextCheck ?? 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCooldownSeconds(challenge.secondsUntilNextCheck ?? 0);
  }, [challenge.secondsUntilNextCheck]);

  const expiresAt = challenge.expiresAt ? new Date(challenge.expiresAt).getTime() : 0;
  const timeRemaining = Math.max(0, expiresAt - now);
  const minutesRemaining = Math.floor(timeRemaining / 1000 / 60);
  const secondsRemaining = Math.floor((timeRemaining / 1000) % 60);

  const maxChecks = challenge.maxChecks ?? 10;
  const checkCount = challenge.checkCount ?? 0;
  const checksRemaining = maxChecks - checkCount;
  const canCheckNow = cooldownSeconds <= 0;
  const checksProgress = maxChecks > 0 ? (checkCount / maxChecks) * 100 : 0;

  return (
    <Card className="shadow-elevated border-0 card-cute">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-h1">심볼 인증</CardTitle>
        <CardDescription>아래 심볼들을 게임에서 해제해주세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer */}
        <div
          className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            timeRemaining <= 0
              ? "bg-red-100 border border-red-300"
              : minutesRemaining < 5
                ? "bg-yellow-100 border border-yellow-300"
                : "bg-muted"
          )}
        >
          <div className="flex items-center gap-2">
            <Clock
              className={cn(
                "h-4 w-4",
                timeRemaining <= 0 ? "text-red-600" : minutesRemaining < 5 ? "text-yellow-600" : "text-muted-foreground"
              )}
            />
            <span className="text-sm font-medium">남은 시간</span>
          </div>
          <span
            className={cn(
              "text-lg font-bold tabular-nums",
              timeRemaining <= 0 ? "text-red-600" : minutesRemaining < 5 ? "text-yellow-600" : ""
            )}
          >
            {timeRemaining <= 0
              ? "만료됨"
              : `${minutesRemaining}:${secondsRemaining.toString().padStart(2, "0")}`}
          </span>
        </div>

        {/* Required Symbols */}
        <div className="p-4 border rounded-lg bg-red-50 border-red-200 space-y-3">
          <h4 className="font-semibold text-sm text-red-800">해제할 심볼</h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <p className="font-medium text-red-700">{challenge.requiredSymbol1}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <p className="font-medium text-red-700">{challenge.requiredSymbol2}</p>
          </div>
          <p className="text-xs text-red-600">* 정확히 위 2개의 심볼만 해제해주세요.</p>
        </div>

        {/* Tips */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <span className="font-medium">해제 방법:</span> 장비 → 심볼 탭 → 심볼 더블클릭
          </p>
          <p className="text-xs text-blue-700 mt-1">
            * 반영까지 최대 15분 소요. 캐시샵 입장/퇴장 시 더 빠르게 반영됩니다.
          </p>
        </div>

        {/* Check Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>확인 가능 횟수</span>
            <span className="font-medium">
              {checksRemaining}/{maxChecks}
            </span>
          </div>
          <Progress value={checksProgress} />
        </div>

        {/* Last Check Result */}
        {lastCheckResult && (
          <div
            className={cn(
              "p-3 rounded-lg flex items-start gap-3",
              lastCheckResult.verified
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            )}
          >
            {lastCheckResult.verified ? (
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
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

        {/* Cooldown */}
        {!canCheckNow && (
          <div className="p-2 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              다음 확인까지 <span className="font-medium tabular-nums">{cooldownSeconds}초</span>
            </p>
          </div>
        )}

        {/* Check Button */}
        <Button
          onClick={onCheck}
          disabled={isChecking || !canCheckNow || checksRemaining <= 0 || timeRemaining <= 0}
          className="w-full h-12 btn-maple"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              확인 중...
            </>
          ) : timeRemaining <= 0 ? (
            "시간 만료"
          ) : (
            "심볼 해제 확인하기"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function ResultStep({
  username,
  onResetPassword,
  onGoToLogin,
}: {
  username: string;
  onResetPassword: () => void;
  onGoToLogin: () => void;
}) {
  return (
    <Card className="shadow-elevated border-0 card-cute">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-h1">계정을 찾았어요!</CardTitle>
        <CardDescription>인증에 성공하였습니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Username display */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">아이디</span>
          </div>
          <p className="text-xl font-bold text-primary">{username}</p>
        </div>

        <div className="space-y-3">
          <Button onClick={onResetPassword} className="w-full h-12 btn-maple">
            <KeyRound className="h-4 w-4 mr-2" />
            비밀번호 재설정하기
          </Button>
          <Button onClick={onGoToLogin} variant="outline" className="w-full h-12">
            아이디만 확인하고 로그인하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ResetPasswordStep({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  error,
  isLoading,
  onSubmit,
}: {
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  error: string | null;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const hasKorean = (text: string) => /[\uAC00-\uD7AF\u3131-\u318E]/.test(text);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const { isCapsLockOn, capsLockProps } = useCapsLock();

  return (
    <Card className="shadow-elevated border-0 card-cute">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-h1">비밀번호 재설정</CardTitle>
        <CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6자 이상 입력하세요"
                required
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="h-12 input-warm pr-10"
                {...capsLockProps}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {hasKorean(newPassword) && (
              <p className="text-sm text-destructive">한글이 입력되었습니다. 영문으로 전환해주세요.</p>
            )}
            {newPassword.length > 0 && newPassword.length < 6 && (
              <p className="text-sm text-muted-foreground">6자 이상 입력해주세요.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="h-12 input-warm"
              {...capsLockProps}
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-sm text-destructive">비밀번호가 일치하지 않습니다.</p>
            )}
            {passwordsMatch && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                비밀번호가 일치합니다.
              </p>
            )}
          </div>

          {isCapsLockOn && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-50 border border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />
              <p className="text-sm text-yellow-700">Caps Lock이 켜져 있습니다.</p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-error-bg text-error-text text-body-sm flex items-center gap-2">
              <span className="text-lg">😢</span>
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-body btn-maple"
            disabled={isLoading || !passwordsMatch || newPassword.length < 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                변경 중...
              </>
            ) : (
              "비밀번호 변경하기"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DoneStep({ onGoToLogin }: { onGoToLogin: () => void }) {
  return (
    <Card className="shadow-elevated border-0 card-cute">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-h1">변경 완료!</CardTitle>
        <CardDescription>비밀번호가 성공적으로 변경되었습니다</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          새로운 비밀번호로 로그인해주세요.
        </p>
        <Button onClick={onGoToLogin} className="w-full h-12 btn-maple">
          로그인하러 가기
        </Button>
      </CardContent>
    </Card>
  );
}
