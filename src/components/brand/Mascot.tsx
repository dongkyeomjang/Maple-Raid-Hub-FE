"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface MascotProps {
  variant?: "default" | "happy" | "thinking" | "wave" | "excited";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  animate?: boolean;
  className?: string;
}

interface MuscleMushroomProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizes = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 180,
  "2xl": 240,
};

/**
 * 메-력소 메인 마스코트: 근육 주황버섯
 * - 바이킹 뿔 + 쇠사슬 + 근육질 몸
 * - 인력(人力)사무소의 '힘' 이미지
 * - 메이플력(力)의 파워풀한 느낌
 * - 메-력(魅力)의 귀여운 매력
 */
export function MuscleMushroomMascot({ size = "lg", className }: MuscleMushroomProps) {
  const pixelSize = sizes[size];

  return (
    <div
      className={cn(
        "relative select-none",
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <Image
        src="/mascot.gif"
        alt="메-력소 마스코트 - 근육 주황버섯"
        width={pixelSize}
        height={pixelSize}
        className="object-contain drop-shadow-lg"
        unoptimized // GIF 애니메이션 유지
        priority
      />
    </div>
  );
}

/**
 * 메-력소 마스코트: 주황버섯
 * 메이플스토리의 실질적인 마스코트 - 2003년부터 함께한 상징적 캐릭터
 * 귀여운 표정과 따뜻한 주황색으로 친근감을 전달
 */
export function Mascot({
  variant = "default",
  size = "md",
  animate = true,
  className,
}: MascotProps) {
  const pixelSize = sizes[size];

  return (
    <div
      className={cn(
        "select-none",
        animate && "animate-bounce-subtle",
        className
      )}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          {/* 버섯 갓 그라데이션 - 메이플 주황색 */}
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8C42" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          {/* 하이라이트 */}
          <radialGradient id="capHighlight" cx="30%" cy="25%" r="40%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          {/* 버섯 기둥 그라데이션 */}
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
          {/* 볼터치 */}
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 버섯 기둥 (몸통) */}
        <ellipse cx="60" cy="95" rx="22" ry="18" fill="url(#stemGrad)" />
        <ellipse cx="60" cy="95" rx="22" ry="18" fill="white" fillOpacity="0.2" />

        {/* 버섯 갓 (머리) - 둥글고 귀여운 반원형 */}
        <ellipse cx="60" cy="55" rx="45" ry="38" fill="url(#capGrad)" />

        {/* 버섯 갓 하이라이트 */}
        <ellipse cx="60" cy="55" rx="45" ry="38" fill="url(#capHighlight)" />

        {/* 버섯 갓 무늬 - 흰색 점들 (주황버섯 특유의 무늬) */}
        <ellipse cx="35" cy="45" rx="8" ry="6" fill="white" fillOpacity="0.9" />
        <ellipse cx="55" cy="35" rx="10" ry="7" fill="white" fillOpacity="0.9" />
        <ellipse cx="80" cy="42" rx="7" ry="5" fill="white" fillOpacity="0.9" />
        <ellipse cx="70" cy="58" rx="6" ry="4" fill="white" fillOpacity="0.85" />
        <ellipse cx="42" cy="60" rx="5" ry="4" fill="white" fillOpacity="0.85" />

        {/* 눈 - 표정별 */}
        {variant === "happy" || variant === "excited" ? (
          <>
            {/* 웃는 눈 (^^) */}
            <path
              d="M42 75 Q47 68 52 75"
              stroke="#44403C"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M68 75 Q73 68 78 75"
              stroke="#44403C"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : variant === "thinking" ? (
          <>
            {/* 생각하는 눈 - 위를 바라봄 */}
            <ellipse cx="47" cy="72" rx="5" ry="6" fill="#44403C" />
            <ellipse cx="73" cy="72" rx="5" ry="6" fill="#44403C" />
            <circle cx="45" cy="70" r="2" fill="white" />
            <circle cx="71" cy="70" r="2" fill="white" />
            {/* 물음표 이펙트 */}
            <text x="95" y="45" fontSize="16" fill="#F97316" fontWeight="bold">?</text>
          </>
        ) : variant === "wave" ? (
          <>
            {/* 윙크 */}
            <ellipse cx="47" cy="73" rx="5" ry="6" fill="#44403C" />
            <circle cx="45" cy="71" r="2" fill="white" />
            <path
              d="M68 73 Q73 68 78 73"
              stroke="#44403C"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* 기본 눈 - 반짝반짝 */}
            <ellipse cx="47" cy="73" rx="5" ry="6" fill="#44403C" />
            <ellipse cx="73" cy="73" rx="5" ry="6" fill="#44403C" />
            <circle cx="45" cy="71" r="2" fill="white" />
            <circle cx="71" cy="71" r="2" fill="white" />
          </>
        )}

        {/* 볼터치 */}
        <ellipse cx="32" cy="80" rx="8" ry="5" fill="url(#blushGrad)" />
        <ellipse cx="88" cy="80" rx="8" ry="5" fill="url(#blushGrad)" />

        {/* 입 - 표정별 */}
        {variant === "happy" || variant === "wave" ? (
          <path
            d="M52 88 Q60 96 68 88"
            stroke="#44403C"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : variant === "excited" ? (
          <>
            <ellipse cx="60" cy="90" rx="8" ry="6" fill="#44403C" />
            <ellipse cx="60" cy="88" rx="6" ry="3" fill="#FDA4AF" />
          </>
        ) : variant === "thinking" ? (
          <ellipse cx="60" cy="88" rx="4" ry="3" fill="#44403C" />
        ) : (
          <path
            d="M54 87 Q60 91 66 87"
            stroke="#44403C"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* 손 (wave 변형일 때) */}
        {variant === "wave" && (
          <g className="animate-wave origin-[95px_75px]">
            <ellipse
              cx="95"
              cy="75"
              rx="8"
              ry="6"
              fill="#FDE68A"
              transform="rotate(-20 95 75)"
            />
          </g>
        )}

        {/* 반짝이 이펙트 (excited일 때) */}
        {variant === "excited" && (
          <>
            <path d="M15 50 L20 55 L15 60 L10 55 Z" fill="#FBBF24" className="animate-sparkle" />
            <path d="M105 45 L108 50 L105 55 L102 50 Z" fill="#FBBF24" className="animate-sparkle" style={{ animationDelay: "0.3s" }} />
          </>
        )}
      </svg>
    </div>
  );
}

// ===== 근육 주황버섯 마스코트 프리셋 =====

export function MascotLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <MuscleMushroomMascot size="lg" />
      <p className="text-body-sm text-muted-foreground animate-pulse">
        메이플력 충전 중...
      </p>
    </div>
  );
}

export function MascotEmpty({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <MuscleMushroomMascot size="lg" />
      <p className="text-body-sm text-muted-foreground">
        {message || "아직 아무것도 없어요!"}
      </p>
    </div>
  );
}

export function MascotWelcome({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <MuscleMushroomMascot size="xl" />
      <div className="text-center">
        <p className="text-h3 font-bold text-foreground">
          반가워요, 모험가님!
        </p>
        <p className="text-body-sm text-muted-foreground mt-1">
          메-력소에서 당신의 메이플力을 보여주세요
        </p>
      </div>
    </div>
  );
}

export function MascotSuccess({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <MuscleMushroomMascot size="lg" />
      <p className="text-body-sm text-success-text font-medium">
        {message || "완료됐어요! 💪"}
      </p>
    </div>
  );
}

// 히어로 섹션용 대형 마스코트
export function MascotHero({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <MuscleMushroomMascot size="2xl" />
        {/* 파워 이펙트 */}
        <div className="absolute -inset-4 bg-gradient-radial from-primary/20 to-transparent rounded-full animate-pulse-soft -z-10" />
      </div>
      <div className="text-center">
        <p className="text-h2 font-bold text-foreground">
          당신의 <span className="text-gradient-maple">메이플力</span>을 보여주세요
        </p>
        <p className="text-body text-muted-foreground mt-2">
          서로 다른 월드, 하나의 파티
        </p>
      </div>
    </div>
  );
}

// 미니 마스코트 (뱃지, 버튼 옆에 사용)
export function MascotMini({ className }: { className?: string }) {
  return (
    <div className={cn("inline-block", className)}>
      <Image
        src="/mascot.gif"
        alt="메-력소"
        width={24}
        height={24}
        className="object-contain"
        unoptimized
      />
    </div>
  );
}

// 미디엄 사이즈 마스코트 (카드, 리스트 아이템 등)
export function MascotMedium({ className }: { className?: string }) {
  return (
    <div className={cn("inline-block", className)}>
      <Image
        src="/mascot.gif"
        alt="메-력소 마스코트"
        width={64}
        height={64}
        className="object-contain drop-shadow-md"
        unoptimized
      />
    </div>
  );
}
