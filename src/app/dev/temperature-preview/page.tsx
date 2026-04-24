"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { TemperatureBadge } from "@/components/domain/TemperatureBadge";
import { TemperatureFace } from "@/components/domain/TemperatureFace";
import {
  getTemperatureColor,
  getTemperatureLabel,
  getTemperatureExpression,
} from "@/lib/utils";

// 각 레벨을 확실히 밟는 온도들 + 경계값 근처
const SAMPLE_TEMPERATURES: { t: number; note: string }[] = [
  { t: 20, note: "매우 낮음" },
  { t: 30, note: "서늘함 구간" },
  { t: 36.0, note: "기본 바로 아래" },
  { t: 36.5, note: "기본값 (경계)" },
  { t: 36.6, note: "36.5 초과 경계 - Lv1 시작" },
  { t: 38, note: "Lv1 중간" },
  { t: 42, note: "Lv2" },
  { t: 47, note: "Lv3" },
  { t: 55, note: "Lv4" },
  { t: 65, note: "Lv5" },
  { t: 75, note: "Lv6" },
  { t: 85, note: "Lv7 (최상)" },
  { t: 99, note: "만점 한계치" },
];

export default function TemperaturePreviewPage() {
  return (
    <PageContainer className="max-w-4xl mx-auto">
      <div className="space-y-4 mb-6">
        <h1 className="text-2xl font-bold">매너온도 아이콘 프리뷰</h1>
        <p className="text-sm text-muted-foreground">
          각 온도 구간별로 TemperatureFace / TemperatureBadge / 라벨 / 긴 표현이 어떻게 보이는지
          한눈에 확인할 수 있는 개발용 페이지입니다. 36.5 초과 구간부터 단계가 나뉩니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>구간별 렌더링</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-[90px_72px_220px_1fr_1fr] gap-3 items-center px-2 py-1 border-b text-xs text-muted-foreground font-medium">
              <div>온도</div>
              <div>큰 아이콘</div>
              <div>TemperatureBadge (md)</div>
              <div>라벨 · 표현</div>
              <div>비고</div>
            </div>

            {SAMPLE_TEMPERATURES.map(({ t, note }) => {
              const label = getTemperatureLabel(t);
              const expression = getTemperatureExpression(t);
              const color = getTemperatureColor(t);
              return (
                <div
                  key={t}
                  className="grid grid-cols-[90px_72px_220px_1fr_1fr] gap-3 items-center px-2 py-3 border-b hover:bg-muted/30 rounded"
                >
                  <div className="font-mono text-sm tabular-nums">
                    {t.toFixed(1)}°C
                  </div>
                  <div>
                    <TemperatureFace temperature={t} size={56} />
                  </div>
                  <div>
                    <TemperatureBadge temperature={t} size="md" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-muted-foreground">라벨: </span>
                      <span className={color}>{label}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">표현: </span>
                      <span>{expression ?? "-"}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{note}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>변형 (variant / size)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[47, 65, 85].map((t) => (
            <div key={t} className="space-y-2">
              <h3 className="font-semibold text-sm">{t}°C</h3>
              <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/30 rounded">
                <TemperatureBadge temperature={t} size="sm" />
                <TemperatureBadge temperature={t} size="md" />
                <TemperatureBadge temperature={t} size="lg" />
                <TemperatureBadge temperature={t} variant="pill" size="sm" />
                <TemperatureBadge temperature={t} variant="pill" size="md" />
                <TemperatureBadge temperature={t} variant="pill" size="lg" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>큰 아이콘 (갤러리)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-4">
            {SAMPLE_TEMPERATURES.map(({ t }) => (
              <div key={t} className="flex flex-col items-center gap-1">
                <TemperatureFace temperature={t} size={72} />
                <span className="text-xs font-mono tabular-nums">
                  {t.toFixed(1)}°C
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {getTemperatureLabel(t)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
