import { initTRPC } from "@trpc/server";
import { db } from "@/db";

export const createTRPCContext = async (opts?: { req?: Request }) => {
  let ip = "127.0.0.1";
  if (opts?.req) {
    const forwardedFor = opts.req.headers.get("x-forwarded-for");
    if (forwardedFor) {
      ip = forwardedFor.split(",")[0].trim();
    }
  }
  return { db, ip };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
