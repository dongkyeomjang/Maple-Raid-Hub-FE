import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Swords, Shield, Users, ThermometerSun, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="container relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-caption font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              월드통합 파티 매칭 플랫폼
            </div>

            <h1 className="text-display sm:text-[2.75rem] lg:text-[3.5rem] font-bold tracking-tight mb-6">
              월드를 넘나들며
              <br />
              <span className="text-gradient-primary">파티원과 보스 레이드</span>
            </h1>

            <p className="text-body-lg sm:text-h3 text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              장비 인증으로 캐릭터 소유권을 확인하고,
              <br className="hidden sm:block" />
              매너 온도로 신뢰할 수 있는 파티원을 찾으세요.
            </p>

            <div className="flex justify-center">
              <Button size="xl" asChild className="shadow-lg">
                <Link href="/posts">
                  파티 둘러보기
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-h1 sm:text-display font-bold mb-4">왜 메-력소인가요?</h2>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            기존 파티 모집의 불편함을 해결하는 핵심 기능들
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="장비 기반 인증"
            description="넥슨 API로 실시간 장비 조회, 장착 챌린지로 소유권 확인"
            color="primary"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="월드 그룹 매칭"
            description="챌린저스·에오스/헬리오스·일반 서버별 자동 분류"
            color="eosHelios"
          />
          <FeatureCard
            icon={<ThermometerSun className="h-6 w-6" />}
            title="매너 온도"
            description="파티 활동 후 상호 리뷰로 신뢰도 축적"
            color="success"
          />
          <FeatureCard
            icon={<Swords className="h-6 w-6" />}
            title="보스 묶음 모집"
            description="여러 보스를 한 번에 묶어서 효율적인 파티 구성"
            color="challenger"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-b from-muted/50 to-muted py-16 sm:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-h1 sm:text-display font-bold mb-4">3단계로 시작하세요</h2>
            <p className="text-body-lg text-muted-foreground">
              간단한 절차만으로 신뢰받는 파티원이 될 수 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <StepCard
              step={1}
              title="캐릭터 연동"
              description="넥슨 API로 내 캐릭터를 메력소에 등록"
            />
            <StepCard
              step={2}
              title="소유권 인증"
              description="아이템 장착 챌린지로 캐릭터 소유주임을 인증"
            />
            <StepCard
              step={3}
              title="파티 참여"
              description="원하는 보스 파티를 만들거나 지원!"
            />
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/onboarding">
                무료로 시작하기
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 sm:py-12">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
                <Swords className="h-5 w-5" />
              </div>
              <span className="font-bold text-h3">메-력소</span>
            </div>
            <div className="text-center sm:text-right text-caption text-muted-foreground">
              <p>메-력소는 Nexon Open API가 제공해주는 데이터를 활용합니다.</p>
              <p className="mt-1">
                  문의: jangelliot0404@dgu.ac.kr
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "eosHelios" | "success" | "challenger";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    eosHelios: "bg-world-eosHelios/10 text-world-eosHelios",
    success: "bg-success/10 text-success",
    challenger: "bg-world-challenger/10 text-world-challenger",
  };

  return (
    <Card className="group hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-5 sm:p-6">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <h3 className="font-semibold text-h3 mb-2">{title}</h3>
        <p className="text-body-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center p-6">
      {/* Connector line (hidden on mobile, shown on md+) */}
      {step < 3 && (
        <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
      )}

      <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-h2 mb-4 shadow-lg">
        {step}
      </div>
      <h3 className="font-semibold text-h3 mb-2">{title}</h3>
      <p className="text-body-sm text-muted-foreground">{description}</p>
    </div>
  );
}
