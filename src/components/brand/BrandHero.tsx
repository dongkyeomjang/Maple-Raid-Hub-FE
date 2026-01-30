"use client";

import { cn } from "@/lib/utils";
import { Logo, LogoAnimated } from "@/components/ui/Logo";
import { BRAND_SLOGANS, CTA_TEXTS } from "./brand-constants";

interface BrandHeroProps {
  variant?: "full" | "compact" | "minimal";
  showCta?: boolean;
  onCtaClick?: () => void;
  className?: string;
}

export function BrandHero({
  variant = "full",
  showCta = true,
  onCtaClick,
  className,
}: BrandHeroProps) {
  if (variant === "minimal") {
    return (
      <div className={cn("text-center", className)}>
        <Logo size="lg" variant="tagline" className="justify-center" />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("text-center space-y-4", className)}>
        <Logo size="xl" className="justify-center" />
        <p className="text-body text-muted-foreground">
          {BRAND_SLOGANS.main}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("text-center space-y-8", className)}>
      {/* 애니메이션 로고 */}
      <LogoAnimated className="justify-center" />

      {/* 메인 슬로건 */}
      <div className="space-y-3">
        <h1 className="text-display md:text-[2.5rem] text-foreground">
          {BRAND_SLOGANS.main}
        </h1>
        <p className="text-body-lg text-muted-foreground max-w-md mx-auto">
          {BRAND_SLOGANS.connect}
        </p>
      </div>

      {/* CTA 버튼 */}
      {showCta && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onCtaClick}
            className="btn-base px-6 py-3 rounded-xl bg-gradient-maple text-white font-semibold shadow-glow hover:shadow-glow-lg transition-shadow"
          >
            {CTA_TEXTS.primary}
          </button>
          <button className="btn-base px-6 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors">
            {CTA_TEXTS.secondary}
          </button>
        </div>
      )}

      {/* 서브 슬로건들 (랜덤 또는 순환) */}
      <div className="flex flex-wrap justify-center gap-2">
        <span className="highlight-badge text-tiny">
          {BRAND_SLOGANS.powerShort}
        </span>
      </div>
    </div>
  );
}

// 랜딩 페이지용 풀 히어로 섹션
export function LandingHero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative min-h-[80vh] flex items-center justify-center px-4 py-16",
        "bg-gradient-warm bg-maple-pattern",
        className
      )}
    >
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <BrandHero variant="full" />
      </div>
    </section>
  );
}
