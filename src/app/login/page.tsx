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
import { Loader2, MessageCircle, CalendarClock, Sparkles, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 포함 여부 체크
  const hasKorean = (text: string) => /[\uAC00-\uD7AF\u3131-\u318E]/.test(text);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (hasKorean(password)) {
      setError("비밀번호에 한글이 포함되어 있습니다. 영문으로 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        await queryClient.invalidateQueries();
        router.push("/posts");
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent-50/30 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-maple-pattern opacity-20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <div className="relative w-full max-w-md">
        {/* 뒤로가기 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="absolute -top-12 left-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          뒤로
        </Button>

        {/* 로고 */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <p className="text-caption text-muted-foreground mt-1">
            {BRAND_SLOGANS.short}
          </p>
        </div>

        <Card className="shadow-elevated border-0 card-cute">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-h1">다시 만나서 반가워요!</CardTitle>
            <CardDescription className="text-body">
              로그인하고 파티원들과 소통하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="h-12 input-warm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="h-12 input-warm"
                />
                {hasKorean(password) && (
                  <p className="text-sm text-destructive">
                    한글이 입력되었습니다. 영문으로 전환해주세요.
                  </p>
                )}
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
                    로그인 중...
                  </>
                ) : (
                  <>
                    로그인
                    <Sparkles className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-body-sm text-muted-foreground">
                아직 계정이 없으신가요?{" "}
                <Link href="/onboarding" className="text-primary hover:underline font-medium underline-cute">
                  무료로 시작하기
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Feature reminder */}
        <div className="mt-6 flex justify-center gap-6 text-caption text-muted-foreground">
          <div className="flex items-center gap-1.5 badge-puffy bg-chat-bg text-chat-text">
            <MessageCircle className="h-4 w-4" />
            <span>실시간 채팅</span>
          </div>
          <div className="flex items-center gap-1.5 badge-puffy bg-schedule-bg text-schedule-text">
            <CalendarClock className="h-4 w-4" />
            <span>일정 조율</span>
          </div>
        </div>
      </div>
    </div>
  );
}
