import { MessageCircleQuestion } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container flex items-center justify-center gap-2 py-4 text-body-sm text-muted-foreground">
        <a
          href="https://open.kakao.com/o/sv6bswli"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <MessageCircleQuestion className="h-4 w-4" />
          문의하기 (카카오톡 오픈채팅)
        </a>
      </div>
    </footer>
  );
}
