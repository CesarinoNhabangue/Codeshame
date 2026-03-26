import Link from "next/link";
import { Suspense } from "react";
import { LeaderboardCard } from "@/components/leaderboard-card";
import { Button } from "@/components/ui/button";
import { caller, HydrateClient, trpc } from "@/trpc/server";
import { HomeEditor } from "./home-editor";
import { HomeStatsFooter } from "./home-stats-footer";

async function HomeLeaderboardList() {
  const top3 = await caller.roast.getLeaderboard({ limit: 3 });

  return (
    <div className="flex flex-col w-full border border-border-primary/20 rounded-md overflow-hidden bg-bg-surface">
      {top3.map((entry) => (
        <LeaderboardCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

function HomeLeaderboardSkeleton() {
  return (
    <div className="flex flex-col w-full border border-border-primary/20 rounded-md overflow-hidden bg-bg-surface animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          key={i}
          className="h-[68px] border-b border-border-primary/10 bg-bg-elevated/50"
        />
      ))}
    </div>
  );
}

export default async function Home() {
  // Prefetch stats para hidratar no Client Component (HomeEditor)
  void trpc.roast.getStats.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center pt-20 pb-16 px-4 sm:px-10 gap-8 bg-bg-page text-text-primary">
        {/* Editor Section */}
        <HomeEditor />

        {/* Spacer */}
        <div className="h-[48px]" />

        {/* Leaderboard Preview w-[960px] */}
        <section className="flex flex-col w-full max-w-[960px] gap-6">
          <header className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-accent-green font-mono text-sm font-bold">
                  {"//"}
                </span>
                <span className="text-text-primary font-mono text-sm font-bold">
                  shame_leaderboard
                </span>
              </div>
              <Link href="/leaderboard">
                <Button variant="link" className="text-xs h-8 px-3">
                  $ view_all &gt;&gt;
                </Button>
              </Link>
            </div>

            <p className="text-text-tertiary font-mono text-xs sm:text-sm -mt-2">
              {"// the worst code on the internet, ranked by shame"}
            </p>
          </header>

          <Suspense fallback={<HomeLeaderboardSkeleton />}>
            <HomeLeaderboardList />
          </Suspense>

          <HomeStatsFooter />
        </section>
      </main>
    </HydrateClient>
  );
}
