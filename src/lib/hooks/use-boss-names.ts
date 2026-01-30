"use client";

import { useMemo, useCallback } from "react";
import { useBosses } from "./use-config";

/**
 * bossId를 한글 이름(shortName)으로 변환하는 훅
 */
export function useBossNames() {
  const { data: bosses, isLoading } = useBosses();

  const bossMap = useMemo(() => {
    if (!bosses) return new Map<string, string>();
    return new Map(bosses.map((boss) => [boss.id, boss.shortName]));
  }, [bosses]);

  const getBossName = useCallback(
    (bossId: string): string => {
      return bossMap.get(bossId) || bossId;
    },
    [bossMap]
  );

  const getBossNames = useCallback(
    (bossIds: string[]): string[] => {
      return bossIds.map((id) => bossMap.get(id) || id);
    },
    [bossMap]
  );

  const formatBossNames = useCallback(
    (bossIds: string[], separator = ", "): string => {
      if (bossIds.length === 0) return "보스";
      return bossIds.map((id) => bossMap.get(id) || id).join(separator);
    },
    [bossMap]
  );

  return {
    getBossName,
    getBossNames,
    formatBossNames,
    isLoading,
  };
}
