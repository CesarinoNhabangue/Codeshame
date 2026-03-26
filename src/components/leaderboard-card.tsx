import Link from "next/link";
import type { BundledLanguage } from "shiki";
import { LANGUAGES } from "@/lib/languages";

export interface LeaderboardEntry {
  id: string;
  slug: string;
  title: string;
  rank: number;
  score: number;
  lang: BundledLanguage;
  lines: number;
  code: string;
}

export function LeaderboardCard({ entry }: { entry: LeaderboardEntry }) {
  const ext =
    LANGUAGES[entry.lang as keyof typeof LANGUAGES]?.ext ||
    (entry.lang === "javascript" ? "js" : "txt");
  const filename = `${entry.title}.${ext}`;

  let scoreColor = "text-accent-green";
  if (entry.score < 4.0) {
    scoreColor = "text-accent-red";
  } else if (entry.score < 7.0) {
    scoreColor = "text-accent-amber";
  }

  // Format rank to be 2 digits e.g. 01, 02
  const formattedRank = String(entry.rank).padStart(2, "0");
  const formattedScore = entry.score.toFixed(1).padStart(4, " ");

  return (
    <Link
      href={`/results/${entry.slug}`}
      className="group flex items-center justify-between border-b border-border-primary/20 py-4 px-4 bg-transparent hover:bg-black/20 transition-colors duration-200"
    >
      <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
        {/* Rank */}
        <span className="font-mono text-sm text-text-tertiary w-6 sm:w-8 opacity-50 group-hover:opacity-100 transition-opacity">
          #{formattedRank}
        </span>

        {/* Filename */}
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="font-mono text-sm font-medium text-text-primary truncate">
            {filename}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6 shrink-0 ml-2 sm:ml-4">
        {/* Lines */}
        <span className="font-mono text-xs text-text-tertiary hidden sm:inline-block w-16 text-right">
          {entry.lines} lines
        </span>

        {/* Score */}
        <div className="flex items-center gap-1 sm:gap-2 w-16 sm:w-24 justify-end">
          <span className="font-mono text-xs text-text-tertiary hidden sm:inline">
            score:
          </span>
          <span className={`font-mono text-sm font-bold ${scoreColor}`}>
            {formattedScore}
          </span>
        </div>
      </div>
    </Link>
  );
}
