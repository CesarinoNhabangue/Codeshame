import { type ComponentProps, forwardRef } from "react";
import { tv } from "tailwind-variants";

export const analysisCardVariants = tv({
  slots: {
    root: "rounded-md border border-border-primary bg-bg-surface p-5 text-text-primary",
    header: "flex flex-col space-y-1.5 mb-3",
    title: "font-mono text-[13px] font-normal leading-none tracking-tight",
    description: "text-[12px] text-text-secondary font-mono leading-relaxed",
    content: "pt-0",
    footer: "flex items-center pt-4",
  },
});

export const AnalysisCardRoot = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { root } = analysisCardVariants();
  return <div ref={ref} className={root({ className })} {...props} />;
});
AnalysisCardRoot.displayName = "AnalysisCardRoot";

export const AnalysisCardHeader = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { header } = analysisCardVariants();
  return <div ref={ref} className={header({ className })} {...props} />;
});
AnalysisCardHeader.displayName = "AnalysisCardHeader";

export const AnalysisCardTitle = forwardRef<
  HTMLHeadingElement,
  ComponentProps<"h3">
>(({ className, ...props }, ref) => {
  const { title } = analysisCardVariants();
  return <h3 ref={ref} className={title({ className })} {...props} />;
});
AnalysisCardTitle.displayName = "AnalysisCardTitle";

export const AnalysisCardDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p">
>(({ className, ...props }, ref) => {
  const { description } = analysisCardVariants();
  return <p ref={ref} className={description({ className })} {...props} />;
});
AnalysisCardDescription.displayName = "AnalysisCardDescription";

export const AnalysisCardContent = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { content } = analysisCardVariants();
  return <div ref={ref} className={content({ className })} {...props} />;
});
AnalysisCardContent.displayName = "AnalysisCardContent";

export const AnalysisCardFooter = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { footer } = analysisCardVariants();
  return <div ref={ref} className={footer({ className })} {...props} />;
});
AnalysisCardFooter.displayName = "AnalysisCardFooter";
