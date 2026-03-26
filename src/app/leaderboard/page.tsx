import Link from "next/link";
import { Button } from "@/components/ui/button";
import { caller, HydrateClient, trpc } from "@/trpc/server";
import { LeaderboardBrowser } from "./leaderboard-browser";
import { LeaderboardStats } from "./leaderboard-stats";

export default async function Leaderboard() {
  void trpc.roast.getStats.prefetch();
  const entries = await caller.roast.getLeaderboard({ limit: 100 });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-bg-page px-4 pt-12 pb-8 text-text-primary sm:px-10 sm:pt-28 sm:pb-12">
        <div className="relative z-10 flex w-full max-w-[960px] flex-col gap-8 sm:gap-10">
          <section className="flex flex-col items-center gap-5 text-center sm:items-start sm:text-left">
            <header className="flex flex-col items-center gap-3 sm:items-start">
              <h1 className="flex items-center gap-2 font-mono text-3xl font-bold tracking-tight sm:gap-3 sm:text-5xl">
                <span className="text-accent-green">&gt;</span>
                <span className="text-text-primary">shame_leaderboard</span>
              </h1>
              <p className="text-xs font-mono text-text-secondary opacity-80 sm:text-sm">
                {"// the most shamed code on the internet, now filterable"}
              </p>
            </header>

            <LeaderboardStats />
          </section>

          <LeaderboardBrowser entries={entries} />

          <div className="flex justify-center pt-4 w-full">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="h-12 w-full px-8 font-mono text-xs sm:h-10 sm:w-auto"
              >
                &lt;&lt; back_home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
