"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import { BRAND_SLOGANS } from "@/components/brand/brand-constants";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Check,
  Loader2,
  MessageCircle,
  CalendarClock,
  Globe,
  Shield,
  ArrowRight,
  Home,
  Sparkles,
} from "lucide-react";

type Step = "intro" | "account" | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("intro");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Account form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");

  // 아이디 유효성 검사
  const isValidUsername = (text: string) => /^[a-z][a-z0-9_]{3,19}$/.test(text);
  const usernameError = username && !isValidUsername(username);

  // 한글 포함 여부 체크
  const hasKorean = (text: string) => /[\uAC00-\uD7AF\u3131-\u318E]/.test(text);
  const passwordHasKorean = hasKorean(password) || hasKorean(confirmPassword);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidUsername(username)) {
      setError("아이디는 영문 소문자로 시작하고, 영문 소문자/숫자/밑줄만 사용하여 4~20자로 입력해주세요.");
      return;
    }

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
      const success = await signup(username, password, nickname);
      if (success) {
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent-50/30">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-maple-pattern opacity-20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative container max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4 mr-1" />
              홈으로
            </Button>
          </Link>
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <div className="w-[72px]" /> {/* 로고 중앙 정렬을 위한 spacer */}
        </div>

        {/* Step Content */}
        {currentStep === "intro" && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-maple text-white text-caption font-semibold shadow-glow">
                <Sparkles className="h-4 w-4" />
                {BRAND_SLOGANS.main}
              </div>
              <h1 className="text-display sm:text-[2.5rem] font-bold tracking-tight mb-4">
                다른 월드 유저와
                <br />
                <span className="text-shimmer">처음으로 대화하세요</span>
              </h1>
              <p className="text-body-lg text-muted-foreground max-w-lg mx-auto">
                {BRAND_SLOGANS.connect}
                <br />
                메-력소에서 시작하세요.
              </p>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
              <ValueCard
                icon={<Globe className="h-6 w-6" />}
                title="월드 장벽 해체"
                description="스카니아, 크로아, 루나... 어떤 월드든 상관없이 함께"
                color="primary"
              />
              <ValueCard
                icon={<MessageCircle className="h-6 w-6" />}
                title="실시간 채팅"
                description="다른 서버 유저와 채팅으로 전략 공유하고 소통하세요"
                color="chat"
              />
              <ValueCard
                icon={<CalendarClock className="h-6 w-6" />}
                title="일정 조율"
                description="투표로 모두가 가능한 시간을 찾고 함께 레이드"
                color="schedule"
              />
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 text-body-sm text-muted-foreground">
              <div className="flex items-center gap-2 badge-puffy bg-primary-50">
                <Shield className="h-4 w-4 text-primary" />
                <span>장비 인증으로 검증된 유저</span>
              </div>
              <div className="flex items-center gap-2 badge-puffy bg-success-bg">
                <Check className="h-4 w-4 text-success" />
                <span>매너 온도로 신뢰 축적</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4">
              <Button
                size="xl"
                onClick={() => setCurrentStep("account")}
                className="btn-maple min-w-[200px]"
              >
                30초만에 가입하기
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
              <p className="text-caption text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium underline-cute">
                  로그인
                </Link>
              </p>
            </div>
          </div>
        )}

        {currentStep === "account" && (
          <div className="max-w-md mx-auto animate-fade-in">
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-maple text-white flex items-center justify-center text-caption font-bold shadow-glow">
                1
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-maple" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-caption font-bold">
                2
              </div>
            </div>

            <Card className="shadow-elevated border-0 card-cute">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-h1">계정 만들기</CardTitle>
                <CardDescription className="text-body">
                  파티원들과 소통하기 위한 계정을 만드세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAccountSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">닉네임</Label>
                    <Input
                      id="nickname"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="파티원들에게 보여질 이름"
                      required
                      className="h-12 input-warm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">아이디</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      placeholder="영문 소문자, 숫자, 밑줄 (4~20자)"
                      required
                      className="h-12 input-warm"
                    />
                    {usernameError && (
                      <p className="text-sm text-destructive">
                        영문 소문자로 시작, 영문 소문자/숫자/밑줄만 사용 (4~20자)
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="8자 이상, 영문/숫자/특수문자"
                      required
                      className="h-12 input-warm"
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
                      className="h-12 input-warm"
                    />
                    {hasKorean(confirmPassword) && (
                      <p className="text-sm text-destructive">
                        한글이 입력되었습니다. 영문으로 전환해주세요.
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-error-bg text-error-text text-body-sm flex items-center gap-2">
                      <span>😢</span>
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 text-body btn-maple" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        가입 중...
                      </>
                    ) : (
                      <>
                        가입 완료하기
                        <Sparkles className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <button
                    onClick={() => setCurrentStep("intro")}
                    className="w-full text-center text-body-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    이전으로 돌아가기
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "complete" && (
          <div className="max-w-md mx-auto animate-fade-in">
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-maple text-white flex items-center justify-center shadow-glow">
                <Check className="h-4 w-4" />
              </div>
              <div className="w-16 h-1 bg-gradient-maple rounded-full" />
              <div className="w-8 h-8 rounded-full bg-gradient-maple text-white flex items-center justify-center shadow-glow">
                <Check className="h-4 w-4" />
              </div>
            </div>

            <Card className="shadow-elevated border-0 overflow-hidden card-cute">
              {/* Celebration header */}
              <div className="bg-gradient-maple p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-maple-pattern opacity-20" />
                <div className="relative">
                  <h2 className="text-h1 text-white font-bold mb-2">환영합니다!</h2>
                  <p className="text-white/90">
                    이제 당신의 메이플力을 보여줄 준비가 되었어요
                  </p>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Next steps */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-body-lg">다음 단계</h3>
                  <div className="space-y-2">
                    <NextStepItem
                      number={1}
                      title="캐릭터 등록"
                      description="내 캐릭터를 등록하고 인증받으세요"
                      isActive
                    />
                    <NextStepItem
                      number={2}
                      title="파티 참여"
                      description="원하는 보스 파티에 지원하거나 직접 모집하세요"
                    />
                    <NextStepItem
                      number={3}
                      title="채팅 & 일정 조율"
                      description="다른 월드 파티원들과 대화하고 시간을 맞추세요"
                    />
                  </div>
                </div>

                <Button onClick={handleComplete} className="w-full h-12 text-body btn-maple">
                  캐릭터 등록하러 가기
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "chat" | "schedule";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    chat: "bg-chat-bg text-chat border-chat/20",
    schedule: "bg-schedule-bg text-schedule border-schedule/20",
  };

  const iconBgClasses = {
    primary: "bg-primary/10",
    chat: "bg-chat/10",
    schedule: "bg-schedule/10",
  };

  return (
    <div className={`value-card card-cute ${colorClasses[color]}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${iconBgClasses[color]} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-body-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function NextStepItem({
  number,
  title,
  description,
  isActive,
}: {
  number: number;
  title: string;
  description: string;
  isActive?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${isActive ? "bg-primary/5 border border-primary/10" : ""}`}>
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-tiny font-bold ${
          isActive ? "bg-gradient-maple text-white shadow-sm" : "bg-gray-100 text-gray-400"
        }`}
      >
        {number}
      </div>
      <div>
        <p className={`text-body-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
          {title}
        </p>
        <p className="text-caption text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
