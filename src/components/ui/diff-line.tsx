import { type ComponentProps, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const diffLineVariants = tv({
  base: "flex w-full items-start gap-2 px-4 py-0 min-h-[24px] font-mono text-[13px] leading-[24px] whitespace-pre",
  variants: {
    type: {
      added: "bg-bg-diff-added",
      removed: "bg-bg-diff-removed",
      context: "bg-transparent",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

export const diffPrefixVariants = tv({
  base: "w-4 select-none",
  variants: {
    type: {
      added: "text-accent-green",
      removed: "text-accent-red",
      context: "text-text-tertiary",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

export const diffCodeVariants = tv({
  base: "flex-1",
  variants: {
    type: {
      added: "text-text-primary",
      removed: "text-text-secondary",
      context: "text-text-secondary",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

export interface DiffLineProps
  extends ComponentProps<"div">,
    VariantProps<typeof diffLineVariants> {
  prefix?: string;
  code: string;
}

export const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type = "context", prefix, code, ...props }, ref) => {
    // If prefix is not provided, use a smart default based on the type
    const defaultPrefix =
      type === "added" ? "+" : type === "removed" ? "-" : " ";
    const resolvedPrefix = prefix ?? defaultPrefix;

    return (
      <div
        ref={ref}
        className={diffLineVariants({ type, className })}
        {...props}
      >
        <span className={diffPrefixVariants({ type })}>{resolvedPrefix}</span>
        <span className={diffCodeVariants({ type })}>{code}</span>
      </div>
    );
  },
);

DiffLine.displayName = "DiffLine";
