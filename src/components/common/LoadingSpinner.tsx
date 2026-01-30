import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mascot } from "@/components/brand/Mascot";
import { EASTER_EGGS } from "@/components/brand/brand-constants";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <Loader2 className={cn("animate-spin text-primary", sizes[size], className)} />
  );
}

interface LoadingPageProps {
  message?: string;
  showMascot?: boolean;
}

export function LoadingPage({ message, showMascot = true }: LoadingPageProps) {
  // 랜덤 로딩 메시지
  const randomMessage = message || EASTER_EGGS.loading[Math.floor(Math.random() * EASTER_EGGS.loading.length)];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {showMascot ? (
        <Mascot variant="default" size="lg" />
      ) : (
        <LoadingSpinner size="lg" />
      )}
      <p className="text-body-sm text-muted-foreground mt-4 animate-pulse">
        {randomMessage}
      </p>
    </div>
  );
}
