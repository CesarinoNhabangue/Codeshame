import Link from "next/link";
import { Suspense } from "react";
import { LeaderboardCard } from "@/components/leaderboard-card";
import { Button } from "@/components/ui/button";
import { caller, HydrateClient, trpc } from "@/trpc/server";
import { LeaderboardStats } from "./leaderboard-stats";

async function LeaderboardList() {
  const entries = await caller.roast.getLeaderboard({ limit: 100 });

  return (
    <section className="flex flex-col w-full border border-border-primary/20 rounded-md overflow-hidden bg-bg-surface">
      {entries.map((entry) => (
        <LeaderboardCard key={entry.id} entry={entry} />
      ))}
    </section>
  );
}

function LeaderboardSkeleton() {
  return (
    <section className="flex flex-col w-full border border-border-primary/20 rounded-md overflow-hidden bg-bg-surface animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          key={i}
          className="h-[68px] border-b border-border-primary/10 bg-bg-elevated/50"
        />
      ))}
    </section>
  );
}

export default async function Leaderboard() {
  void trpc.roast.getStats.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center pt-12 pb-8 px-4 sm:pt-28 sm:pb-12 sm:px-10 bg-bg-page text-text-primary">
        <div className="flex flex-col w-full max-w-[960px] gap-8 sm:gap-10 z-10 relative">
          {/* Hero Section */}
          <section className="flex flex-col gap-4 items-center text-center sm:items-start sm:text-left">
            <header className="flex flex-col gap-2 sm:gap-3 items-center sm:items-start">
              <h1 className="flex items-center gap-2 sm:gap-3 font-mono text-3xl sm:text-5xl font-bold tracking-tight">
                <span className="text-accent-green">&gt;</span>
                <span className="text-text-primary">shame_leaderboard</span>
              </h1>
              <p className="text-text-secondary font-mono text-xs sm:text-sm opacity-80 whitespace-nowrap">
                {"// the most shamed code on the internet"}
              </p>
            </header>

            <LeaderboardStats />
          </section>

          <Suspense fallback={<LeaderboardSkeleton />}>
            <LeaderboardList />
          </Suspense>

          {/* Home button */}
          <div className="flex justify-center pt-4 w-full">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="font-mono text-xs w-full sm:w-auto h-12 sm:h-10 px-8"
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
