"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LeaderboardCard,
  type LeaderboardEntry,
} from "@/components/leaderboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/languages";

const SCORE_FILTERS = [
  { id: "all", label: "all scores" },
  { id: "critical", label: "0.0 - 3.9" },
  { id: "warning", label: "4.0 - 6.9" },
  { id: "good", label: "7.0 - 10.0" },
] as const;

type ScoreFilter = (typeof SCORE_FILTERS)[number]["id"];

export function LeaderboardBrowser({
  entries,
}: {
  entries: LeaderboardEntry[];
}) {
  const [languageFilter, setLanguageFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");

  const availableLanguages = useMemo(() => {
    const unique = new Set(entries.map((entry) => entry.lang));
    return ["all", ...Array.from(unique).sort()];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const languageMatch =
        languageFilter === "all" || entry.lang === languageFilter;

      const scoreMatch =
        scoreFilter === "all" ||
        (scoreFilter === "critical" && entry.score < 4) ||
        (scoreFilter === "warning" && entry.score >= 4 && entry.score < 7) ||
        (scoreFilter === "good" && entry.score >= 7);

      return languageMatch && scoreMatch;
    });
  }, [entries, languageFilter, scoreFilter]);

  const stats = useMemo(() => {
    if (filteredEntries.length === 0) {
      return {
        lowestScore: 0,
        highestScore: 0,
        avgLines: 0,
      };
    }

    const lowestScore = Math.min(
      ...filteredEntries.map((entry) => entry.score),
    );
    const highestScore = Math.max(
      ...filteredEntries.map((entry) => entry.score),
    );
    const avgLines =
      filteredEntries.reduce((sum, entry) => sum + entry.lines, 0) /
      filteredEntries.length;

    return {
      lowestScore,
      highestScore,
      avgLines,
    };
  }, [filteredEntries]);

  const highlightedEntry = filteredEntries[0];

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-md border border-border-primary/70 bg-bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="font-mono text-xs text-accent-green">{"//"}</span>
            <span className="font-mono text-sm text-text-primary">
              explore_the_damage
            </span>
          </div>

          <div className="mb-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => setLanguageFilter(language)}
                  className={`rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
                    languageFilter === language
                      ? "border-accent-green bg-accent-green/10 text-accent-green"
                      : "border-border-primary bg-bg-page text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {language === "all"
                    ? "all languages"
                    : LANGUAGES[language]?.name || language}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {SCORE_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setScoreFilter(filter.id)}
                  className={`rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
                    scoreFilter === filter.id
                      ? "border-accent-amber bg-accent-amber/10 text-accent-amber"
                      : "border-border-primary bg-bg-page text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{filteredEntries.length} matches</Badge>
            <Badge variant="critical">
              lowest {stats.lowestScore.toFixed(1)}
            </Badge>
            <Badge variant="warning">
              highest {stats.highestScore.toFixed(1)}
            </Badge>
            <Badge variant="good">avg {stats.avgLines.toFixed(0)} lines</Badge>
          </div>
        </div>

        <div className="rounded-md border border-border-primary/70 bg-bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="font-mono text-xs text-accent-red">{"//"}</span>
            <span className="font-mono text-sm text-text-primary">
              current_lowlight
            </span>
          </div>

          {highlightedEntry ? (
            <div className="flex flex-col gap-3">
              <Badge variant="critical">
                #{String(highlightedEntry.rank).padStart(2, "0")}
              </Badge>
              <p className="font-mono text-lg text-text-primary">
                {highlightedEntry.title}
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                {LANGUAGES[highlightedEntry.lang]?.name ||
                  highlightedEntry.lang}{" "}
                · {highlightedEntry.lines} lines · score{" "}
                {highlightedEntry.score.toFixed(1)}
              </p>
              <div>
                <Link href={`/results/${highlightedEntry.slug}`}>
                  <Button variant="secondary" className="h-10 px-4">
                    $ open_roast
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-text-secondary">
              No roasts matched the selected filters. Loosen the filters and try
              again.
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col overflow-hidden rounded-md border border-border-primary/20 bg-bg-surface">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry, index) => (
            <LeaderboardCard
              key={entry.id}
              entry={{ ...entry, rank: index + 1 }}
            />
          ))
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="font-mono text-sm text-text-secondary">
              No entries for this filter combo yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
