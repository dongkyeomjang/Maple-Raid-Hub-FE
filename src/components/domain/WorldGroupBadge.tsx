"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { WorldGroup } from "@/types/api";
import { getWorldGroupDisplayName } from "@/lib/utils";

const WORLD_GROUP_ICONS: Record<WorldGroup, string> = {
  NORMAL: "/돌의정령.png",
  EOS_HELIOS: "/핑크빈.png",
  CHALLENGER: "/server-logo/챌린저스.png",
};

interface WorldGroupBadgeProps {
  worldGroup: WorldGroup;
  showEmoji?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const iconSizeMap = {
  sm: 18,
  default: 20,
  lg: 22,
};

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

  const iconSrc = WORLD_GROUP_ICONS[worldGroup];
  const iconPx = iconSizeMap[size];

  return (
    <Badge variant={variant} size={size} className={className}>
      {showEmoji && iconSrc && (
        <Image
          src={iconSrc}
          alt={getWorldGroupDisplayName(worldGroup)}
          width={iconPx}
          height={iconPx}
          className="inline-block flex-shrink-0 mr-0.5"
        />
      )}
      {getWorldGroupDisplayName(worldGroup)}
    </Badge>
  );
}
