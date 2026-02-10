"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { DiscordLinkPromptModal } from "@/components/domain/DiscordLinkPromptModal";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, clearAuthState, user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showDiscordPrompt, setShowDiscordPrompt] = useState(false);

  useEffect(() => {
    // OAuth 리다이렉트에서 왔는지 확인 (클라이언트에서만)
    const params = new URLSearchParams(window.location.search);
    const isOAuthRedirect = params.get("oauth") === "success";

    if (isAuthenticated || isOAuthRedirect) {
      checkAuth();

      // OAuth 파라미터 제거 (URL 정리)
      if (isOAuthRedirect) {
        params.delete("oauth");
        const newUrl = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;
        router.replace(newUrl);
      }
    } else {
      clearAuthState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 닉네임 설정이 필요한 사용자를 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !user.nicknameSet) {
      // set-nickname 페이지가 아닌 경우에만 리다이렉트
      const excludedPaths = ["/oauth/set-nickname", "/oauth/callback"];
      if (!excludedPaths.includes(pathname)) {
        router.push("/oauth/set-nickname");
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  // 디스코드 연동 유도 모달 (최초 1회)
  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      user &&
      user.nicknameSet &&
      !user.discordLinked &&
      !user.discordPromptDismissed
    ) {
      setShowDiscordPrompt(true);
    }
  }, [isLoading, isAuthenticated, user]);

  return (
    <>
      {children}
      <DiscordLinkPromptModal
        isOpen={showDiscordPrompt}
        onClose={() => setShowDiscordPrompt(false)}
      />
    </>
  );
}
