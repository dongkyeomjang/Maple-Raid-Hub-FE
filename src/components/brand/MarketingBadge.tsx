"use client";

import { cn } from "@/lib/utils";

interface MarketingBadgeProps {
  variant?: "glow" | "outline" | "solid" | "soft";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export function MarketingBadge({
  variant = "glow",
  size = "md",
  children,
  className,
}: MarketingBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-tiny",
    md: "px-3 py-1 text-caption",
    lg: "px-4 py-1.5 text-body-sm",
  };

  const variantClasses = {
    glow: "bg-gradient-maple text-white shadow-glow font-semibold",
    outline: "border-2 border-primary text-primary font-semibold",
    solid: "bg-primary text-white font-semibold",
    soft: "bg-primary-100 text-primary-700 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full transition-all",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// 프리셋 배지들
export function NewBadge({ className }: { className?: string }) {
  return (
    <MarketingBadge variant="glow" size="sm" className={className}>
      NEW
    </MarketingBadge>
  );
}

export function HotBadge({ className }: { className?: string }) {
  return (
    <MarketingBadge variant="solid" size="sm" className={cn("bg-red-500", className)}>
      HOT
    </MarketingBadge>
  );
}

export function BetaBadge({ className }: { className?: string }) {
  return (
    <MarketingBadge variant="soft" size="sm" className={className}>
      BETA
    </MarketingBadge>
  );
}

export function PowerBadge({ className }: { className?: string }) {
  return (
    <MarketingBadge variant="glow" size="md" className={className}>
      메이플력 MAX
    </MarketingBadge>
  );
}

// 소셜 프루프 배지
export function SocialProofBadge({
  count,
  label,
  className,
}: {
  count: string | number;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-card border border-border shadow-sm",
        className
      )}
    >
      <span className="font-bold text-primary">{count}</span>
      <span className="text-body-sm text-muted-foreground">{label}</span>
    </div>
  );
}

// 기능 하이라이트 배지
export function FeatureHighlightBadge({
  icon,
  text,
  className,
}: {
  icon: React.ReactNode;
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
        "bg-gradient-to-r from-primary-50 to-accent-50",
        "border border-primary-200/50",
        className
      )}
    >
      <span className="text-primary">{icon}</span>
      <span className="text-body-sm font-medium text-primary-700">{text}</span>
    </div>
  );
}
