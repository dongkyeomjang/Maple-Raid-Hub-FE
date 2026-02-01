"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 항상 서버에서 인증 상태 확인 (OAuth 리다이렉트 후에도 동작하도록)
    checkAuth();
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

  return <>{children}</>;
}
