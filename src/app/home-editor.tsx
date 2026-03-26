"use client";

import NumberFlow from "@number-flow/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/trpc/client";

export function HomeEditor() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [shameMode, setRoastMode] = useState(true);

  // Fallback para 0 caso os dados não tenham carregado ainda, permitindo a animação
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
      setIsNavigating(true);
      router.push(`/results/${slug}`);
    },
    onError: () => {
      setIsNavigating(false);
      alert("Failed to shame code! Please try again.");
    },
  });

  const handleRoast = () => {
    if (code.trim().length === 0 || createRoast.isPending || isNavigating)
      return;
    createRoast.mutate({
      code,
      language,
      shameMode,
    });
  };

  const isLoading = createRoast.isPending || isNavigating;

  return (
    <section className="flex flex-col items-center w-full max-w-[780px] gap-8">
      {/* Hero Title */}
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 font-mono text-3xl sm:text-4xl font-bold">
          <span className="text-accent-green hidden sm:inline-block">$</span>
          <span className="text-text-primary text-center">
            <span className="text-accent-green sm:hidden mr-2">$</span>submit
            your code.
            <br className="block sm:hidden" /> be shamed.
          </span>
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          {
            "// drop your code below and we'll rate it — brutally honest or full shame mode"
          }
        </p>
      </header>

      {/* newCode Input Area */}
      <div className="w-full">
        <CodeEditor
          placeholder="// paste your code here..."
          value={code}
          onChange={(val) => setCode(val)}
          onLanguageChange={setLanguage}
          shameMode={shameMode}
        />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-5 sm:gap-0 sm:h-10 mt-2 mb-16 sm:mb-0">
        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4 h-full w-full sm:w-auto">
          <div className="flex items-center gap-2 h-full">
            <Switch
              id="roast-mode"
              checked={shameMode}
              onCheckedChange={setRoastMode}
            />
            <span className="text-accent-green font-mono text-sm leading-none pt-0.5">
              shame mode
            </span>
          </div>
          <span className="inline-block text-text-tertiary font-mono text-xs leading-none pt-0.5 whitespace-nowrap">
            {shameMode
              ? "// maximum sarcasm enabled"
              : "// honest and private mode"}
          </span>
        </div>

        <Button
          variant="primary"
          disabled={code.trim().length === 0 || code.length > 5000 || isLoading}
          className="w-full sm:w-auto h-12 sm:h-full shrink-0"
          onClick={handleRoast}
        >
          {isLoading ? "$ shaming..." : "$ shame_my_code"}
        </Button>
      </div>

      {/* Footer Hint */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <span className="text-text-tertiary font-mono text-xs flex items-center gap-1">
          <NumberFlow value={totalCodes} /> codes shamed
        </span>
        <span className="text-text-tertiary font-mono text-xs">·</span>
        <span className="text-text-tertiary font-mono text-xs flex items-center gap-1">
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
