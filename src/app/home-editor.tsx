"use client";

import NumberFlow from "@number-flow/react";
import { Sparkles, TerminalSquare, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/trpc/client";

const SAMPLE_SNIPPETS = [
  {
    id: "javascript",
    label: "Buggy JS",
    language: "javascript",
    code: `function total(items) {
  let result = 0
  for (let i = 0; i <= items.length; i++) {
    result += items[i].price
  }
  return result
}`,
  },
  {
    id: "python",
    label: "Messy Python",
    language: "python",
    code: `def fetch_users(db):
    users = db.query("select * from users")
    for user in users:
        if user["active"] == True:
            print("sending email to", user["email"])
            send_email(user["email"])
    return users`,
  },
  {
    id: "sql",
    label: "Scary SQL",
    language: "sql",
    code: `SELECT *
FROM orders
WHERE status != 'cancelled'
OR total > 0
ORDER BY created_at;`,
  },
] as const;

export function HomeEditor() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [shameMode, setRoastMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: stats } = trpc.roast.getStats.useQuery();

  const [totalCodes, setTotalCodes] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    if (stats) {
      setTotalCodes(stats.totalCodes);
      setAvgScore(stats.avgScore);
    }
  }, [stats]);

  const [isNavigating, setIsNavigating] = useState(false);

  const createRoast = trpc.roast.create.useMutation({
    onSuccess: (slug) => {
      setErrorMessage(null);
      setIsNavigating(true);
      router.push(`/results/${slug}`);
    },
    onError: (error) => {
      setIsNavigating(false);
      setErrorMessage(
        error.message || "Failed to analyze your code. Please try again.",
      );
    },
  });

  const handleRoast = () => {
    if (code.trim().length === 0 || createRoast.isPending || isNavigating) {
      return;
    }

    setErrorMessage(null);
    createRoast.mutate({
      code,
      language,
      shameMode,
    });
  };

  const applySample = (sample: (typeof SAMPLE_SNIPPETS)[number]) => {
    setCode(sample.code);
    setLanguage(sample.language);
    setErrorMessage(null);
  };

  const isLoading = createRoast.isPending || isNavigating;

  return (
    <section className="flex w-full max-w-[820px] flex-col items-center gap-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="flex flex-col items-center gap-2 font-mono text-3xl font-bold sm:flex-row sm:gap-3 sm:text-4xl">
          <span className="hidden text-accent-green sm:inline-block">$</span>
          <span className="text-center text-text-primary">
            <span className="mr-2 text-accent-green sm:hidden">$</span>submit
            your code.
            <br className="block sm:hidden" /> be shamed.
          </span>
        </h1>
        <p className="text-sm font-mono text-text-secondary">
          {
            "// drop your code below and we'll rate it - brutally honest or full shame mode"
          }
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="good">instant language detection</Badge>
        <Badge variant="warning">3 concrete issues</Badge>
        <Badge variant="default">fixed version included</Badge>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        {SAMPLE_SNIPPETS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => applySample(sample)}
            className="group flex flex-col items-start gap-3 rounded-md border border-border-primary/70 bg-bg-surface px-4 py-4 text-left transition-colors hover:border-accent-green/40 hover:bg-bg-surface/80"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-accent-green">$</span>
              <span className="font-mono text-sm text-text-primary">
                {sample.label}
              </span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-text-secondary">
              load a sample and see how the roast behaves before using your own
              code
            </p>
            <span className="font-mono text-[11px] text-text-tertiary group-hover:text-text-secondary">
              click to fill the editor
            </span>
          </button>
        ))}
      </div>

      <div className="w-full">
        <CodeEditor
          placeholder="// paste your code here..."
          value={code}
          onChange={(val) => setCode(val)}
          onLanguageChange={setLanguage}
          shameMode={shameMode}
        />
      </div>

      {errorMessage ? (
        <div className="w-full rounded-md border border-accent-red/30 bg-accent-red/10 px-4 py-3">
          <p className="font-mono text-sm text-accent-red">{errorMessage}</p>
        </div>
      ) : null}

      <div className="mt-2 mb-8 flex h-auto w-full flex-col items-start justify-between gap-5 sm:mb-0 sm:h-10 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex h-full w-full flex-row flex-wrap items-center gap-2 sm:w-auto sm:gap-4">
          <div className="flex h-full items-center gap-2">
            <Switch
              id="roast-mode"
              checked={shameMode}
              onCheckedChange={setRoastMode}
            />
            <span className="pt-0.5 font-mono text-sm leading-none text-accent-green">
              shame mode
            </span>
          </div>
          <span className="inline-block whitespace-nowrap pt-0.5 font-mono text-xs leading-none text-text-tertiary">
            {shameMode
              ? "// maximum sarcasm enabled and eligible for the leaderboard"
              : "// honest, private, and focused on cleanup"}
          </span>
        </div>

        <Button
          variant="primary"
          disabled={code.trim().length === 0 || code.length > 5000 || isLoading}
          className="h-12 w-full shrink-0 sm:h-full sm:w-auto"
          onClick={handleRoast}
        >
          {isLoading ? "$ shaming..." : "$ shame_my_code"}
        </Button>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border-primary/60 bg-bg-surface p-4">
          <div className="mb-2 flex items-center gap-2">
            <TerminalSquare className="h-4 w-4 text-accent-green" />
            <span className="font-mono text-sm text-text-primary">
              what to paste
            </span>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            snippets, components, SQL queries, scripts, config files, or any
            ugly block that deserves a second opinion.
          </p>
        </div>

        <div className="rounded-md border border-border-primary/60 bg-bg-surface p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-amber" />
            <span className="font-mono text-sm text-text-primary">
              mode difference
            </span>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            shame mode publishes your roast to the leaderboard; honest mode
            stays private and focuses on practical feedback.
          </p>
        </div>

        <div className="rounded-md border border-border-primary/60 bg-bg-surface p-4">
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-accent-red" />
            <span className="font-mono text-sm text-text-primary">
              what you get back
            </span>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            a score, a sharp verdict, three issues to fix first, and a
            cleaned-up version of your code.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <span className="flex items-center gap-1 font-mono text-xs text-text-tertiary">
          <NumberFlow value={totalCodes} /> codes shamed
        </span>
        <span className="font-mono text-xs text-text-tertiary">·</span>
        <span className="flex items-center gap-1 font-mono text-xs text-text-tertiary">
          avg score:{" "}
          <NumberFlow
            value={avgScore}
            format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          />
          /10
        </span>
      </div>
    </section>
  );
}
