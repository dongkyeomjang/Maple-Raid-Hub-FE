"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, Calendar, Thermometer, ShieldCheck, Swords, Globe, LucideIcon } from "lucide-react";
import { FEATURE_COPY } from "./brand-constants";

type FeatureKey = keyof typeof FEATURE_COPY;

interface FeatureCardProps {
  feature: FeatureKey;
  variant?: "default" | "compact" | "horizontal";
  className?: string;
}

const featureIcons: Record<FeatureKey, LucideIcon> = {
  chat: MessageCircle,
  schedule: Calendar,
  temperature: Thermometer,
  verification: ShieldCheck,
  party: Swords,
  worldGroup: Globe,
};

const featureColors: Record<FeatureKey, { bg: string; text: string; border: string; icon: string }> = {
  chat: {
    bg: "bg-chat-bg",
    text: "text-chat-text",
    border: "border-chat/20",
    icon: "text-chat",
  },
  schedule: {
    bg: "bg-schedule-bg",
    text: "text-schedule-text",
    border: "border-schedule/20",
    icon: "text-schedule",
  },
  temperature: {
    bg: "bg-primary-50",
    text: "text-primary-700",
    border: "border-primary/20",
    icon: "text-primary",
  },
  verification: {
    bg: "bg-success-bg",
    text: "text-success-text",
    border: "border-success/20",
    icon: "text-success",
  },
  party: {
    bg: "bg-accent-50",
    text: "text-accent-700",
    border: "border-accent/20",
    icon: "text-accent-600",
  },
  worldGroup: {
    bg: "bg-world-eosHelios-bg",
    text: "text-world-eosHelios-text",
    border: "border-world-eosHelios/20",
    icon: "text-world-eosHelios",
  },
};

export function FeatureCard({ feature, variant = "default", className }: FeatureCardProps) {
  const copy = FEATURE_COPY[feature];
  const colors = featureColors[feature];
  const Icon = featureIcons[feature];

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl border transition-all",
          colors.bg,
          colors.border,
          "hover:-translate-y-0.5 hover:shadow-md",
          className
        )}
      >
        <div className={cn("p-2 rounded-lg bg-white/60", colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className={cn("font-semibold text-body-sm", colors.text)}>
            {copy.title}
          </p>
          <p className="text-tiny text-muted-foreground">{copy.subtitle}</p>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div
        className={cn(
          "flex items-start gap-4 p-5 rounded-2xl border transition-all",
          colors.bg,
          colors.border,
          "hover:-translate-y-1 hover:shadow-elevated",
          className
        )}
      >
        <div className={cn("p-3 rounded-xl bg-white/70 shrink-0", colors.icon)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("font-bold text-h3", colors.text)}>{copy.title}</h3>
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                "bg-white/80",
                colors.text
              )}
            >
              {copy.badge}
            </span>
          </div>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            {copy.description}
          </p>
        </div>
      </div>
    );
  }

  // default - 카드형
  return (
    <div
      className={cn(
        "relative overflow-hidden p-6 rounded-2xl border transition-all",
        colors.bg,
        colors.border,
        "hover:-translate-y-1 hover:shadow-elevated",
        className
      )}
    >
      {/* 배지 */}
      <span
        className={cn(
          "absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full",
          "bg-white/80",
          colors.text
        )}
      >
        {copy.badge}
      </span>

      {/* 아이콘 */}
      <div className={cn("p-3 rounded-xl bg-white/70 w-fit mb-4", colors.icon)}>
        <Icon className="w-7 h-7" />
      </div>

      {/* 텍스트 */}
      <h3 className={cn("font-bold text-h2 mb-1", colors.text)}>{copy.title}</h3>
      <p className="text-caption text-muted-foreground mb-3">{copy.subtitle}</p>
      <p className="text-body-sm text-foreground/80 leading-relaxed">
        {copy.description}
      </p>
    </div>
  );
}

// 기능 카드 그리드
export function FeatureGrid({ className }: { className?: string }) {
  const features: FeatureKey[] = ["chat", "schedule", "temperature", "verification"];

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6",
        className
      )}
    >
      {features.map((feature) => (
        <FeatureCard key={feature} feature={feature} />
      ))}
    </div>
  );
}
