export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 온보딩 페이지는 헤더 없이 전체 화면 레이아웃 사용
  return <>{children}</>;
}
