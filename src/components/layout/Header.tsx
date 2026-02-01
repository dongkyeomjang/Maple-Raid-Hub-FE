"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TemperatureBadge } from "@/components/domain/TemperatureBadge";
import { LogoIcon } from "@/components/ui/Logo";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  User,
  LogOut,
  Menu,
  X,
  Swords,
  Users,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/posts", label: "파티 찾기", icon: Swords },
  { href: "/characters", label: "내 캐릭터", icon: Users },
  { href: "/me", label: "마이페이지", icon: User },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 온보딩, 로그인 페이지에서는 헤더 숨김
  if (pathname === "/onboarding" || pathname === "/login") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 mr-8 tap-highlight-none">
          <LogoIcon size="lg" />
          <div className="hidden sm:flex flex-col">
            <span className="text-body font-bold tracking-tight text-foreground leading-none">
              력소
            </span>
            <span className="text-tiny text-muted-foreground mt-0.5">
              당신만을 위한 메이플 인력소
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {isAuthenticated &&
            navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary text-caption font-semibold">
                    {user.nickname?.slice(0, 2) || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-body-sm font-medium leading-tight">
                    {user.nickname}
                  </span>
                  <TemperatureBadge temperature={user.temperature} size="sm" />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/onboarding">시작하기</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden ml-auto">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="tap-highlight-none"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-slide-down">
          <nav className="container py-3 space-y-1">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-muted/50">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user?.nickname?.slice(0, 2) || <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-body">{user?.nickname}</p>
                    <TemperatureBadge
                      temperature={user?.temperature || 36.5}
                      size="md"
                      showLabel
                    />
                  </div>
                </div>

                {/* Nav Items */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors tap-highlight-none",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-body">{item.label}</span>
                    </Link>
                  );
                })}

                {/* Logout */}
                <div className="pt-2 mt-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-3 h-auto text-muted-foreground hover:text-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="text-body">로그아웃</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2 px-1">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    로그인
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                    시작하기
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
