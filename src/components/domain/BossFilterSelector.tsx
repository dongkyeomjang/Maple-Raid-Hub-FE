"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBosses } from "@/lib/hooks/use-config";
import { cn } from "@/lib/utils";
import { Filter, X } from "lucide-react";
import type { BossConfig } from "@/types/api";

interface BossFilterSelectorProps {
  value: string[];
  onChange: (bossIds: string[]) => void;
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-500/20 text-green-700 border-green-500/30",
  NORMAL: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  HARD: "bg-orange-500/20 text-orange-700 border-orange-500/30",
  CHAOS: "bg-purple-500/20 text-purple-700 border-purple-500/30",
  EXTREME: "bg-red-500/20 text-red-700 border-red-500/30",
};

const difficultyShortNames: Record<string, string> = {
  EASY: "이지",
  NORMAL: "노말",
  HARD: "하드",
  CHAOS: "카오스",
  EXTREME: "익스",
};

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
}

export function BossFilterSelector({ value, onChange }: BossFilterSelectorProps) {
  const { data: bosses } = useBosses();

  const bossGroups = useMemo(() => {
    if (!bosses) return [];

    const groups: Record<string, BossGroup> = {};

    for (const boss of bosses) {
      if (!groups[boss.bossFamily]) {
        groups[boss.bossFamily] = {
          family: boss.bossFamily,
          displayName: bossFamilyNames[boss.bossFamily] || boss.bossFamily,
          bosses: [],
        };
      }
      groups[boss.bossFamily].bosses.push(boss);
    }

    const difficultyOrder = ["EASY", "NORMAL", "HARD", "CHAOS", "EXTREME"];
    Object.values(groups).forEach((group) => {
      group.bosses.sort(
        (a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty)
      );
    });

    return Object.values(groups).reverse();
  }, [bosses]);

  const handleToggle = (bossId: string) => {
    if (value.includes(bossId)) {
      onChange(value.filter((id) => id !== bossId));
    } else {
      onChange([...value, bossId]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getBossLabel = (bossId: string) => {
    const boss = bosses?.find((b) => b.id === bossId);
    if (!boss) return bossId;
    return boss.shortName;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            보스 필터
            {value.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {value.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-sm font-medium">보스 필터</span>
            {value.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs text-muted-foreground"
                onClick={handleClearAll}
              >
                전체 해제
              </Button>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
            {bossGroups.map((group) => (
              <div key={group.family} className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {group.displayName}
                  </span>
                  <div className="flex gap-1">
                    {group.bosses.map((boss) => {
                      const isSelected = value.includes(boss.id);
                      return (
                        <button
                          type="button"
                          key={boss.id}
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium border transition-colors",
                            isSelected
                              ? difficultyColors[boss.difficulty]
                              : "bg-background hover:bg-muted border-border text-muted-foreground"
                          )}
                          onClick={() => handleToggle(boss.id)}
                        >
                          {difficultyShortNames[boss.difficulty]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {value.map((bossId) => (
        <Badge
          key={bossId}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-destructive/20"
          onClick={() => handleToggle(bossId)}
        >
          {getBossLabel(bossId)}
          <X className="h-3 w-3" />
        </Badge>
      ))}

      {value.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 text-xs text-muted-foreground"
          onClick={handleClearAll}
        >
          전체 해제
        </Button>
      )}
    </div>
  );
}
