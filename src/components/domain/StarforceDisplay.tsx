"use client";

interface StarforceDisplayProps {
  starforce: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
}

/**
 * 메이플스토리 인게임과 동일한 스타포스 표시 컴포넌트
 * - 15개씩 한 줄 (5개 그룹 x 3, 그룹 사이 공백)
 * - 1~15성: 노란색 별 (첫 번째 줄)
 * - 16~25성: 밝은 노란색 + 빛나는 효과 (두 번째 줄)
 *
 * 예시 (22성):
 * ★★★★★ ★★★★★ ★★★★★
 * ★★★★★ ★★☆☆☆
 */
export function StarforceDisplay({
  starforce,
  maxStars = 25,
  size = "md",
}: StarforceDisplayProps) {
  if (starforce <= 0) return null;

  const displayStars = Math.min(starforce, maxStars);

  // 사이즈별 스타일
  const sizeStyles = {
    sm: { star: "text-[10px]", groupGap: "gap-1", rowGap: "gap-y-0.5" },
    md: { star: "text-xs", groupGap: "gap-1.5", rowGap: "gap-y-1" },
    lg: { star: "text-sm", groupGap: "gap-2", rowGap: "gap-y-1" },
  };

  const styles = sizeStyles[size];

  // 첫 번째 줄: 1~15성
  const firstRowStars = Math.min(displayStars, 15);
  // 두 번째 줄: 16~25성
  const secondRowStars = displayStars > 15 ? displayStars - 15 : 0;

  const renderStarGroup = (
    filledCount: number,
    totalSlots: number,
    startIndex: number,
    isEnhanced: boolean
  ) => {
    const stars = [];
    for (let i = 0; i < totalSlots; i++) {
      const isFilled = i < filledCount;
      stars.push(
        <span
          key={startIndex + i}
          className={`${styles.star} ${
            isFilled
              ? isEnhanced
                ? "text-yellow-300 drop-shadow-[0_0_3px_rgba(253,224,71,0.8)]"
                : "text-yellow-500"
              : "text-gray-600"
          }`}
        >
          {isFilled ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  const renderRow = (totalStars: number, isEnhanced: boolean, startIdx: number) => {
    const groups = [];
    const maxGroups = isEnhanced ? 2 : 3; // 두 번째 줄은 10성까지(2그룹)

    for (let g = 0; g < maxGroups; g++) {
      const groupStart = g * 5;
      const filledInGroup = Math.max(0, Math.min(5, totalStars - groupStart));

      // 그룹에 별이 하나도 없고 첫 번째 줄이 아니면 스킵
      if (filledInGroup === 0 && isEnhanced) continue;

      groups.push(
        <div key={g} className="flex">
          {renderStarGroup(filledInGroup, 5, startIdx + groupStart, isEnhanced)}
        </div>
      );
    }

    return (
      <div className={`flex ${styles.groupGap}`}>
        {groups}
      </div>
    );
  };

  return (
    <div className={`flex flex-col items-center ${styles.rowGap}`}>
      {/* 첫 번째 줄: 1~15성 */}
      {renderRow(firstRowStars, false, 0)}

      {/* 두 번째 줄: 16~25성 */}
      {secondRowStars > 0 && renderRow(secondRowStars, true, 15)}
    </div>
  );
}

/**
 * 컴팩트한 스타포스 표시 (슬롯 아이콘 위)
 */
export function StarforceCompact({ starforce }: { starforce: number }) {
  if (starforce <= 0) return null;

  // 22성 이상은 숫자로 표시
  if (starforce >= 22) {
    return (
      <span className="text-[8px] font-bold text-yellow-300 drop-shadow-[0_0_2px_rgba(253,224,71,0.8)]">
        ★{starforce}
      </span>
    );
  }

  // 17성 이상은 숫자와 함께
  if (starforce >= 17) {
    return (
      <span className="text-[8px] font-bold text-yellow-300 drop-shadow-[0_0_2px_rgba(253,224,71,0.8)]">
        ★{starforce}
      </span>
    );
  }

  // 16성 이하는 별 하나만 표시
  return (
    <span
      className={`text-[9px] ${
        starforce > 15
          ? "text-yellow-300 drop-shadow-[0_0_2px_rgba(253,224,71,0.8)]"
          : "text-yellow-500"
      }`}
    >
      ★
    </span>
  );
}
