"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationStep = "start" | "equip" | "check" | "complete";

interface VerificationStepperProps {
  currentStep: VerificationStep;
  className?: string;
}

const steps: { id: VerificationStep; label: string }[] = [
  { id: "start", label: "인증 시작" },
  { id: "equip", label: "심볼 해제" },
  { id: "check", label: "해제 확인" },
  { id: "complete", label: "인증 완료" },
];

export function VerificationStepper({ currentStep, className }: VerificationStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-background",
                  isPending && "border-muted bg-muted"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  isCompleted && "text-primary",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-12 sm:w-16 md:w-24",
                  index < currentIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
