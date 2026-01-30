"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { PageContainer } from "@/components/layout/PageContainer";
import { Check, Loader2 } from "lucide-react";

type Step = "account" | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("account");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Account form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");

  // 한글 포함 여부 체크
  const hasKorean = (text: string) => /[\uAC00-\uD7AF\u3131-\u318E]/.test(text);
  const passwordHasKorean = hasKorean(password) || hasKorean(confirmPassword);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passwordHasKorean) {
      setError("비밀번호에 한글이 포함되어 있습니다. 영문/숫자/특수문자만 사용해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(email, password, nickname);
      if (success) {
        // 회원가입 성공 후 모든 캐시된 쿼리 무효화
        await queryClient.invalidateQueries();
        setCurrentStep("complete");
      } else {
        setError("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    router.push("/characters");
  };

  return (
    <PageContainer className="max-w-lg mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {(["account", "complete"] as Step[]).map((step, index) => {
          const stepLabels = {
            account: "계정 생성",
            complete: "완료",
          };
          const isCompleted = currentStep === "complete" && step === "account";
          const isCurrent = currentStep === step;

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary"
                        : "border-muted"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="mt-2 text-xs font-medium">{stepLabels[step]}</span>
              </div>
              {index < 1 && (
                <div
                  className={`mx-4 h-0.5 w-16 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {currentStep === "account" && (
        <Card>
          <CardHeader>
            <CardTitle>계정 생성</CardTitle>
            <CardDescription>
              메-력소를 이용하기 위한 계정을 생성합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상"
                  required
                />
                {hasKorean(password) && (
                  <p className="text-sm text-destructive">
                    한글이 입력되었습니다. 영문으로 전환해주세요.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
                {hasKorean(confirmPassword) && (
                  <p className="text-sm text-destructive">
                    한글이 입력되었습니다. 영문으로 전환해주세요.
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  "다음"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  로그인
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      )}

      {currentStep === "complete" && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle>가입 완료!</CardTitle>
            <CardDescription>
              메-력소에 오신 것을 환영합니다!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              이제 캐릭터를 등록하고 인증하여 파티에 참여할 수 있습니다.
            </p>

            <Button onClick={handleComplete} className="w-full">
              캐릭터 등록하러 가기
            </Button>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
