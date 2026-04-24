"use client";

import { cn, getTemperatureColor, getTemperatureLabel, getTemperatureBgColor } from "@/lib/utils";
import { TemperatureFace } from "./TemperatureFace";

interface TemperatureBadgeProps {
  temperature: number;
  showLabel?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "pill";
  decimals?: number;
  className?: string;
}

export function TemperatureBadge({
  temperature,
  showLabel = true,
  showIcon = true,
  size = "md",
  variant = "default",
  decimals = 1,
  className,
}: TemperatureBadgeProps) {
  const colorClass = getTemperatureColor(temperature);
  const bgColorClass = getTemperatureBgColor(temperature);
  const label = getTemperatureLabel(temperature);

  const sizeConfig = {
    sm: {
      text: "text-tiny",
      iconPx: 14,
      gap: "gap-0.5",
      padding: variant === "pill" ? "px-1.5 py-0.5" : "",
    },
    md: {
      text: "text-caption",
      iconPx: 16,
      gap: "gap-1",
      padding: variant === "pill" ? "px-2 py-0.5" : "",
    },
    lg: {
      text: "text-body-sm",
      iconPx: 20,
      gap: "gap-1.5",
      padding: variant === "pill" ? "px-2.5 py-1" : "",
    },
  };

  const config = sizeConfig[size];

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full",
          config.gap,
          config.text,
          config.padding,
          bgColorClass,
          className
        )}
      >
        {showIcon && <TemperatureFace temperature={temperature} size={config.iconPx} />}
        <span className={cn("font-semibold tabular-nums", colorClass)}>
          {temperature.toFixed(decimals)}°C
        </span>
        {showLabel && (
          <span className={cn("font-normal", colorClass, "opacity-80")}>
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center",
        config.gap,
        config.text,
        className
      )}
    >
      {showIcon && <TemperatureFace temperature={temperature} size={config.iconPx} />}
      <span className={cn("font-semibold tabular-nums", colorClass)}>
        {temperature.toFixed(decimals)}°C
      </span>
      {showLabel && (
        <span className="text-muted-foreground">({label})</span>
      )}
    </div>
  );
}
