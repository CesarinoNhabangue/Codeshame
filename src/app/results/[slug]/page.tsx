import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BundledLanguage } from "shiki";
import { ShareRoastModal } from "@/components/share-roast-modal";
import {
  AnalysisCardContent,
  AnalysisCardHeader,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CodeBlockContent,
  CodeBlockFileName,
  CodeBlockHeader,
  CodeBlockRoot,
} from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { LANGUAGES } from "@/lib/languages";
import { caller } from "@/trpc/server";

type RoastResult = {
  roast: {
    id: string;
    slug: string;
    title: string;
    score: string;
    code: string;
    fixedCode: string | null;
    summary: string;
    language: string;
    isPublic: boolean;
  };
  issues: {
    id: string;
    severity: string | null;
    title: string;
    description: string;
  }[];
};

function getSeverityVariant(score: number) {
  if (score >= 7) {
    return {
      badge: "not_that_bad",
      dotClass: "bg-accent-green",
      textClass: "text-accent-green",
      accentVariant: "good" as const,
    };
  }

  if (score >= 4) {
    return {
      badge: "could_be_worse",
      dotClass: "bg-accent-amber",
      textClass: "text-accent-amber",
      accentVariant: "warning" as const,
    };
  }

  return {
    badge: "needs_serious_help",
    dotClass: "bg-accent-red",
    textClass: "text-accent-red",
    accentVariant: "critical" as const,
  };
}

