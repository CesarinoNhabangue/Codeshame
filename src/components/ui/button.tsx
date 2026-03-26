import { type ComponentProps, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex cursor-pointer rounded-md items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-green disabled:pointer-events-none disabled:opacity-50 font-mono",
  variants: {
    variant: {
      primary:
        "bg-accent-green text-black border border-accent-green enabled:hover:bg-black enabled:hover:text-accent-green font-medium",
      secondary:
        "border border-border-primary bg-transparent text-text-primary enabled:hover:bg-border-primary/50 font-normal",
      link: "border border-border-primary bg-transparent text-text-secondary enabled:hover:bg-border-primary/50 enabled:hover:text-text-primary font-normal",
      destructive:
        "bg-accent-red text-black enabled:hover:bg-accent-red/90 font-medium",
    },
    size: {
      primary: "px-[24px] py-[8px] text-[13px]",
      secondary: "px-[16px] py-[8px] text-[12px]",
      link: "px-[12px] py-[6px] text-[12px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "primary",
  },
});

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    // Se nenhum tamanho for especificado, definimos o tamanho correspondente à variante atual
    const resolvedSize = size || (variant as typeof size) || "primary";

    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size: resolvedSize, className })}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
