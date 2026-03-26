import { type ComponentProps, forwardRef } from "react";
import { type BundledLanguage, codeToHtml } from "shiki";
import { tv } from "tailwind-variants";

export const codeBlockVariants = tv({
  slots: {
    root: [
      "flex flex-col rounded-md w-full overflow-hidden border border-border-primary bg-bg-input",
      "shadow-2xl shadow-black/40",
    ],
    header:
      "flex h-10 shrink-0 items-center justify-between border-b border-border-primary px-4 relative bg-bg-surface z-20",
    controls: "flex items-center gap-2 w-20 z-10",
    controlRed: "size-3 rounded-full bg-accent-red opacity-80",
    controlAmber: "size-3 rounded-full bg-accent-amber opacity-80",
    controlGreen: "size-3 rounded-full bg-accent-green opacity-80",
    fileNameContainer:
      "flex items-center justify-end flex-1 pointer-events-none pr-2",
    fileName: "font-mono text-[11px] sm:text-xs text-text-tertiary/70",
    contentContainer: "flex-1 bg-bg-input overflow-hidden",
    content:
      "p-4 overflow-x-auto text-[13px] font-mono leading-[24px] [tab-size:2]",
  },
});

export const CodeBlockRoot = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const { root } = codeBlockVariants();
    return <div ref={ref} className={root({ className })} {...props} />;
  },
);
CodeBlockRoot.displayName = "CodeBlockRoot";

export const CodeBlockHeader = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ children, className, ...props }, ref) => {
  const { header, controls, controlRed, controlAmber, controlGreen } =
    codeBlockVariants();

  return (
    <div ref={ref} className={header({ className })} {...props}>
      <div className={controls()}>
        <span className={controlRed()} />
        <span className={controlAmber()} />
        <span className={controlGreen()} />
      </div>
      {children}
    </div>
  );
});
CodeBlockHeader.displayName = "CodeBlockHeader";

export const CodeBlockFileName = forwardRef<
  HTMLSpanElement,
  ComponentProps<"span">
>(({ className, ...props }, ref) => {
  const { fileNameContainer, fileName } = codeBlockVariants();
  return (
    <div className={fileNameContainer()}>
      <span ref={ref} className={fileName({ className })} {...props} />
    </div>
  );
});
CodeBlockFileName.displayName = "CodeBlockFileName";

export interface CodeBlockContentProps extends ComponentProps<"div"> {
  code: string;
  lang?: BundledLanguage;
}

export async function CodeBlockContent({
  code,
  lang = "javascript",
  className,
  ...props
}: CodeBlockContentProps) {
  const { contentContainer, content } = codeBlockVariants();

  // Use Shiki to generate syntax highlighted HTML with Vesper theme
  const highlightedHtml = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return (
    <div className={contentContainer()}>
      <div
        className={content({ className })}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        {...props}
      />
    </div>
  );
}
