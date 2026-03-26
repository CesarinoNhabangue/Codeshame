"use client";

import NumberFlow from "@number-flow/react";
import { trpc } from "@/trpc/client";

export function HomeStatsFooter() {
  const { data: stats } = trpc.roast.getStats.useQuery();

  return (
    <div className="flex justify-center pt-2">
      <span className="text-text-tertiary font-mono text-xs flex items-center gap-1.5">
        showing top 3 of <NumberFlow value={stats?.totalCodes ?? 0} />{" "}
        submissions
      </span>
    </div>
  );
}
