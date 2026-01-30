import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "메-력소 - 월드통합 보스 파티 매칭";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FEF3C7 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 단풍잎 패턴 (은은하게) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "space-around",
          }}
        >
          {[...Array(20)].map((_, i) => (
            <svg
              key={i}
              width="80"
              height="80"
              viewBox="0 0 64 64"
              style={{
                transform: `rotate(${i * 18}deg)`,
              }}
            >
              <path
                d="M32 4
                   C34 4 36 6 38 10
                   L42 8 C44 7 46 8 46 10 L44 16
                   C48 14 52 14 54 16 C56 18 56 22 54 24
                   L58 26 C60 27 61 29 60 31 L54 32
                   C58 36 58 40 56 44
                   L58 48 C59 50 58 52 56 52 L50 50
                   C50 54 48 58 44 60
                   L44 62 C44 64 42 64 40 62 L38 56
                   C36 58 34 59 32 59
                   C30 59 28 58 26 56
                   L24 62 C22 64 20 64 20 62 L20 60
                   C16 58 14 54 14 50
                   L8 52 C6 52 5 50 6 48 L8 44
                   C6 40 6 36 10 32
                   L4 31 C3 29 4 27 6 26 L10 24
                   C8 22 8 18 10 16 C12 14 16 14 20 16
                   L18 10 C18 8 20 7 22 8 L26 10
                   C28 6 30 4 32 4Z"
                fill="#F97316"
              />
            </svg>
          ))}
        </div>

        {/* 단풍잎 로고 아이콘 */}
        <div
          style={{
            display: "flex",
            marginBottom: 32,
          }}
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: "drop-shadow(0 20px 40px rgba(249, 115, 22, 0.35))",
            }}
          >
            <defs>
              <linearGradient id="ogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
              <radialGradient id="ogHighlight" cx="30%" cy="30%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M32 4
                 C34 4 36 6 38 10
                 L42 8 C44 7 46 8 46 10 L44 16
                 C48 14 52 14 54 16 C56 18 56 22 54 24
                 L58 26 C60 27 61 29 60 31 L54 32
                 C58 36 58 40 56 44
                 L58 48 C59 50 58 52 56 52 L50 50
                 C50 54 48 58 44 60
                 L44 62 C44 64 42 64 40 62 L38 56
                 C36 58 34 59 32 59
                 C30 59 28 58 26 56
                 L24 62 C22 64 20 64 20 62 L20 60
                 C16 58 14 54 14 50
                 L8 52 C6 52 5 50 6 48 L8 44
                 C6 40 6 36 10 32
                 L4 31 C3 29 4 27 6 26 L10 24
                 C8 22 8 18 10 16 C12 14 16 14 20 16
                 L18 10 C18 8 20 7 22 8 L26 10
                 C28 6 30 4 32 4Z"
              fill="url(#ogGrad)"
            />
            <path
              d="M32 4
                 C34 4 36 6 38 10
                 L42 8 C44 7 46 8 46 10 L44 16
                 C48 14 52 14 54 16 C56 18 56 22 54 24
                 L58 26 C60 27 61 29 60 31 L54 32
                 C58 36 58 40 56 44
                 L58 48 C59 50 58 52 56 52 L50 50
                 C50 54 48 58 44 60
                 L44 62 C44 64 42 64 40 62 L38 56
                 C36 58 34 59 32 59
                 C30 59 28 58 26 56
                 L24 62 C22 64 20 64 20 62 L20 60
                 C16 58 14 54 14 50
                 L8 52 C6 52 5 50 6 48 L8 44
                 C6 40 6 36 10 32
                 L4 31 C3 29 4 27 6 26 L10 24
                 C8 22 8 18 10 16 C12 14 16 14 20 16
                 L18 10 C18 8 20 7 22 8 L26 10
                 C28 6 30 4 32 4Z"
              fill="url(#ogHighlight)"
            />
            <ellipse cx="32" cy="60" rx="3" ry="4" fill="#EA580C" />
            <text
              x="32"
              y="38"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="24"
              fontWeight="900"
            >
              력
            </text>
            <circle cx="18" cy="18" r="3" fill="white" opacity="0.6" />
            <circle cx="14" cy="26" r="1.5" fill="white" opacity="0.4" />
          </svg>
        </div>

        {/* 타이틀 */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#1C1917",
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}
        >
          메-력소
        </div>

        {/* 서브타이틀 */}
        <div
          style={{
            fontSize: 28,
            color: "#78716C",
            marginBottom: 16,
          }}
        >
          메이플 인력소 · 메이플의 힘
        </div>

        {/* 메인 슬로건 */}
        <div
          style={{
            fontSize: 36,
            color: "#57534E",
            marginBottom: 48,
            textAlign: "center",
          }}
        >
          서로 다른 월드, 하나의 파티
        </div>

        {/* 기능 카드들 */}
        <div
          style={{
            display: "flex",
            gap: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px 32px",
              borderRadius: 20,
              background: "rgba(139, 92, 246, 0.1)",
              border: "2px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <div style={{ fontSize: 32 }}>💬</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#6D28D9" }}>
              크로스 월드 실시간 채팅
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px 32px",
              borderRadius: 20,
              background: "rgba(6, 182, 212, 0.1)",
              border: "2px solid rgba(6, 182, 212, 0.2)",
            }}
          >
            <div style={{ fontSize: 32 }}>📅</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#0E7490" }}>
              스마트 일정 조율
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px 32px",
              borderRadius: 20,
              background: "rgba(249, 115, 22, 0.1)",
              border: "2px solid rgba(249, 115, 22, 0.2)",
            }}
          >
            <div style={{ fontSize: 32 }}>🔥</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#C2410C" }}>
              매너 온도 시스템
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
