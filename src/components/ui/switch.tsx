"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { type ComponentProps, forwardRef } from "react";
import { tv } from "tailwind-variants";

export const switchVariants = tv({
  slots: {
    root: "group relative inline-flex rounded-sm h-5 w-9 shrink-0 cursor-pointer items-center justify-center  outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page disabled:cursor-not-allowed disabled:opacity-50 transition-colors data-[checked]:bg-accent-green data-[unchecked]:bg-bg-surface data-[unchecked]:border data-[unchecked]:border-border-primary",
    thumb:
      "pointer-events-none block h-3 w-3 rounded-sm shadow-lg ring-0 transition-transform data-[checked]:translate-x-[0.45rem] data-[unchecked]:-translate-x-[0.45rem] data-[checked]:bg-black data-[unchecked]:bg-text-tertiary",
  },
});

export interface SwitchProps extends ComponentProps<typeof BaseSwitch.Root> {}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    const { root, thumb } = switchVariants();

    return (
      <BaseSwitch.Root
        ref={ref}
        className={root({ className: className as string })}
        {...props}
      >
        <BaseSwitch.Thumb className={thumb()} />
      </BaseSwitch.Root>
    );
  },
);

Switch.displayName = "Switch";
