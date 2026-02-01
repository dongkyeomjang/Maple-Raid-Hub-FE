"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// OAuth 콜백 페이지
// 백엔드가 쿠키 설정 후 바로 리다이렉트하므로 이 페이지는 거의 보이지 않음
// 만약 직접 접근하면 메인 페이지로 보냄
export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // 직접 접근한 경우 메인으로 리다이렉트
    router.push("/posts");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">로그인 처리 중...</p>
      </div>
    </div>
  );
}
