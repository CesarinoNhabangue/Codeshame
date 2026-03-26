"use client";

import NumberFlow from "@number-flow/react";
import { trpc } from "@/trpc/client";

export function LeaderboardStats() {
  const { data: stats } = trpc.roast.getStats.useQuery();

  return (
    <div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
      <span className="flex items-center gap-1.5">
        <NumberFlow value={stats?.totalCodes ?? 0} /> submissions
      </span>
      <span>·</span>
      <span className="flex items-center gap-2">
        avg score:
        <span className="text-accent-amber font-bold flex items-center">
          <NumberFlow
            value={stats?.avgScore ?? 0}
            format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          />
        </span>
      </span>
    </div>
  );
}
