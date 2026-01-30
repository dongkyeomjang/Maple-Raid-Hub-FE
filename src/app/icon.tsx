import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

/**
 * 메-력소 파비콘 - 동글동글 귀여운 버전
 */
export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <svg
          width="26"
          height="18"
          viewBox="0 0 26 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ㅁ - 동글동글 */}
          <rect x="0" y="0" width="9" height="3" rx="1.5" fill="white" />
          <rect x="0" y="0" width="3" height="9" rx="1.5" fill="white" />
          <rect x="6" y="0" width="3" height="9" rx="1.5" fill="white" />
          <rect x="0" y="6" width="9" height="3" rx="1.5" fill="white" />

          {/* ㅔ - 부드러운 곡선 */}
          <rect x="10" y="3" width="4" height="3" rx="1.5" fill="white" />
          <rect x="11.5" y="0" width="3" height="9" rx="1.5" fill="white" />
          <rect x="16" y="0" width="3" height="9" rx="1.5" fill="white" />

          {/* - 동글동글한 하이픈 */}
          <rect x="20" y="3" width="6" height="3" rx="1.5" fill="white" />

          {/* 장식 점 */}
          <circle cx="13" cy="14" r="1.5" fill="white" opacity="0.7" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
