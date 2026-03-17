import Image from "next/image";
import { cn } from "@/lib/utils";

const SERVER_LOGOS: Record<string, string> = {
  노바: "/server-logo/노바.png",
  레드: "/server-logo/레드.png",
  루나: "/server-logo/루나.png",
  베라: "/server-logo/베라.png",
  스카니아: "/server-logo/스카니아.png",
  아케인: "/server-logo/아케인.png",
  엘리시움: "/server-logo/엘리시움.png",
  오로라: "/server-logo/오로라.png",
  유니온: "/server-logo/유니온.png",
  이노시스: "/server-logo/이노시스.png",
  제니스: "/server-logo/제니스.png",
  크로아: "/server-logo/크로아.png",
  에오스: "/server-logo/에오스.png",
  핼리오스: "/server-logo/핼리오스.png",
  챌린저스: "/server-logo/챌린저스.png",
  챌린저스2: "/server-logo/챌린저스2.png",
  챌린저스3: "/server-logo/챌린저스3.png",
  챌린저스4: "/server-logo/챌린저스4.png",
};

interface ServerLogoProps {
  serverName: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const sizeMap = {
  xs: 12,
  sm: 14,
  md: 18,
};

const isChallenger = (name: string) => name.startsWith("챌린저스");

// 챌린저스 로고는 심볼이 작게 그려져 있어 보정 필요
const CHALLENGER_SCALE = 1.45;

export function ServerLogo({ serverName, size = "sm", className }: ServerLogoProps) {
  const src = SERVER_LOGOS[serverName];
  if (!src) return null;

  const basePx = sizeMap[size];
  const px = isChallenger(serverName) ? Math.round(basePx * CHALLENGER_SCALE) : basePx;

  return (
    <Image
      src={src}
      alt={serverName}
      width={px}
      height={px}
      className={cn("inline-block flex-shrink-0", className)}
    />
  );
}

/** 월드 그룹 아이콘 (일반=돌의정령, 에오스/핼리오스=핑크빈, 챌린저스=챌린저스 로고) */
const WORLD_GROUP_ICONS: Record<string, string> = {
  NORMAL: "/돌의정령.png",
  EOS_HELIOS: "/핑크빈.png",
  CHALLENGER: "/server-logo/챌린저스.png",
};

interface WorldGroupIconProps {
  groupId: string;
  size?: number;
  className?: string;
}

export function WorldGroupIcon({ groupId, size = 18, className }: WorldGroupIconProps) {
  const src = WORLD_GROUP_ICONS[groupId];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={groupId}
      width={size}
      height={size}
      className={cn("inline-block flex-shrink-0", className)}
    />
  );
}

/** 서버 로고 + 서버 이름을 함께 표시하는 헬퍼 */
export function ServerNameWithLogo({
  serverName,
  size = "sm",
  className,
  textClassName,
}: ServerLogoProps & { textClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <ServerLogo serverName={serverName} size={size} />
      <span className={textClassName}>{serverName}</span>
    </span>
  );
}
