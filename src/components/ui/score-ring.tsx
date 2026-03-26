import { type ComponentProps, forwardRef } from "react";
import { tv } from "tailwind-variants";

export const scoreRingVariants = tv({
  slots: {
    root: "relative inline-flex items-center justify-center",
    svg: "-rotate-90 transform",
    backgroundCircle: "stroke-border-primary transition-colors",
    progressCircle: "transition-all duration-1000 ease-out fill-transparent",
    content: "absolute flex flex-col items-center justify-center font-mono",
    score: "text-[48px] font-bold leading-none text-text-primary",
    denominator: "text-[16px] text-text-tertiary leading-none",
  },
});

export interface ScoreRingProps extends ComponentProps<"div"> {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  (
    { className, score, maxScore = 10, size = 180, strokeWidth = 4, ...props },
    ref,
  ) => {
    const {
      root,
      svg,
      backgroundCircle,
      progressCircle,
      content,
      score: scoreSlot,
      denominator,
    } = scoreRingVariants();

    // Limit score between 0 and maxScore
    const clampedScore = Math.min(Math.max(score, 0), maxScore);
    const percentage = clampedScore / maxScore;

    let strokeColorClass = "stroke-accent-red";
    if (clampedScore >= 7) {
      strokeColorClass = "stroke-accent-green";
    } else if (clampedScore >= 4) {
      strokeColorClass = "stroke-accent-amber";
    }

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - percentage * circumference;

    return (
      <div
        ref={ref}
        className={root({ className })}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className={svg()}
          width={size}
          height={size}
          role="img"
          aria-label={`Score: ${clampedScore.toFixed(1)} out of ${maxScore}`}
        >
          <title>{`Score: ${clampedScore.toFixed(1)} out of ${maxScore}`}</title>
          <circle
            className={backgroundCircle()}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            className={`${progressCircle()} ${strokeColorClass}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className={content()}>
          <div className="flex items-baseline gap-[2px]">
            <span className={scoreSlot()}>{clampedScore.toFixed(1)}</span>
            <span className={denominator()}>/{maxScore}</span>
          </div>
        </div>
      </div>
    );
  },
);

ScoreRing.displayName = "ScoreRing";
