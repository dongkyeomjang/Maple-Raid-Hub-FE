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
      <Image
        src="/머쉬맘.png"
        alt="머쉬맘"
        width={pixelSize}
        height={pixelSize}
        className="object-contain drop-shadow-lg"
      />
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
