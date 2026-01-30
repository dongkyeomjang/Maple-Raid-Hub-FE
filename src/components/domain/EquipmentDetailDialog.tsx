"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EquipmentSlot, PotentialGrade } from "@/types/api";
import { StarforceDisplay } from "./StarforceDisplay";

interface EquipmentDetailDialogProps {
  slot: EquipmentSlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const gradeColors: Record<PotentialGrade, string> = {
  "레어": "text-blue-400",
  "에픽": "text-purple-400",
  "유니크": "text-yellow-400",
  "레전드리": "text-green-400",
};

const gradeBgColors: Record<PotentialGrade, string> = {
  "레어": "bg-blue-950/50 border-blue-800",
  "에픽": "bg-purple-950/50 border-purple-800",
  "유니크": "bg-yellow-950/50 border-yellow-800",
  "레전드리": "bg-green-950/50 border-green-800",
};

// 스탯 이름 한글화
const statNameMap: Record<string, string> = {
  str: "STR",
  dex: "DEX",
  int: "INT",
  luk: "LUK",
  max_hp: "최대 HP",
  max_mp: "최대 MP",
  attack_power: "공격력",
  magic_power: "마력",
  armor: "방어력",
  speed: "이동속도",
  jump: "점프력",
  boss_damage: "보스 공격 시 데미지",
  ignore_monster_armor: "몬스터 방어율 무시",
  all_stat: "올스탯",
  damage: "데미지",
  equipment_level_decrease: "장비 레벨 감소",
};

// 스탯 분해 표시를 위한 헬퍼 함수
function getStatBreakdown(
  statKey: string,
  baseOption: Record<string, string>,
  addOption: Record<string, string>,
  etcOption: Record<string, string>,
  starforceOption: Record<string, string>
): { base: number; add: number; etc: number; star: number } {
  return {
    base: parseInt(baseOption[statKey] || "0", 10),
    add: parseInt(addOption[statKey] || "0", 10),
    etc: parseInt(etcOption[statKey] || "0", 10),
    star: parseInt(starforceOption[statKey] || "0", 10),
  };
}

export function EquipmentDetailDialog({
  slot,
  open,
  onOpenChange,
}: EquipmentDetailDialogProps) {
  if (!slot) return null;

  const { itemName, itemIcon, details } = slot;
  const starforce = parseInt(details.starforce || "0", 10);
  const scrollUpgrade = parseInt(details.scrollUpgrade || "0", 10);
  const potentialGrade = details.potentialOptionGrade as PotentialGrade | null;
  const additionalGrade = details.additionalPotentialOptionGrade as PotentialGrade | null;
  const totalOption = details.itemTotalOption || {};
  const baseOption = details.itemBaseOption || {};
  const addOption = details.itemAddOption || {};
  const etcOption = details.itemEtcOption || {};
  const starforceOption = details.itemStarforceOption || {};

  // 분해된 스탯이 있는지 확인
  const hasBreakdown =
    Object.keys(baseOption).length > 0 ||
    Object.keys(addOption).length > 0 ||
    Object.keys(etcOption).length > 0 ||
    Object.keys(starforceOption).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-700 text-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {itemIcon && (
              <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
                <img
                  src={itemIcon}
                  alt={itemName}
                  className="w-16 h-16 object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              {starforce > 0 && (
                <div className="mb-2">
                  <StarforceDisplay starforce={starforce} size="md" />
                </div>
              )}
              <DialogTitle className="text-lg">{itemName}</DialogTitle>
              {scrollUpgrade > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  주문서 강화: +{scrollUpgrade}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* 스탯 상세 (분해 표시) */}
          {Object.keys(totalOption).length > 0 && (
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                스탯 상세
              </h4>
              <div className="space-y-1.5 text-sm">
                {Object.entries(totalOption).map(([key, totalValue]) => {
                  const breakdown = hasBreakdown
                    ? getStatBreakdown(key, baseOption, addOption, etcOption, starforceOption)
                    : null;

                  // 분해된 값들 중 0이 아닌 것만 표시
                  const parts: string[] = [];
                  if (breakdown) {
                    if (breakdown.base > 0) parts.push(`${breakdown.base}`);
                    if (breakdown.add > 0) parts.push(`${breakdown.add}`);
                    if (breakdown.etc > 0) parts.push(`${breakdown.etc}`);
                    if (breakdown.star > 0) parts.push(`${breakdown.star}`);
                  }

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-400">
                        {statNameMap[key] || key}
                      </span>
                      <div className="text-right">
                        <span className="text-white font-medium">+{totalValue}</span>
                        {breakdown && parts.length > 1 && (
                          <span className="text-gray-500 text-xs ml-2">
                            ({parts.join(" + ")})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {hasBreakdown && (
                <p className="text-[10px] text-gray-500 mt-2">
                  (기본 + 추옵 + 주문서 + 스타포스)
                </p>
              )}
            </div>
          )}

          {/* 잠재능력 */}
          {potentialGrade && (
            <div
              className={`p-3 rounded-lg border ${
                gradeBgColors[potentialGrade] || "bg-gray-800 border-gray-700"
              }`}
            >
              <h4
                className={`text-sm font-semibold mb-2 ${
                  gradeColors[potentialGrade] || "text-gray-300"
                }`}
              >
                잠재능력 ({potentialGrade})
              </h4>
              <ul className="text-sm space-y-1">
                {details.potentialOption1 && (
                  <li className="text-gray-200">{details.potentialOption1}</li>
                )}
                {details.potentialOption2 && (
                  <li className="text-gray-200">{details.potentialOption2}</li>
                )}
                {details.potentialOption3 && (
                  <li className="text-gray-200">{details.potentialOption3}</li>
                )}
              </ul>
            </div>
          )}

          {/* 에디셔널 잠재능력 */}
          {additionalGrade && (
            <div
              className={`p-3 rounded-lg border ${
                gradeBgColors[additionalGrade] || "bg-gray-800 border-gray-700"
              }`}
            >
              <h4
                className={`text-sm font-semibold mb-2 ${
                  gradeColors[additionalGrade] || "text-gray-300"
                }`}
              >
                에디셔널 잠재능력 ({additionalGrade})
              </h4>
              <ul className="text-sm space-y-1">
                {details.additionalPotentialOption1 && (
                  <li className="text-gray-200">
                    {details.additionalPotentialOption1}
                  </li>
                )}
                {details.additionalPotentialOption2 && (
                  <li className="text-gray-200">
                    {details.additionalPotentialOption2}
                  </li>
                )}
                {details.additionalPotentialOption3 && (
                  <li className="text-gray-200">
                    {details.additionalPotentialOption3}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* 소울 */}
          {details.soulName && (
            <div className="p-3 bg-purple-950/50 rounded-lg border border-purple-800">
              <h4 className="text-sm font-semibold text-purple-300 mb-1">
                {details.soulName}
              </h4>
              {details.soulOption && (
                <p className="text-sm text-gray-300">{details.soulOption}</p>
              )}
            </div>
          )}

          {/* 아이템 설명 */}
          {details.itemDescription && (
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">{details.itemDescription}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
