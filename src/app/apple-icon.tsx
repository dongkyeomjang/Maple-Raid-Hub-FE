import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/**
 * 메-력소 Apple Touch Icon - 동글동글 귀여운 버전
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FF6B35 0%, #F97316 100%)",
          borderRadius: 40,
        }}
      >
        <svg
          width="140"
          height="100"
          viewBox="0 0 140 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ㅁ - 동글동글 */}
          <rect x="0" y="10" width="45" height="12" rx="6" fill="white" />
          <rect x="0" y="10" width="12" height="45" rx="6" fill="white" />
          <rect x="33" y="10" width="12" height="45" rx="6" fill="white" />
          <rect x="0" y="43" width="45" height="12" rx="6" fill="white" />

          {/* ㅔ - 부드러운 곡선 */}
          <rect x="50" y="24" width="18" height="12" rx="6" fill="white" />
          <rect x="56" y="10" width="12" height="45" rx="6" fill="white" />
          <rect x="74" y="10" width="12" height="45" rx="6" fill="white" />

          {/* - 동글동글한 하이픈 */}
          <rect x="92" y="24" width="40" height="12" rx="6" fill="white" />

          {/* 장식 점들 */}
          <circle cx="50" cy="80" r="5" fill="white" opacity="0.5" />
          <circle cx="70" cy="80" r="7" fill="white" opacity="0.6" />
          <circle cx="90" cy="80" r="5" fill="white" opacity="0.5" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
