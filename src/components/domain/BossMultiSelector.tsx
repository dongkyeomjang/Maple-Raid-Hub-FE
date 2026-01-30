"use client";

import { Badge } from "@/components/ui/badge";
import { useBosses } from "@/lib/hooks/use-config";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { BossConfig } from "@/types/api";

interface BossMultiSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

// 난이도별 색상
const difficultyColors: Record<string, string> = {
  EASY: "bg-green-500/20 text-green-700 border-green-500/30",
  NORMAL: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  HARD: "bg-orange-500/20 text-orange-700 border-orange-500/30",
  CHAOS: "bg-purple-500/20 text-purple-700 border-purple-500/30",
  EXTREME: "bg-red-500/20 text-red-700 border-red-500/30",
};

// 난이도 짧은 이름
const difficultyShortNames: Record<string, string> = {
  EASY: "이지",
  NORMAL: "노말",
  HARD: "하드",
  CHAOS: "카오스",
  EXTREME: "익스",
};

// 보스 패밀리 표시 이름
const bossFamilyNames: Record<string, string> = {
  lotus: "스우",
  damien: "데미안",
  gslime: "가디언 엔젤 슬라임",
  lucid: "루시드",
  will: "윌",
  dusk: "더스크",
  verus_hilla: "진 힐라",
  darknell: "듄켈",
  black_mage: "검은 마법사",
  seren: "선택받은 세렌",
  kalos: "감시자 칼로스",
  adversary: "최초의 대적자",
  kaling: "카링",
  shining_star: "찬란한 흉성",
  limbo: "림보",
  baldrix: "발드릭스",
};

interface BossGroup {
  family: string;
  displayName: string;
  bosses: BossConfig[];
  resetType: string;
}

export function BossMultiSelector({ value, onChange }: BossMultiSelectorProps) {
  const { data: bosses, isLoading } = useBosses();
  const [expandedFamilies, setExpandedFamilies] = useState<Set<string>>(new Set());

  // 보스를 패밀리별로 그룹화
  const bossGroups = useMemo(() => {
    if (!bosses) return [];

    const groups: Record<string, BossGroup> = {};

    for (const boss of bosses) {
      if (!groups[boss.bossFamily]) {
        groups[boss.bossFamily] = {
          family: boss.bossFamily,
          displayName: bossFamilyNames[boss.bossFamily] || boss.bossFamily,
          bosses: [],
          resetType: boss.resetType,
        };
      }
      groups[boss.bossFamily].bosses.push(boss);
    }

    // 난이도 순서대로 정렬
    const difficultyOrder = ["EASY", "NORMAL", "HARD", "CHAOS", "EXTREME"];
    Object.values(groups).forEach((group) => {
      group.bosses.sort(
        (a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty)
      );
    });

    return Object.values(groups);
  }, [bosses]);

  const handleToggle = (bossId: string) => {
    if (value.includes(bossId)) {
      onChange(value.filter((id) => id !== bossId));
    } else {
      onChange([...value, bossId]);
    }
  };

  const toggleFamily = (family: string) => {
    setExpandedFamilies((prev) => {
      const next = new Set(prev);
      if (next.has(family)) {
        next.delete(family);
      } else {
        next.add(family);
      }
      return next;
    });
  };

  // 해당 패밀리에서 선택된 보스 수
  const getSelectedCount = (group: BossGroup) => {
    return group.bosses.filter((boss) => value.includes(boss.id)).length;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        함께 갈 보스를 선택하세요 (다중 선택 가능)
      </p>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {bossGroups.map((group) => {
          const isExpanded = expandedFamilies.has(group.family);
          const selectedCount = getSelectedCount(group);
          const selectedBosses = group.bosses.filter((b) => value.includes(b.id));

          return (
            <div
              key={group.family}
              className={cn(
                "border rounded-lg transition-colors",
                selectedCount > 0 ? "border-primary bg-primary/5" : "border-border"
              )}
            >
              {/* 보스 패밀리 헤더 */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 rounded-t-lg"
                onClick={() => toggleFamily(group.family)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{group.displayName}</span>
                  <Badge variant="outline" className="text-xs">
                    {group.resetType === "MONTHLY" ? "월간" : "주간"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {/* 선택된 난이도 표시 */}
                  {selectedCount > 0 && !isExpanded && (
                    <div className="flex gap-1">
                      {selectedBosses.map((boss) => (
                        <Badge
                          key={boss.id}
                          className={cn("text-xs", difficultyColors[boss.difficulty])}
                        >
                          {difficultyShortNames[boss.difficulty]}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {group.bosses.length}개 난이도
                  </span>
                </div>
              </div>

              {/* 난이도 선택 영역 */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t">
                  <div className="flex flex-wrap gap-2">
                    {group.bosses.map((boss) => {
                      const isSelected = value.includes(boss.id);
                      return (
                        <button
                          type="button"
                          key={boss.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors",
                            isSelected
                              ? difficultyColors[boss.difficulty]
                              : "bg-background hover:bg-muted/50 border-border"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(boss.id);
                          }}
                        >
                          <div
                            className={cn(
                              "h-4 w-4 rounded border flex items-center justify-center",
                              isSelected
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-input"
                            )}
                          >
                            {isSelected && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {difficultyShortNames[boss.difficulty]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 선택된 보스 요약 */}
      {value.length > 0 && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">선택된 보스 ({value.length}개)</p>
          <div className="flex flex-wrap gap-1">
            {value.map((id) => {
              const boss = bosses?.find((b) => b.id === id);
              if (!boss) return null;
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => handleToggle(id)}
                >
                  {boss.shortName}
                  <span className="ml-1 text-muted-foreground">×</span>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
