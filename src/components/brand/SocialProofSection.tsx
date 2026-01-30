"use client";

import { SocialProofBadge } from "./MarketingBadge";
import { useSiteStats, formatUserCount, formatTemperature } from "@/lib/hooks/use-stats";

export function SocialProofSection() {
  const { data: stats, isLoading } = useSiteStats();

  if (isLoading || !stats) {
    return (
      <div className="flex flex-wrap justify-center gap-3 -mt-1">
        <SocialProofBadge count="---" label="유저가 함께해요" />
        <SocialProofBadge count="--.-°C" label="평균 매너 온도" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 -mt-1">
      <SocialProofBadge
        count={formatUserCount(stats.userCount)}
        label="유저가 함께해요"
      />
      <SocialProofBadge
        count={formatTemperature(stats.averageTemperature)}
        label="평균 매너 온도"
      />
    </div>
  );
}
