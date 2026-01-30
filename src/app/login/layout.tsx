export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 로그인 페이지는 헤더 없이 전체 화면 레이아웃 사용
  return <>{children}</>;
}
