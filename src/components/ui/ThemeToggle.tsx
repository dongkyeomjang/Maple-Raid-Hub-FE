"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" className={className} disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon =
    theme === "dark" ? (
      <Moon className="h-4 w-4" />
    ) : theme === "system" ? (
      <Monitor className="h-4 w-4" />
    ) : (
      <Sun className="h-4 w-4" />
    );

  const label =
    theme === "dark" ? "다크" : theme === "system" ? "시스템" : "라이트";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={cycleTheme}
      className={cn("text-muted-foreground hover:text-foreground", className)}
      title={`현재: ${label} (클릭하여 전환)`}
    >
      {icon}
    </Button>
  );
}

export function ThemeToggleExpanded({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const options = [
    { value: "light", label: "라이트", icon: Sun },
    { value: "dark", label: "다크", icon: Moon },
    { value: "system", label: "시스템", icon: Monitor },
  ] as const;

  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-lg bg-muted/50", className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-caption font-medium transition-all duration-200",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
