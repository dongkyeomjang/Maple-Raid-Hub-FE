"use client";

import { cn } from "@/lib/utils";

interface TemperatureFaceProps {
  temperature: number;
  size?: number;
  className?: string;
}

/**
 * 온도 구간별 레벨 (0~11)
 *  0: <20      냉랭함
 *  1: 20~30    차가움
 *  2: 30~36    서늘함
 *  3: 36~36.5  기본(중립)
 *  4: >36.5~38 방금 쌓임 (입꼬리만 살짝)
 *  5: 38~40    훈훈 (옅은 미소)
 *  6: 40~45    쌓임
 *  7: 45~50    따뜻
 *  8: 50~60    좋음
 *  9: 60~70    훌륭
 * 10: 70~80    최고
 * 11: 80+      전설
 */
function getLevel(temperature: number): number {
  if (temperature >= 80) return 11;
  if (temperature >= 70) return 10;
  if (temperature >= 60) return 9;
  if (temperature >= 50) return 8;
  if (temperature >= 45) return 7;
  if (temperature >= 40) return 6;
  if (temperature >= 38) return 5;
  if (temperature > 36.5) return 4;
  if (temperature >= 36) return 3;
  if (temperature >= 30) return 2;
  if (temperature >= 20) return 1;
  return 0;
}

const FACE_BG_COLORS = [
  "#3B82F6", // 0 - 냉랭 (진한 파랑)
  "#60A5FA", // 1 - 차가움 (파랑)
  "#BFDBFE", // 2 - 서늘 (하늘색)
  "#E5E7EB", // 3 - 기본 (회색)
  "#FEF9E7", // 4 - 방금 쌓임 (거의 크림)
  "#FEF3C7", // 5 - 훈훈 (연버터)
  "#FDE68A", // 6 - 쌓임 (노랑)
  "#FCD34D", // 7 - 따뜻 (진노랑)
  "#FB923C", // 8 - 좋음 (오렌지)
  "#F97316", // 9 - 훌륭 (진오렌지)
  "#F472B6", // 10 - 최고 (핑크)
  "#EF4444", // 11 - 전설 (빨강)
];

const STROKE_COOL = "#1E3A8A"; // 차가운 영역의 진남색
const STROKE_NEUTRAL = "#4B5563"; // 기본 회색 영역
const STROKE_WARM = "#4B2E13"; // 따뜻한 영역의 갈색

function strokeForLevel(level: number): string {
  if (level <= 2) return STROKE_COOL;
  if (level === 3) return STROKE_NEUTRAL;
  return STROKE_WARM;
}

export function TemperatureFace({ temperature, size = 20, className }: TemperatureFaceProps) {
  const level = getLevel(temperature);
  const bg = FACE_BG_COLORS[level];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="11" fill={bg} stroke="rgba(0,0,0,0.1)" strokeWidth="0.6" />
      {renderFace(level)}
    </svg>
  );
}

