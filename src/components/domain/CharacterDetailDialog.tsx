"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorldGroupBadge } from "./WorldGroupBadge";
import { VerificationBadge } from "./VerificationBadge";
import { EquipmentGrid } from "./EquipmentGrid";
import type { PublicCharacterResponse, EquipmentInfo } from "@/types/api";
import { User, Swords, Info } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface CharacterDetailDialogProps {
  character: PublicCharacterResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CharacterDetailDialog({
  character,
  open,
  onOpenChange,
}: CharacterDetailDialogProps) {
  if (!character) return null;

  let equipment: EquipmentInfo | null = null;
  try {
    if (character.equipmentJson) {
      equipment = JSON.parse(character.equipmentJson);
    }
  } catch {
    // parsing failed
  }

  const formatCombatPower = (power: number) => {
    if (power >= 100000000) {
      return `${(power / 100000000).toFixed(1)}억`;
    }
    if (power >= 10000) {
      return `${Math.floor(power / 10000)}만 ${(power % 10000).toLocaleString()}`;
    }
    return power.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">캐릭터 상세 정보</DialogTitle>
        </DialogHeader>

        {/* 캐릭터 기본 정보 */}
        <div className="flex items-start gap-4 pb-4 border-b">
          <Avatar className="h-20 w-20">
            {character.characterImageUrl ? (
              <AvatarImage
                src={character.characterImageUrl}
                alt={character.characterName}
              />
            ) : null}
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{character.characterName}</h2>
              <VerificationBadge status={character.verificationStatus} />
            </div>
            <p className="text-lg text-muted-foreground">
              Lv.{character.characterLevel} {character.characterClass}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <WorldGroupBadge worldGroup={character.worldGroup} />
              <span className="text-sm text-muted-foreground">
                {character.worldName}
              </span>
            </div>
          </div>
        </div>

        {/* 전투력 */}
        {character.combatPower > 0 && (
          <div className="py-4 px-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
            <div className="flex items-center gap-3">
              <Swords className="h-6 w-6 text-orange-500" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">전투력</p>
                <p className="text-2xl font-bold text-orange-500">
                  {formatCombatPower(character.combatPower)}
                </p>
              </div>
              {character.lastSyncedAt && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{formatDateTime(character.lastSyncedAt)}</p>
                </div>
              )}
            </div>
            <div className="flex items-start gap-1.5 mt-3 pt-3 border-t border-orange-500/20">
              <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                갱신 당시 라이브 서버 전투력입니다. 자동 갱신 주기는 24시간입니다.
              </p>
            </div>
          </div>
        )}

        {/* 장비 정보 */}
        {equipment && equipment.slots && Object.keys(equipment.slots).length > 0 && (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg">장착 장비</h3>
              <p className="text-sm text-muted-foreground">
                아이콘에 마우스를 올리면 간략 정보, 클릭하면 상세 정보를 확인할 수 있습니다.
              </p>
            </div>
            <EquipmentGrid equipment={equipment} />
          </div>
        )}

        {/* 장비 정보가 없는 경우 */}
        {(!equipment || !equipment.slots || Object.keys(equipment.slots).length === 0) && (
          <div className="py-8 text-center text-muted-foreground">
            장비 정보가 없습니다.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
