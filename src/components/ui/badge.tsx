import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border text-tiny font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline:
          "border-border text-foreground bg-transparent",
        // World Group variants
        challenger:
          "bg-world-challenger-bg text-world-challenger-text border-world-challenger-border",
        eosHelios:
          "bg-world-eosHelios-bg text-world-eosHelios-text border-world-eosHelios-border",
        normal:
          "bg-world-normal-bg text-world-normal-text border-world-normal-border",
        // Status variants
        success:
          "bg-success-bg text-success-text border-transparent",
        warning:
          "bg-warning-bg text-warning-text border-transparent",
        error:
          "bg-error-bg text-error-text border-transparent",
        info:
          "bg-info-bg text-info-text border-transparent",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "px-2 py-0.5 text-[11px]",
        lg: "px-3 py-1 text-caption",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
