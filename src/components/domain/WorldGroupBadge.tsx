"use client";

import { Badge } from "@/components/ui/badge";
import type { WorldGroup } from "@/types/api";
import { getWorldGroupDisplayName, getWorldGroupEmoji } from "@/lib/utils";

interface WorldGroupBadgeProps {
  worldGroup: WorldGroup;
  showEmoji?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function WorldGroupBadge({
  worldGroup,
  showEmoji = false,
  size = "default",
  className,
}: WorldGroupBadgeProps) {
  const variant =
    worldGroup === "CHALLENGER"
      ? "challenger"
      : worldGroup === "EOS_HELIOS"
        ? "eosHelios"
        : "normal";

  const emoji = getWorldGroupEmoji(worldGroup);

  return (
    <Badge variant={variant} size={size} className={className}>
      {showEmoji && emoji && <span className="mr-0.5">{emoji}</span>}
      {getWorldGroupDisplayName(worldGroup)}
    </Badge>
  );
}
