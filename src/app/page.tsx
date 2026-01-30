import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo, LogoIcon } from "@/components/ui/Logo";
import { BRAND_SLOGANS } from "@/components/brand/brand-constants";
import { MuscleMushroomMascot, Mascot } from "@/components/brand/Mascot";
import { FeatureCard } from "@/components/brand/FeatureCard";
import { MarketingBadge } from "@/components/brand/MarketingBadge";
import { SocialProofSection } from "@/components/brand/SocialProofSection";
import {
  Swords,
  Shield,
  Users,
  ThermometerSun,
  ArrowRight,
  MessageCircle,
  CalendarClock,
  Globe,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-accent-50/30" />
        <div className="absolute inset-0 bg-maple-pattern opacity-30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />

        <div className="container relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* 근육 주황버섯 마스코트 */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <MuscleMushroomMascot size="xl" />
                {/* 파워 이펙트 */}
                <div className="absolute -inset-4 bg-gradient-radial from-primary/20 to-transparent rounded-full animate-pulse-soft -z-10" />
              </div>
            </div>

            {/* Badge */}
            <MarketingBadge variant="glow" size="lg" className="mb-6">
              <Globe className="h-4 w-4" />
              {BRAND_SLOGANS.main}
            </MarketingBadge>

            <h1 className="text-display sm:text-[2.75rem] lg:text-[3.5rem] font-bold tracking-tight mb-6">
              파티원이 필요하면
              <br />
              <span className="text-shimmer">메-력소</span>
            </h1>

            <p className="text-body-lg sm:text-h3 text-muted-foreground max-w-2xl mx-auto mb-2 leading-relaxed">
              월드통합 보스, 이제 서로 다른 서버 유저끼리도
              <br />
              <strong className="text-foreground">실시간 채팅</strong>과{" "}
              <strong className="text-foreground">일정 조율</strong>로 쉽게 파티를 구성하세요.
              <br />
              <strong className="text-foreground">노림발익검?</strong> 묶어서 한 번에 모집하세요.
            </p>

            <p className="text-body text-muted-foreground mb-5">
              {BRAND_SLOGANS.connect}
            </p>

            <div className="flex justify-center mb-4">
              <Button size="xl" asChild className="btn-maple">
                <Link href="/posts">
                  파티 둘러보기
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <SocialProofSection />
          </div>
        </div>
      </section>

      {/* Core Value Section - 핵심 차별점 */}
      <section className="container py-16 sm:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-caption font-medium">
            <Zap className="h-3.5 w-3.5" />
            메-력소만의 핵심 기능
          </div>
          <h2 className="text-h1 sm:text-display font-bold mb-4">
            다른 월드 유저와 소통하는 법
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            인게임에서는 불가능한 크로스 월드 소통,
            <br />
            메-력소에서는 가능합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* 실시간 채팅 카드 */}
          <Card className="feature-card-chat group card-cute">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-chat/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <MessageCircle className="h-7 w-7 text-chat" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-h2">실시간 채팅</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-chat/20 text-chat">NEW</span>
                  </div>
                  <p className="text-body text-muted-foreground mb-4 leading-relaxed">
                    스카니아 유저와 크로아 유저가 같은 채팅방에서 대화할 수 있어요.
                    파티 모집, 전략 공유, 시간 협의까지 한 곳에서!
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-body-sm text-chat-text">
                      <CheckCircle2 className="h-4 w-4 text-chat" />
                      월드 구분 없는 실시간 대화
                    </li>
                    <li className="flex items-center gap-2 text-body-sm text-chat-text">
                      <CheckCircle2 className="h-4 w-4 text-chat" />
                      파티 전용 채팅방 자동 생성
                    </li>
                    <li className="flex items-center gap-2 text-body-sm text-chat-text">
                      <CheckCircle2 className="h-4 w-4 text-chat" />
                      1:1 DM 및 그룹 채팅 지원
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 일정 조율 카드 */}
          <Card className="feature-card-schedule group card-cute">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-schedule/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <CalendarClock className="h-7 w-7 text-schedule" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-h2">일정 조율</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-schedule/20 text-schedule">SMART</span>
                  </div>
                  <p className="text-body text-muted-foreground mb-4 leading-relaxed">
                    다른 월드 유저들과 언제 같이 할지 투표로 정하세요.
                    모두가 가능한 시간을 한눈에 확인!
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-body-sm text-schedule-text">
                      <CheckCircle2 className="h-4 w-4 text-schedule" />
                      시간대별 참여 가능 여부 투표
                    </li>
                    <li className="flex items-center gap-2 text-body-sm text-schedule-text">
                      <CheckCircle2 className="h-4 w-4 text-schedule" />
                      히트맵으로 최적 시간 자동 추천
                    </li>
                    <li className="flex items-center gap-2 text-body-sm text-schedule-text">
                      <CheckCircle2 className="h-4 w-4 text-schedule" />
                      일정 확정 시 알림 발송
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 크로스 월드 설명 */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-muted/50 border border-border/50">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-world-challenger flex items-center justify-center text-white text-tiny font-bold border-2 border-white">
                스
              </div>
              <div className="w-8 h-8 rounded-full bg-world-eosHelios flex items-center justify-center text-white text-tiny font-bold border-2 border-white">
                크
              </div>
              <div className="w-8 h-8 rounded-full bg-world-normal flex items-center justify-center text-white text-tiny font-bold border-2 border-white">
                루
              </div>
            </div>
            <span className="text-body text-muted-foreground">
              스카니아, 크로아, 루나... <strong className="text-foreground">모든 월드</strong>가 연결됩니다
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-muted/30 to-muted/50 py-16 sm:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-h1 sm:text-display font-bold mb-4">
              신뢰할 수 있는 파티원 찾기
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
              장비 인증과 매너 온도로 검증된 유저와 함께하세요
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <FeatureCardSimple
              icon={<Shield className="h-6 w-6" />}
              title="장비 기반 인증"
              description="넥슨 API로 실시간 장비 조회, 장착 챌린지로 소유권 확인"
              color="primary"
            />
            <FeatureCardSimple
              icon={<Users className="h-6 w-6" />}
              title="월드 그룹 매칭"
              description="챌린저스·에오스/헬리오스·일반 서버별 자동 분류"
              color="eosHelios"
            />
            <FeatureCardSimple
              icon={<ThermometerSun className="h-6 w-6" />}
              title="매너 온도"
              description="파티 활동 후 상호 리뷰로 신뢰도 축적"
              color="success"
            />
            <FeatureCardSimple
              icon={<Swords className="h-6 w-6" />}
              title="보스 묶음 모집"
              description="여러 보스를 한 번에 묶어서 효율적인 파티 구성"
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-16 sm:py-24">
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
            description="넥슨 API로 내 캐릭터를 메-력소에 등록"
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
          <Button size="lg" asChild className="btn-maple">
            <Link href="/onboarding">
              무료로 시작하기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 sm:py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              <LogoIcon size="lg" />
              <div className="flex flex-col">
                <span className="text-body font-bold tracking-tight text-foreground leading-none">
                  력소
                </span>
                <span className="text-tiny text-muted-foreground mt-0.5">
                  메이플의 힘이 모이는 곳
                </span>
              </div>
            </div>
            <div className="text-center sm:text-right text-caption text-muted-foreground">
              <p>메-력소는 Nexon Open API가 제공해주는 데이터를 활용합니다.</p>
              <p className="mt-1">문의: jangelliot0404@dgu.ac.kr</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCardSimple({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "eosHelios" | "success" | "accent";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    eosHelios: "bg-world-eosHelios/10 text-world-eosHelios",
    success: "bg-success/10 text-success",
    accent: "bg-accent/10 text-accent-700",
  };

  return (
    <Card className="group card-cute">
      <CardContent className="p-5 sm:p-6">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6 ${colorClasses[color]}`}
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
    <div className="relative text-center p-6 group">
      {/* Connector line */}
      {step < 3 && (
        <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
      )}

      <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-maple text-white font-bold text-h2 mb-4 shadow-lg shadow-primary/25 group-hover:scale-110 group-hover:shadow-glow transition-all">
        {step}
      </div>
      <h3 className="font-semibold text-h3 mb-2">{title}</h3>
      <p className="text-body-sm text-muted-foreground">{description}</p>
    </div>
  );
}
