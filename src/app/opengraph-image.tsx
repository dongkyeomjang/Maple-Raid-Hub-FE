import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "메-력소 - 월드통합 보스 파티 매칭";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Google Fonts에서 Noto Sans KR Bold 폰트 로드
  const fontData = await fetch(
    "https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuozeLTq8H4hfeE.woff"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF7ED",
          fontFamily: "NotoSansKR",
        }}
      >
        {/* 단풍잎 아이콘 (단순화) */}
        <div
          style={{
            display: "flex",
            marginBottom: 24,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 64 64">
            <path
              d="M32 4 C34 4 36 6 38 10 L42 8 C44 7 46 8 46 10 L44 16 C48 14 52 14 54 16 C56 18 56 22 54 24 L58 26 C60 27 61 29 60 31 L54 32 C58 36 58 40 56 44 L58 48 C59 50 58 52 56 52 L50 50 C50 54 48 58 44 60 L44 62 C44 64 42 64 40 62 L38 56 C36 58 34 59 32 59 C30 59 28 58 26 56 L24 62 C22 64 20 64 20 62 L20 60 C16 58 14 54 14 50 L8 52 C6 52 5 50 6 48 L8 44 C6 40 6 36 10 32 L4 31 C3 29 4 27 6 26 L10 24 C8 22 8 18 10 16 C12 14 16 14 20 16 L18 10 C18 8 20 7 22 8 L26 10 C28 6 30 4 32 4Z"
              fill="#F97316"
            />
            <text
              x="32"
              y="40"
              textAnchor="middle"
              fill="white"
              fontSize="22"
              fontWeight="bold"
            >
              력
            </text>
          </svg>
        </div>

        {/* 타이틀 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#1C1917",
            marginBottom: 16,
          }}
        >
          메-력소
        </div>

        {/* 서브타이틀 */}
        <div
          style={{
            fontSize: 32,
            color: "#78716C",
            marginBottom: 12,
          }}
        >
          당신만을 위한 메이플 인력소
        </div>

        {/* 슬로건 */}
        <div
          style={{
            fontSize: 28,
            color: "#A8A29E",
            marginBottom: 40,
          }}
        >
          서로 다른 월드, 하나의 파티
        </div>

        {/* 기능 태그 */}
        <div
          style={{
            display: "flex",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 28px",
              borderRadius: 16,
              backgroundColor: "rgba(139, 92, 246, 0.15)",
              fontSize: 22,
              color: "#6D28D9",
            }}
          >
            실시간 채팅
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 28px",
              borderRadius: 16,
              backgroundColor: "rgba(6, 182, 212, 0.15)",
              fontSize: 22,
              color: "#0E7490",
            }}
          >
            일정 조율
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 28px",
              borderRadius: 16,
              backgroundColor: "rgba(249, 115, 22, 0.15)",
              fontSize: 22,
              color: "#C2410C",
            }}
          >
            매너 온도
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "NotoSansKR",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
