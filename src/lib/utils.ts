import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "상의 후 결정";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return formatDate(date);
}

// Temperature labels and colors based on design spec
export function getTemperatureLabel(temperature: number): string {
  if (temperature >= 50) return "열정적";
  if (temperature >= 40) return "따뜻함";
  if (temperature >= 36) return "기본";
  if (temperature >= 30) return "서늘함";
  if (temperature >= 20) return "차가움";
  return "냉랭함";
}

export function getTemperatureColor(temperature: number): string {
  if (temperature >= 50) return "text-temp-burning";
  if (temperature >= 40) return "text-temp-hot";
  if (temperature >= 36) return "text-temp-warm";
  if (temperature >= 30) return "text-temp-cool";
  if (temperature >= 20) return "text-temp-cold";
  return "text-temp-freezing";
}

export function getTemperatureBgColor(temperature: number): string {
  if (temperature >= 50) return "bg-temp-burning/10";
  if (temperature >= 40) return "bg-temp-hot/10";
  if (temperature >= 36) return "bg-temp-warm/10";
  if (temperature >= 30) return "bg-temp-cool/10";
  if (temperature >= 20) return "bg-temp-cold/10";
  return "bg-temp-freezing/10";
}

// World Group utilities
export function getWorldGroupColor(worldGroup: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (worldGroup) {
    case "CHALLENGER":
      return {
        bg: "bg-world-challenger-bg",
        text: "text-world-challenger-text",
        border: "border-world-challenger-border",
      };
    case "EOS_HELIOS":
      return {
        bg: "bg-world-eosHelios-bg",
        text: "text-world-eosHelios-text",
        border: "border-world-eosHelios-border",
      };
    case "NORMAL":
    default:
      return {
        bg: "bg-world-normal-bg",
        text: "text-world-normal-text",
        border: "border-world-normal-border",
      };
  }
}

export function getWorldGroupDisplayName(worldGroup: string): string {
  switch (worldGroup) {
    case "CHALLENGER":
      return "챌린저스";
    case "EOS_HELIOS":
      return "에오스/핼리오스";
    case "NORMAL":
      return "일반";
    default:
      return worldGroup;
  }
}

export function getWorldGroupEmoji(worldGroup: string): string {
  switch (worldGroup) {
    case "CHALLENGER":
      return "🔥";
    case "EOS_HELIOS":
      return "⭐";
    case "NORMAL":
      return "🌿";
    default:
      return "";
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Format number with comma separators
export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

// Format meso value (억/만 단위)
export function formatMeso(meso: number): string {
  if (meso >= 100000000) {
    const eok = meso / 100000000;
    return eok % 1 === 0 ? `${eok}억` : `${eok.toFixed(1)}억`;
  }
  if (meso >= 10000) {
    return `${Math.floor(meso / 10000)}만`;
  }
  return formatNumber(meso);
}

// Format combat power (억 단위)
export function formatCombatPower(power: number): string {
  if (power >= 100000000) {
    return `${(power / 100000000).toFixed(1)}억`;
  }
  if (power >= 10000) {
    return `${(power / 10000).toFixed(0)}만`;
  }
  return formatNumber(power);
}
