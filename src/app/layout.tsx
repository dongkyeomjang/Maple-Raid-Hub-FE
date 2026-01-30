import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Header } from "@/components/layout/Header";
import { WebSocketProvider } from "@/lib/websocket/WebSocketProvider";
import { FloatingChatButton, ChatPanel } from "@/components/chat";

export const metadata: Metadata = {
  title: "메-력소 | 월드통합 보스 파티 매칭",
  description: "서로 다른 월드 유저들과 실시간 채팅하고 일정을 조율하세요. 메이플스토리 월드통합 보스 파티 매칭 플랫폼.",
  keywords: ["메이플스토리", "보스", "파티", "매칭", "레이드", "월드통합", "채팅", "일정조율", "메력소"],
  openGraph: {
    title: "메-력소 | 월드통합 보스 파티 매칭",
    description: "서로 다른 월드 유저들과 실시간 채팅하고 일정을 조율하세요. 인게임에서 불가능했던 크로스 월드 소통!",
    type: "website",
    siteName: "메-력소",
  },
  twitter: {
    card: "summary_large_image",
    title: "메-력소 | 월드통합 보스 파티 매칭",
    description: "서로 다른 월드 유저들과 실시간 채팅하고 일정을 조율하세요.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F97316",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            <WebSocketProvider>
              <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
              <FloatingChatButton />
              <ChatPanel />
            </WebSocketProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
