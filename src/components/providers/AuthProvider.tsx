"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, clearAuthState, user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // localStorage에 인증 정보가 있을 때만 서버에 확인
    // 인증 정보가 없으면 불필요한 401 에러 방지
    if (isAuthenticated) {
      checkAuth();
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

  return <>{children}</>;
}
