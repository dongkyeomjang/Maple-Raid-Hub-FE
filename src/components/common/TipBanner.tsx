"use client";

import { useState, useEffect } from "react";
import { X, ThermometerSun, CalendarClock, Bell } from "lucide-react";

interface Tip {
  id: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const TIPS: Tip[] = [
  {
    id: "manner-review",
    icon: <ThermometerSun className="h-4 w-4" />,
    label: "매너 온도",
    title: "매너 온도를 평가해보세요!",
    description:
      "채팅방 우측 상단의 온도계 아이콘을 눌러 매너온도를 평가할 수 있어요. 매너 온도가 높을수록 다음 파티 매칭에서 신뢰받는 유저가 됩니다.",
    colorClass: "text-green-600 dark:text-green-400",
    bgClass: "bg-green-50 dark:bg-green-900/20",
    borderClass: "border-green-200 dark:border-green-800/40",
  },
  {
    id: "boss-schedule",
    icon: <CalendarClock className="h-4 w-4" />,
    label: "일정 조율",
    title: "보스 시간, 투표로 정하세요!",
    description:
      "파티방의 일정 조율 기능으로 가능한 시간을 투표할 수 있어요. 히트맵을 통해 모두가 가능한 시간을 확인해봐요. (마이페이지 -> 내 파티 -> 파티방 입장 -> 일정 조율)",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-900/20",
    borderClass: "border-blue-200 dark:border-blue-800/40",
  },
  {
    id: "discord-noti",
    icon: <Bell className="h-4 w-4" />,
    label: "알림 설정",
    title: "디스코드 연동으로 실시간 알림 받아봐요!",
    description:
      "디스코드 연동을 활성화하면 새 지원자, 내 지원 결과, 메시지 알림을 실시간으로 받아볼 수 있어요. (설정: 마이페이지 -> 디스코드 연동하기) ",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-900/20",
    borderClass: "border-purple-200 dark:border-purple-800/40",
  },
];

const STORAGE_KEY = "tip-banner-dismissed";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24시간

export function TipBanner() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 24시간 내 닫은 적 있으면 표시하지 않음
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const timestamp = Number(dismissed);
        if (Date.now() - timestamp < DISMISS_DURATION_MS) return;
      }
    } catch {
      // localStorage 접근 불가 시 그냥 표시
    }

    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    setTip(randomTip);
    // 마운트 후 살짝 딜레이를 줘서 슬라이드 인 애니메이션
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  if (!tip) return null;

  return (
    <div
      className={`
        transition-all duration-500 ease-out overflow-hidden
        ${visible ? "max-h-40 opacity-100 translate-y-0 mb-3" : "max-h-0 opacity-0 -translate-y-2 mb-0"}
      `}
    >
      <div
        className={`
          relative flex items-start gap-3 px-4 py-3 rounded-xl border
          ${tip.bgClass} ${tip.borderClass}
        `}
      >
        {/* 본문 */}
        <div className="flex-1 min-w-0">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${tip.colorClass}`}
          >
            {tip.label}
          </span>
          <div className="flex items-start gap-2.5 mt-1">
            <div
              className={`
                flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                ${tip.colorClass} bg-white/80 dark:bg-white/10 shadow-sm
              `}
            >
              {tip.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-snug">
                {tip.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {tip.description}
              </p>
            </div>
          </div>
        </div>

        {/* 닫기 */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 mt-0.5 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="팁 닫기"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
