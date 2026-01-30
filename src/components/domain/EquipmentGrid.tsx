"use client";

import type { EquipmentInfo } from "@/types/api";
import { EquipmentSlotItem } from "./EquipmentSlotItem";

interface EquipmentGridProps {
  equipment: EquipmentInfo;
}

// 2열 12행 레이아웃 (행 우선 순서)
const EQUIPMENT_LAYOUT: Array<[
  { slot: string; name: string },
  { slot: string; name: string }
]> = [
  [{ slot: "weapon", name: "무기" }, { slot: "shield", name: "보조무기" }],
  [{ slot: "emblem", name: "엠블렘" }, { slot: "cap", name: "모자" }],
  [{ slot: "top", name: "상의" }, { slot: "bottom", name: "하의" }],
  [{ slot: "shoes", name: "신발" }, { slot: "gloves", name: "장갑" }],
  [{ slot: "cape", name: "망토" }, { slot: "shoulder", name: "어깨" }],
  [{ slot: "face", name: "얼굴장식" }, { slot: "eye", name: "눈장식" }],
  [{ slot: "earring", name: "귀고리" }, { slot: "belt", name: "벨트" }],
  [{ slot: "pendant1", name: "펜던트" }, { slot: "pendant2", name: "펜던트2" }],
  [{ slot: "ring1", name: "반지1" }, { slot: "ring2", name: "반지2" }],
  [{ slot: "ring3", name: "반지3" }, { slot: "ring4", name: "반지4" }],
  [{ slot: "pocket", name: "포켓" }, { slot: "heart", name: "심장" }],
  [{ slot: "badge", name: "뱃지" }, { slot: "medal", name: "훈장" }],
];

export function EquipmentGrid({ equipment }: EquipmentGridProps) {
  const { slots } = equipment;

  return (
    <div className="grid grid-cols-2 gap-1">
      {EQUIPMENT_LAYOUT.map((row, rowIndex) =>
        row.map((slotConfig, colIndex) => {
          const slotData = slots[slotConfig.slot] || null;
          return (
            <EquipmentSlotItem
              key={`${rowIndex}-${colIndex}`}
              slot={slotData}
              slotName={slotConfig.slot}
              displayName={slotConfig.name}
              isRightColumn={colIndex === 1}
            />
          );
        })
      )}
    </div>
  );
}
