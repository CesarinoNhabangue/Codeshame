import { notFound } from "next/navigation";
import type { BundledLanguage } from "shiki";
import { ShareRoastModal } from "@/components/share-roast-modal";
import {
  AnalysisCardContent,
  AnalysisCardHeader,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
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

export default async function RoastResults({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let result: {
    roast: {
      id: string;
      slug: string;
      title: string;
      score: string;
      code: string;
      fixedCode: string | null;
      summary: string;
      language: string;
    };
    issues: {
      id: string;
      severity: string | null;
      title: string;
      description: string;
    }[];
  };
  try {
    result = await caller.roast.getBySlug({ slug });
  } catch {
    notFound();
  }

  const { roast, issues } = result;
  const codeLines = roast.code.split("\n");
  const fixedCodeLines = roast.fixedCode ? roast.fixedCode.split("\n") : [];

  let severityBadge = "needs_serious_help";
  let severityColor = "bg-accent-red";
  let severityText = "text-accent-red";

  if (Number.parseFloat(roast.score) >= 7) {
    severityBadge = "not_that_bad";
    severityColor = "bg-accent-green";
    severityText = "text-accent-green";
  } else if (Number.parseFloat(roast.score) >= 4) {
    severityBadge = "could_be_worse";
    severityColor = "bg-accent-amber";
    severityText = "text-accent-amber";
  }

  const fileExt =
    LANGUAGES[roast.language as keyof typeof LANGUAGES]?.ext || "txt";

  return (
    <main className="flex min-h-screen flex-col items-center pt-12 pb-8 px-4 sm:pt-28 sm:pb-12 sm:px-10 md:px-20 bg-bg-page">
      <div className="flex flex-col w-full max-w-[1280px] gap-8 sm:gap-10 z-10 relative">
        {/* Score Hero */}
        <section className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-12 w-full">
          <ScoreRing
            score={Number.parseFloat(roast.score)}
            size={160}
            className="scale-75 -my-4 sm:my-0 sm:scale-100 origin-center sm:origin-left"
          />

          <div className="flex flex-col gap-4 flex-1 text-center sm:text-left w-full">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className={`w-2 h-2 rounded-full ${severityColor}`} />
              <span
                className={`${severityText} font-mono text-[13px] font-medium`}
              >
                verdict: {severityBadge}
              </span>
            </div>

            <h1 className="font-mono text-xl sm:text-2xl text-text-primary leading-relaxed">
              "{roast.summary}"
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-2 gap-6 sm:gap-0 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <span className="text-text-tertiary font-mono text-xs">
                  lang:{" "}
                  {LANGUAGES[roast.language as keyof typeof LANGUAGES]?.name ||
                    roast.language}
                </span>
                <span className="text-text-tertiary font-mono text-xs">·</span>
                <span className="text-text-tertiary font-mono text-xs">
                  {codeLines.length} lines
                </span>
              </div>

              <div className="w-full sm:w-auto">
                <ShareRoastModal slug={slug} />
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-border-primary" />

        {/* Submitted Code Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-[13px] font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-[13px] font-bold">
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

        {issues.length > 0 && (
          <>
            <div className="h-px w-full bg-border-primary" />

            {/* Analysis Section */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="text-accent-green font-mono text-[13px] font-bold">
                  {"//"}
                </span>
                <span className="text-text-primary font-mono text-[13px] font-bold">
                  detailed_analysis
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {issues.map((issue) => (
                  <AnalysisCardRoot
                    key={issue.id}
                    className="p-5 flex flex-col gap-3"
                  >
                    <AnalysisCardHeader className="p-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            issue.severity === "error"
                              ? "text-accent-red"
                              : "text-accent-amber"
                          }
                        >
                          {issue.severity === "error" ? "!" : "?"}
                        </span>
                        <AnalysisCardTitle className="font-mono text-[13px] font-medium text-text-primary">
                          {issue.title}
                        </AnalysisCardTitle>
                      </div>
                    </AnalysisCardHeader>
                    <AnalysisCardContent className="p-0 text-xs font-sans text-text-secondary leading-relaxed">
                      {issue.description}
                    </AnalysisCardContent>
                  </AnalysisCardRoot>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="h-px w-full bg-border-primary" />

        {/* Diff Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-[13px] font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-[13px] font-bold">
              suggested_fix
            </span>
          </div>

          <CodeBlockRoot>
            <CodeBlockHeader>
              <CodeBlockFileName>
                {roast.title}_fixed.{fileExt}
              </CodeBlockFileName>
            </CodeBlockHeader>
            <div className="flex flex-col py-2 max-h-[500px] overflow-auto [tab-size:2]">
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
