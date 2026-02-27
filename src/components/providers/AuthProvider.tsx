"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { DiscordLinkPromptModal } from "@/components/domain/DiscordLinkPromptModal";

const DISCORD_PROMPT_EXCLUDED_PATHS = ["/onboarding", "/characters"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, clearAuthState, user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [promptDismissedLocally, setPromptDismissedLocally] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isOAuthRedirect = params.get("oauth") === "success";

    // 초기 마운트 시에는 항상 서버에 인증 상태를 확인한다.
    // Zustand persist hydration이 useEffect보다 늦게 완료될 수 있어,
    // isAuthenticated가 localStorage 값을 반영하지 못한 채 false일 수 있다.
    // 이 경우 checkAuth()가 호출되지 않아 stale한 localStorage 데이터로
    // 닉네임 설정 페이지로 잘못 리다이렉트되는 버그를 방지한다.
    if (!hasInitialized.current || isAuthenticated || isOAuthRedirect) {
      hasInitialized.current = true;
      checkAuth();
    } else {
      clearAuthState();
    }

    if (isOAuthRedirect) {
      params.delete("oauth");
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

  const isExcludedPath = DISCORD_PROMPT_EXCLUDED_PATHS.some((p) => pathname.startsWith(p));
  const showDiscordPrompt =
    !isLoading &&
    isAuthenticated &&
    !!user &&
    user.nicknameSet &&
    !user.discordLinked &&
    !user.discordPromptDismissed &&
    !isExcludedPath &&
    !promptDismissedLocally;

  return (
    <>
      {children}
      <DiscordLinkPromptModal
        isOpen={showDiscordPrompt}
        onClose={() => setPromptDismissedLocally(true)}
      />
    </>
  );
}
