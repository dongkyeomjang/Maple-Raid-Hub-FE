import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Header } from "@/components/layout/Header";
import { WebSocketProvider } from "@/lib/websocket/WebSocketProvider";
import { FloatingChatButton, ChatPanel } from "@/components/chat";

export const metadata: Metadata = {
  title: "메-력소 - 보스 파티 매칭 플랫폼",
  description: "메이플스토리 보스 파티 매칭 플랫폼. 장비 인증 기반 신뢰할 수 있는 파티 모집.",
  keywords: ["메이플스토리", "보스", "파티", "매칭", "레이드"],
  openGraph: {
    title: "메-력소 - 보스 파티 매칭 플랫폼",
    description: "장비 인증 기반 신뢰할 수 있는 메이플스토리 보스 파티 매칭",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3B82F6",
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
