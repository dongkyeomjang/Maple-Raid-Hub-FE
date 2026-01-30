"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode | LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
    disabled?: boolean;
    disabledTooltip?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function EmptyState({
  icon: IconProp,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  className,
}: EmptyStateProps) {
  const sizeConfig = {
    sm: {
      container: "py-8",
      iconWrapper: "w-12 h-12",
      iconSize: "h-6 w-6",
      title: "text-body font-medium",
      description: "text-caption",
    },
    md: {
      container: "py-12",
      iconWrapper: "w-16 h-16",
      iconSize: "h-8 w-8",
      title: "text-h3 font-semibold",
      description: "text-body-sm",
    },
    lg: {
      container: "py-16",
      iconWrapper: "w-20 h-20",
      iconSize: "h-10 w-10",
      title: "text-h2 font-semibold",
      description: "text-body",
    },
  };

  const config = sizeConfig[size];

  const renderIcon = () => {
    if (!IconProp) return null;

    // If it's a LucideIcon component
    if (typeof IconProp === "function") {
      const Icon = IconProp as LucideIcon;
      return <Icon className={cn(config.iconSize, "text-muted-foreground/60")} />;
    }

    // If it's already a React node
    return IconProp;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        config.container,
        className
      )}
    >
      {IconProp && (
        <div
          className={cn(
            "rounded-full bg-muted/80 flex items-center justify-center mb-4",
            config.iconWrapper
          )}
        >
          {renderIcon()}
        </div>
      )}

      <h3 className={cn("mb-2 text-foreground", config.title)}>{title}</h3>

      {description && (
        <p
          className={cn(
            "text-muted-foreground mb-6 max-w-sm leading-relaxed",
            config.description
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            action.disabled && action.disabledTooltip ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0}>
                      <Button
                        disabled
                        variant={action.variant || "default"}
                        size={size === "sm" ? "sm" : "default"}
                      >
                        {action.label}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.disabledTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                onClick={action.onClick}
                variant={action.variant || "default"}
                size={size === "sm" ? "sm" : "default"}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            )
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="ghost"
              size={size === "sm" ? "sm" : "default"}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
