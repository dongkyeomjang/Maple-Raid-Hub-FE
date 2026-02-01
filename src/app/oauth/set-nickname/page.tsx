"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/hooks/use-auth";
import { api } from "@/lib/api/client";
import { Loader2, Sparkles } from "lucide-react";
import type { UserResponse } from "@/types/api";

export default function SetNicknamePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (nickname.length < 2 || nickname.length > 20) {
      setError("닉네임은 2~20자 사이여야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      // OAuth 신규 가입 완료 API 호출 (쿠키의 임시 토큰 사용)
      const result = await api.auth.oauthComplete(nickname);

      if (result.success) {
        // 서버가 쿠키에 정상 토큰 설정함 - 사용자 정보 가져오기
        const meResult = await api.auth.me();
        if (meResult.success && meResult.data) {
          setUser(meResult.data as UserResponse);
          await queryClient.invalidateQueries();
          // 신규 가입과 동일하게 환영 페이지로 이동
          router.push("/onboarding?step=complete");
        }
      } else if (!result.success) {
        if (result.error.code === "AUTH_NICKNAME_DUPLICATE") {
          setError("이미 사용 중인 닉네임입니다.");
        } else if (result.error.code === "AUTH_INVALID_TOKEN") {
          setError("세션이 만료되었습니다. 다시 로그인해주세요.");
          router.push("/login");
        } else {
          setError(result.error.message || "닉네임 설정에 실패했습니다.");
        }
      }
    } catch (err) {
      setError("닉네임 설정 중 오류가 발생했습니다.");
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
        {/* 로고 */}
        <div className="flex flex-col items-center mb-6">
          <Logo size="lg" />
          <p className="text-caption text-muted-foreground mt-1">
            거의 다 왔어요!
          </p>
        </div>

        <Card className="shadow-elevated border-0 card-cute">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-h1">닉네임을 설정해주세요</CardTitle>
            <CardDescription className="text-body">
              다른 유저들에게 보여질 닉네임이에요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="2~20자 사이로 입력해주세요"
                  maxLength={20}
                  required
                  className="h-12 input-warm"
                  autoFocus
                />
                <p className="text-caption text-muted-foreground">
                  {nickname.length}/20
                </p>
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
                    설정 중...
                  </>
                ) : (
                  <>
                    시작하기
                    <Sparkles className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