async function getRoastResult(slug: string): Promise<RoastResult> {
  return caller.roast.getBySlug({ slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { roast } = await getRoastResult(slug);
    const languageName =
      LANGUAGES[roast.language as keyof typeof LANGUAGES]?.name ||
      roast.language;
    const score = Number.parseFloat(roast.score).toFixed(1);
    const title = `${roast.title} scored ${score}/10`;
    const description = `${roast.summary} Review the ${languageName} submission, inspect the issues, and compare the AI-suggested fix.`;
    const imageUrl = `/results/${slug}/opengraph-image`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Roast not found",
      description: "This CodeShame result could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function RoastResults({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let result: RoastResult;

  try {
    result = await getRoastResult(slug);
  } catch {
    notFound();
  }

  const { roast, issues } = result;
  const score = Number.parseFloat(roast.score);
  const verdict = getSeverityVariant(score);
  const codeLines = roast.code.split("\n");
  const fixedCodeLines = roast.fixedCode ? roast.fixedCode.split("\n") : [];
  const fileExt =
    LANGUAGES[roast.language as keyof typeof LANGUAGES]?.ext || "txt";
  const languageName =
    LANGUAGES[roast.language as keyof typeof LANGUAGES]?.name || roast.language;
  const linesDelta = fixedCodeLines.length - codeLines.length;

  return (
    <main className="flex min-h-screen flex-col items-center bg-bg-page px-4 pt-12 pb-8 sm:px-10 sm:pt-28 sm:pb-12 md:px-20">
      <div className="relative z-10 flex w-full max-w-[1280px] flex-col gap-8 sm:gap-10">
        <section className="grid grid-cols-1 gap-6 rounded-2xl border border-border-primary/70 bg-bg-surface/80 p-5 sm:grid-cols-[auto,1fr] sm:gap-10 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <ScoreRing score={score} size={160} className="origin-center" />
            <Badge variant={verdict.accentVariant}>
              {roast.isPublic ? "public roast" : "private review"}
            </Badge>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${verdict.dotClass}`} />
                <span
                  className={`${verdict.textClass} font-mono text-[13px] font-medium`}
                >
                  verdict: {verdict.badge}
                </span>
              </div>
              <Badge variant="default">{languageName}</Badge>
              <Badge variant="default">{codeLines.length} lines</Badge>
              <Badge variant="default">{issues.length} focus points</Badge>
            </div>

            <h1 className="font-mono text-xl leading-relaxed text-text-primary sm:text-2xl">
              "{roast.summary}"
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
              Here is the breakdown of what hurt your score, plus a cleaned-up
              version you can use as a starting point. If the roast feels fair,
              share it. If it feels unfair, paste better code next time.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-border-primary/60 bg-bg-page/60 p-4">
                <p className="mb-1 font-mono text-xs text-text-tertiary">
                  score
                </p>
                <p className="font-mono text-2xl text-text-primary">
                  {score.toFixed(1)}
                  <span className="text-sm text-text-tertiary"> / 10</span>
                </p>
              </div>

              <div className="rounded-md border border-border-primary/60 bg-bg-page/60 p-4">
                <p className="mb-1 font-mono text-xs text-text-tertiary">
                  fixed output
                </p>
                <p className="font-mono text-2xl text-text-primary">
                  {fixedCodeLines.length || codeLines.length}
                  <span className="text-sm text-text-tertiary"> lines</span>
                </p>
              </div>

              <div className="rounded-md border border-border-primary/60 bg-bg-page/60 p-4">
                <p className="mb-1 font-mono text-xs text-text-tertiary">
                  line delta
                </p>
                <p className="font-mono text-2xl text-text-primary">
                  {linesDelta > 0 ? `+${linesDelta}` : linesDelta}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  className="h-12 w-full px-6 sm:h-10 sm:w-auto"
                >
                  $ analyze_another
                </Button>
              </Link>

              <Link href="/leaderboard" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  className="h-12 w-full px-6 sm:h-10 sm:w-auto"
                >
                  $ inspect_leaderboard
                </Button>
              </Link>

              <div className="w-full sm:w-auto">
                <ShareRoastModal slug={slug} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-md border border-border-primary/60 bg-bg-surface p-5">
            <p className="mb-2 font-mono text-xs text-accent-green">
              {"// summary"}
            </p>
            <p className="text-sm leading-relaxed text-text-secondary">
              Your strongest next move is to fix the highest-severity issue
              first, then compare the cleanup against the original before
              shipping anything.
            </p>
          </div>
          <div className="rounded-md border border-border-primary/60 bg-bg-surface p-5">
            <p className="mb-2 font-mono text-xs text-accent-amber">
              {"// sharing"}
            </p>
            <p className="text-sm leading-relaxed text-text-secondary">
              Public roasts can land in the leaderboard. Private reviews stay
              out of it and are better for real code you do not want exposed.
            </p>
          </div>
          <div className="rounded-md border border-border-primary/60 bg-bg-surface p-5">
            <p className="mb-2 font-mono text-xs text-accent-red">
              {"// compare"}
            </p>
            <p className="text-sm leading-relaxed text-text-secondary">
              Use the original and fixed blocks below to spot naming, logic, and
              structure changes quickly instead of reading the whole thing
              twice.
            </p>
          </div>
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-bold text-accent-green">
              {"//"}
            </span>
            <span className="font-mono text-[13px] font-bold text-text-primary">
              your_submission
            </span>
          </div>

          <CodeBlockRoot>
            <CodeBlockHeader>
              <CodeBlockFileName>
                {roast.title}.{fileExt}
              </CodeBlockFileName>
            </CodeBlockHeader>
            <CodeBlockContent
              code={roast.code}
              lang={roast.language as BundledLanguage}
              className="max-h-[424px]"
            />
          </CodeBlockRoot>
        </section>

        {issues.length > 0 ? (
          <>
            <div className="h-px w-full bg-border-primary" />

            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-bold text-accent-green">
                  {"//"}
                </span>
                <span className="font-mono text-[13px] font-bold text-text-primary">
                  detailed_analysis
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {issues.map((issue) => (
                  <AnalysisCardRoot
                    key={issue.id}
                    className="flex flex-col gap-3 p-5"
                  >
                    <AnalysisCardHeader className="p-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            issue.severity === "error"
                              ? "text-accent-red"
                              : issue.severity === "warning"
                                ? "text-accent-amber"
                                : "text-accent-green"
                          }
                        >
                          {issue.severity === "error"
                            ? "!"
                            : issue.severity === "warning"
                              ? "?"
                              : "+"}
                        </span>
                        <AnalysisCardTitle className="font-mono text-[13px] font-medium text-text-primary">
                          {issue.title}
                        </AnalysisCardTitle>
                      </div>
                    </AnalysisCardHeader>
                    <AnalysisCardContent className="p-0 text-xs leading-relaxed text-text-secondary">
                      {issue.description}
                    </AnalysisCardContent>
                  </AnalysisCardRoot>
                ))}
              </div>
            </section>
          </>
        ) : null}

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-accent-green">
                {"//"}
              </span>
              <span className="font-mono text-[13px] font-bold text-text-primary">
                suggested_fix
              </span>
            </div>
            <p className="font-mono text-xs text-text-tertiary">
              original: {codeLines.length} lines · fixed:{" "}
              {fixedCodeLines.length || codeLines.length} lines
            </p>
          </div>

          <CodeBlockRoot>
            <CodeBlockHeader>
              <CodeBlockFileName>
                {roast.title}_fixed.{fileExt}
              </CodeBlockFileName>
            </CodeBlockHeader>
            <div className="flex max-h-[500px] flex-col overflow-auto py-2 [tab-size:2]">
              {fixedCodeLines.length > 0 ? (
                fixedCodeLines.map((line, i) => (
                  <DiffLine key={String(i)} type="added" code={line} />
                ))
              ) : (
                <DiffLine
                  type="context"
                  code="// AI fixes will appear here soon"
                />
              )}
            </div>
          </CodeBlockRoot>
        </section>
      </div>
    </main>
  );
}
