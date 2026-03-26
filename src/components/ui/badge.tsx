import { type ComponentProps, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const badgeVariants = tv({
  base: "inline-flex rounded-md items-center gap-2  px-2.5 py-0.5 text-xs font-mono font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-border-primary focus:ring-offset-2 focus:ring-offset-bg-page",
  variants: {
    variant: {
      default: "bg-bg-surface text-text-primary border border-border-primary",
      critical: "bg-accent-red/10 text-accent-red border border-accent-red/20",
      warning:
        "bg-accent-amber/10 text-accent-amber border border-accent-amber/20",
      good: "bg-accent-green/10 text-accent-green border border-accent-green/20",
      verdict: "bg-text-primary text-bg-page",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends ComponentProps<"div">,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={badgeVariants({ variant, className })}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
