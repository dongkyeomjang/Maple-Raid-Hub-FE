"use client";

import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { VerificationStatus } from "@/types/api";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

const statusConfig: Record<
  VerificationStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary"; icon: React.ElementType }
> = {
  UNVERIFIED_CLAIMED: { label: "미인증", variant: "secondary", icon: Clock },
  VERIFIED_OWNER: { label: "인증됨", variant: "success", icon: CheckCircle },
  DISPUTED: { label: "분쟁 중", variant: "warning", icon: AlertTriangle },
  REVOKED: { label: "무효화됨", variant: "destructive", icon: XCircle },
};

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn("gap-1", className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
