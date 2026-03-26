import { router } from "../init";
import { roastRouter } from "./roast";

export const appRouter = router({
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;
