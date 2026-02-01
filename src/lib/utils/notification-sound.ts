// 브라우저 알림 소리 유틸리티

let audioContext: AudioContext | null = null;
let isInitialized = false;

// AudioContext 초기화 (사용자 상호작용 후 호출 필요)
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch (e) {
      console.warn("AudioContext not supported:", e);
      return null;
    }
  }

  return audioContext;
}

// 첫 사용자 상호작용 시 AudioContext 초기화
if (typeof window !== "undefined" && !isInitialized) {
  const initOnInteraction = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
    isInitialized = true;
    // 한 번만 실행되도록 리스너 제거
    document.removeEventListener("click", initOnInteraction);
    document.removeEventListener("keydown", initOnInteraction);
    document.removeEventListener("touchstart", initOnInteraction);
  };

  document.addEventListener("click", initOnInteraction);
  document.addEventListener("keydown", initOnInteraction);
  document.addEventListener("touchstart", initOnInteraction);
}

// 간단한 알림음 생성 (Web Audio API 사용)
export function playNotificationSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // AudioContext가 suspended 상태면 resume
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  try {
    // 오실레이터 생성 (비프음)
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 소리 설정 - 부드러운 알림음
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 음
    oscillator.type = "sine";

    // 볼륨 페이드 인/아웃
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

    // 재생
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);

    // 두 번째 음 (더블 비프)
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6 음
      osc2.type = "sine";

      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.15);
    }, 150);
  } catch (e) {
    console.warn("Failed to play notification sound:", e);
  }
}

// 사용자 상호작용으로 AudioContext 활성화
export function initializeAudioContext() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume();
  }
}
