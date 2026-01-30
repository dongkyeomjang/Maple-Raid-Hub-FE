"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useBosses, useBundles } from "@/lib/hooks/use-config";
import { Skeleton } from "@/components/ui/skeleton";
import { Swords, Package } from "lucide-react";

interface BossBundleSelectorProps {
  value: { type: "boss" | "bundle"; id: string } | null;
  onChange: (value: { type: "boss" | "bundle"; id: string } | null) => void;
}

export function BossBundleSelector({ value, onChange }: BossBundleSelectorProps) {
  const { data: bosses, isLoading: bossesLoading } = useBosses();
  const { data: bundles, isLoading: bundlesLoading } = useBundles();

  const [activeTab, setActiveTab] = useState<"boss" | "bundle">(
    value?.type || "boss"
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "boss" | "bundle");
    onChange(null);
  };

  const handleBossChange = (bossId: string) => {
    onChange({ type: "boss", id: bossId });
  };

  const handleBundleChange = (bundleId: string) => {
    onChange({ type: "bundle", id: bundleId });
  };

  if (bossesLoading || bundlesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="boss" className="gap-2">
          <Swords className="h-4 w-4" />
          단일 보스
        </TabsTrigger>
        <TabsTrigger value="bundle" className="gap-2">
          <Package className="h-4 w-4" />
          보스 묶음
        </TabsTrigger>
      </TabsList>

      <TabsContent value="boss" className="mt-4">
        <div className="space-y-2">
          <Label>보스 선택</Label>
          <Select
            value={value?.type === "boss" ? value.id : ""}
            onValueChange={handleBossChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="보스를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {bosses?.map((boss) => (
                <SelectItem key={boss.id} value={boss.id}>
                  <div className="flex items-center gap-2">
                    <span>{boss.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({boss.difficulty}, {boss.partySize}인)
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {value?.type === "boss" && (
          <Card className="mt-4">
            <CardContent className="pt-4">
              {(() => {
                const selectedBoss = bosses?.find((b) => b.id === value.id);
                if (!selectedBoss) return null;
                return (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">난이도</span>
                      <span className="font-medium">{selectedBoss.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">파티 인원</span>
                      <span className="font-medium">{selectedBoss.partySize}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">초기화</span>
                      <span className="font-medium">
                        {selectedBoss.resetType === "MONTHLY" ? "월간" : "주간"}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="bundle" className="mt-4">
        <div className="space-y-2">
          <Label>보스 묶음 선택</Label>
          <Select
            value={value?.type === "bundle" ? value.id : ""}
            onValueChange={handleBundleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="보스 묶음을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {bundles?.map((bundle) => (
                <SelectItem key={bundle.id} value={bundle.id}>
                  <div className="flex items-center gap-2">
                    <span>{bundle.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({bundle.bossIds.length}개)
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {value?.type === "bundle" && (
          <Card className="mt-4">
            <CardContent className="pt-4">
              {(() => {
                const selectedBundle = bundles?.find((b) => b.id === value.id);
                if (!selectedBundle) return null;
                return (
                  <div className="space-y-2 text-sm">
                    {selectedBundle.description && (
                      <p className="text-muted-foreground">{selectedBundle.description}</p>
                    )}
                    <div>
                      <span className="text-muted-foreground">포함된 보스:</span>
                      <ul className="mt-1 space-y-1">
                        {selectedBundle.bossIds.map((bossId) => {
                          const boss = bosses?.find((b) => b.id === bossId);
                          return (
                            <li key={bossId} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              <span>{boss?.name || bossId}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
