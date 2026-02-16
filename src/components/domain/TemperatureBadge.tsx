"use client";

import { Thermometer } from "lucide-react";
import { cn, getTemperatureColor, getTemperatureLabel, getTemperatureBgColor } from "@/lib/utils";

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
  showLabel = false,
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
      icon: "h-3 w-3",
      gap: "gap-0.5",
      padding: variant === "pill" ? "px-1.5 py-0.5" : "",
    },
    md: {
      text: "text-caption",
      icon: "h-3.5 w-3.5",
      gap: "gap-1",
      padding: variant === "pill" ? "px-2 py-0.5" : "",
    },
    lg: {
      text: "text-body-sm",
      icon: "h-4 w-4",
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
        {showIcon && <Thermometer className={cn(config.icon, colorClass)} />}
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
      {showIcon && <Thermometer className={cn(config.icon, colorClass)} />}
      <span className={cn("font-semibold tabular-nums", colorClass)}>
        {temperature.toFixed(decimals)}°C
      </span>
      {showLabel && (
        <span className="text-muted-foreground">({label})</span>
      )}
    </div>
  );
}
