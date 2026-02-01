"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "default" | "wordmark" | "tagline";
  className?: string;
}

const iconSizes = {
  sm: { wrapper: "w-7 h-7", icon: 28 },
  md: { wrapper: "w-9 h-9", icon: 36 },
  lg: { wrapper: "w-12 h-12", icon: 48 },
  xl: { wrapper: "w-16 h-16", icon: 64 },
};

const textSizeClasses = {
  sm: "text-body-sm",
  md: "text-h3",
  lg: "text-h2",
  xl: "text-h1",
};

export function Logo({ size = "md", showText = true, variant = "default", className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <LogoIcon size={size} />
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold tracking-tight text-foreground leading-none",
              textSizeClasses[size]
            )}
          >
            력소
          </span>
          {variant === "tagline" && (
            <span className="text-tiny text-muted-foreground mt-0.5">
              당신만을 위한 메이플 인력소
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 메-력소 로고 아이콘 - 동글동글 귀여운 버전
 */
export function LogoIcon({ size = "md", className }: Omit<LogoProps, "showText" | "variant">) {
  const { wrapper, icon } = iconSizes[size];

  return (
    <div className={cn("relative select-none", wrapper, className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="logoOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* 배경 */}
        <rect width="32" height="32" rx="8" fill="url(#logoOrangeGrad)" />

        {/* "메-" 동글동글 */}
        <g fill="white" transform="translate(3, 7)">
          {/* ㅁ */}
          <rect x="0" y="0" width="9" height="3" rx="1.5" />
          <rect x="0" y="0" width="3" height="9" rx="1.5" />
          <rect x="6" y="0" width="3" height="9" rx="1.5" />
          <rect x="0" y="6" width="9" height="3" rx="1.5" />
          {/* ㅔ */}
          <rect x="10" y="3" width="4" height="3" rx="1.5" />
          <rect x="11.5" y="0" width="3" height="9" rx="1.5" />
          <rect x="16" y="0" width="3" height="9" rx="1.5" />
          {/* - */}
          <rect x="20" y="3" width="6" height="3" rx="1.5" />
        </g>

        {/* 장식 점 */}
        <circle cx="16" cy="24" r="1.5" fill="white" opacity="0.6" />
      </svg>
    </div>
  );
}

// 마케팅용 확장 로고 (애니메이션 포함)
export function LogoAnimated({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="animate-bounce-subtle">
        <LogoIcon size="xl" />
      </div>
      <div className="flex flex-col">
        <span className="text-display font-bold tracking-tight text-foreground">
          메-력소
        </span>
        <span className="text-body text-muted-foreground">
          당신만을 위한 메이플 인력소 💪
        </span>
      </div>
    </div>
  );
}

// 워드마크 전용 (아이콘 없이 텍스트만)
export function LogoWordmark({ size = "md", className }: Omit<LogoProps, "showText" | "variant">) {
  return (
    <span
      className={cn(
        "font-bold tracking-tight text-gradient-maple",
        textSizeClasses[size],
        className
      )}
    >
      메-력소
    </span>
  );
}

// 풀 네임 로고 (메이플인력소 전체)
export function LogoFull({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon size="lg" />
      <div className="flex flex-col">
        <span className="text-tiny text-muted-foreground leading-none">메이플</span>
        <span className="text-h2 font-bold tracking-tight text-foreground leading-none">
          인력소
        </span>
      </div>
    </div>
  );
}
