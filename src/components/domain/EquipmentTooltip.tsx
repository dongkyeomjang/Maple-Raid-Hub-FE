"use client";

import type { EquipmentSlot, PotentialGrade } from "@/types/api";
import { StarforceDisplay } from "./StarforceDisplay";

interface EquipmentTooltipProps {
  slot: EquipmentSlot;
}

const gradeColors: Record<PotentialGrade, string> = {
  "레어": "text-blue-400",
  "에픽": "text-purple-400",
  "유니크": "text-yellow-400",
  "레전드리": "text-green-400",
};

const gradeBgColors: Record<PotentialGrade, string> = {
  "레어": "bg-blue-900/50",
  "에픽": "bg-purple-900/50",
  "유니크": "bg-yellow-900/50",
  "레전드리": "bg-green-900/50",
};

export function EquipmentTooltip({ slot }: EquipmentTooltipProps) {
  const { itemName, details } = slot;
  const starforce = parseInt(details.starforce || "0", 10);
  const potentialGrade = details.potentialOptionGrade as PotentialGrade | null;
  const additionalGrade = details.additionalPotentialOptionGrade as PotentialGrade | null;

  return (
    <div className="max-w-xs p-3 text-sm bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
      {/* 스타포스 */}
      {starforce > 0 && (
        <div className="mb-2 pb-2 border-b border-gray-700">
          <StarforceDisplay starforce={starforce} size="sm" />
        </div>
      )}

      {/* 아이템 이름 */}
      <div className="mb-2">
        <h4 className="font-bold text-white">{itemName}</h4>
      </div>

      {/* 잠재능력 */}
      {potentialGrade && (
        <div className={`mt-2 p-2 rounded ${gradeBgColors[potentialGrade] || "bg-gray-800"}`}>
          <p className={`text-xs font-semibold ${gradeColors[potentialGrade] || "text-gray-300"}`}>
            잠재능력 ({potentialGrade})
          </p>
          <ul className="text-xs text-gray-200 mt-1 space-y-0.5">
            {details.potentialOption1 && <li>{details.potentialOption1}</li>}
            {details.potentialOption2 && <li>{details.potentialOption2}</li>}
            {details.potentialOption3 && <li>{details.potentialOption3}</li>}
          </ul>
        </div>
      )}

      {/* 에디셔널 잠재능력 */}
      {additionalGrade && (
        <div className={`mt-2 p-2 rounded ${gradeBgColors[additionalGrade] || "bg-gray-800"}`}>
          <p className={`text-xs font-semibold ${gradeColors[additionalGrade] || "text-gray-300"}`}>
            에디셔널 ({additionalGrade})
          </p>
          <ul className="text-xs text-gray-200 mt-1 space-y-0.5">
            {details.additionalPotentialOption1 && <li>{details.additionalPotentialOption1}</li>}
            {details.additionalPotentialOption2 && <li>{details.additionalPotentialOption2}</li>}
            {details.additionalPotentialOption3 && <li>{details.additionalPotentialOption3}</li>}
          </ul>
        </div>
      )}

      {/* 소울 */}
      {details.soulName && (
        <div className="mt-2 text-xs text-purple-300">
          <p className="font-semibold">{details.soulName}</p>
          {details.soulOption && <p className="text-gray-300">{details.soulOption}</p>}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-400">클릭하여 상세 정보 보기</p>
    </div>
  );
}