function renderFace(level: number) {
  const stroke = strokeForLevel(level);

  switch (level) {
    case 0:
      // 냉랭: 찡그린 눈 + 울음 입 + 눈물 한 방울
      return (
        <>
          <path
            d="M 7 11.2 L 10 9.5"
            stroke={stroke} strokeWidth="1.5" strokeLinecap="round"
          />
          <path
            d="M 14 9.5 L 17 11.2"
            stroke={stroke} strokeWidth="1.5" strokeLinecap="round"
          />
          {/* 아래로 크게 휜 입 */}
          <path
            d="M 9 17 Q 12 14.5 15 17"
            stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none"
          />
          {/* 눈물 방울 */}
          <path
            d="M 8 12 Q 7.2 13.8 7.6 14.8 Q 8.4 13.8 8 12 Z"
            fill="#1D4ED8" stroke="#1E3A8A" strokeWidth="0.3"
          />
        </>
      );
    case 1:
      // 차가움: 슬픈 눈 + 뒤집힌 미소
      return (
        <>
          <circle cx="9" cy="10.8" r="1.1" fill={stroke} />
          <circle cx="15" cy="10.8" r="1.1" fill={stroke} />
          <path
            d="M 9 16.8 Q 12 15 15 16.8"
            stroke={stroke} strokeWidth="1.4" strokeLinecap="round" fill="none"
          />
        </>
      );
    case 2:
      // 서늘: 점 눈 + 살짝 아래로 내린 입 (시무룩)
      return (
        <>
          <circle cx="9" cy="10.5" r="1.1" fill={stroke} />
          <circle cx="15" cy="10.5" r="1.1" fill={stroke} />
          <path
            d="M 9 16.3 Q 12 15.5 15 16.3"
            stroke={stroke} strokeWidth="1.3" strokeLinecap="round" fill="none"
          />
        </>
      );
    case 3:
      // 기본: 무표정
      return (
        <>
          <circle cx="9" cy="10.5" r="1.1" fill={stroke} />
          <circle cx="15" cy="10.5" r="1.1" fill={stroke} />
          <line
            x1="9.5" y1="16" x2="14.5" y2="16"
            stroke={stroke} strokeWidth="1.3" strokeLinecap="round"
          />
        </>
      );
    case 4:
      // 방금 쌓임 (36.5 초과 ~ 38): 입꼬리만 살짝 올라간 정도. 얕고 짧은 곡선.
      return (
        <>
          <circle cx="9" cy="10.5" r="1.1" fill={stroke} />
          <circle cx="15" cy="10.5" r="1.1" fill={stroke} />
          <path
            d="M 10 16 Q 12 16.6 14 16"
            stroke={stroke} strokeWidth="1.3" strokeLinecap="round" fill="none"
          />
        </>
      );
    case 5:
      // 훈훈 (38~40): 살짝 미소
      return (
        <>
          <circle cx="9" cy="10.5" r="1.1" fill={stroke} />
          <circle cx="15" cy="10.5" r="1.1" fill={stroke} />
          <path
            d="M 9 15.5 Q 12 17 15 15.5"
            stroke={stroke} strokeWidth="1.4" strokeLinecap="round" fill="none"
          />
        </>
      );
    case 6:
      // 쌓임 (40~45): 웃음
      return (
        <>
          <circle cx="9" cy="10.5" r="1.1" fill={stroke} />
          <circle cx="15" cy="10.5" r="1.1" fill={stroke} />
          <path
            d="M 8.5 15 Q 12 18 15.5 15"
            stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none"
          />
        </>
      );
    case 7:
      // 따뜻 (45~50): 웃는 눈 + 열린 미소
      return (
        <>
          <path
            d="M 7.5 10.8 Q 9 9 10.5 10.8"
            stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none"
          />
          <path
            d="M 13.5 10.8 Q 15 9 16.5 10.8"
            stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none"
          />
          <path
            d="M 8 15 Q 12 18 16 15"
            stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none"
          />
        </>
      );
    case 8:
      // 좋음 (50~60): 큰 웃음 + 볼 홍조
      return (
        <>
          <path
            d="M 7.5 10.8 Q 9 8.8 10.5 10.8"
            stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none"
          />
          <path
            d="M 13.5 10.8 Q 15 8.8 16.5 10.8"
            stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none"
          />
          <path
            d="M 7.5 14.5 Q 12 19 16.5 14.5 Z"
            fill={stroke}
          />
          <circle cx="6" cy="14" r="1.3" fill="#FFA5A5" opacity="0.65" />
          <circle cx="18" cy="14" r="1.3" fill="#FFA5A5" opacity="0.65" />
        </>
      );
    case 9:
      // 훌륭 (60~70): 이빨 보이는 만개 + 진한 볼
      return (
        <>
          <path
            d="M 7.5 10.8 Q 9 8.6 10.5 10.8"
            stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none"
          />
          <path
            d="M 13.5 10.8 Q 15 8.6 16.5 10.8"
            stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none"
          />
          <path
            d="M 7 14.5 Q 12 19 17 14.5 Z"
            fill={stroke} stroke={stroke} strokeWidth="0.5" strokeLinejoin="round"
          />
          <rect x="9" y="15" width="6" height="1.6" fill="#FFFFFF" />
          <circle cx="5.5" cy="13.8" r="1.4" fill="#FF8181" opacity="0.75" />
          <circle cx="18.5" cy="13.8" r="1.4" fill="#FF8181" opacity="0.75" />
        </>
      );
    case 10:
      // 최고 (70~80): 반짝이 눈 + 환한 미소
      return (
        <>
          <circle cx="9" cy="10.5" r="1.6" fill={stroke} />
          <circle cx="9.5" cy="10" r="0.55" fill="#FFFFFF" />
          <circle cx="15" cy="10.5" r="1.6" fill={stroke} />
          <circle cx="15.5" cy="10" r="0.55" fill="#FFFFFF" />
          <path
            d="M 7.5 14.8 Q 12 18.8 16.5 14.8"
            stroke="#7F1D1D" strokeWidth="1.6" strokeLinecap="round" fill="none"
          />
          <circle cx="5.3" cy="14" r="1.5" fill="#FFFFFF" opacity="0.55" />
          <circle cx="18.7" cy="14" r="1.5" fill="#FFFFFF" opacity="0.55" />
        </>
      );
    case 11:
      // 전설 (80+): 선글라스 + 불꽃
      return (
        <>
          <rect x="4.5" y="8.8" width="5.5" height="3.6" rx="1.4" fill="#111827" />
          <rect x="14" y="8.8" width="5.5" height="3.6" rx="1.4" fill="#111827" />
          <line x1="10" y1="10.2" x2="14" y2="10.2" stroke="#111827" strokeWidth="1" />
          <rect x="5.3" y="9.3" width="1.5" height="0.8" rx="0.4" fill="#FFFFFF" opacity="0.5" />
          <rect x="14.8" y="9.3" width="1.5" height="0.8" rx="0.4" fill="#FFFFFF" opacity="0.5" />
          <path
            d="M 8 15 Q 12 19 16 15"
            stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none"
          />
          <path
            d="M 12 1.5 Q 10.2 3.5 11 4.8 Q 11.6 3.2 12 2.6 Q 12.4 3.2 13 4.8 Q 13.8 3.5 12 1.5 Z"
            fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.4"
          />
        </>
      );
    default:
      return null;
  }
}
