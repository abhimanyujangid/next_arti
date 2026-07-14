import { router, publicProcedure } from "@/lib/trpc/init";

/** Credential flows live on better-auth (`/api/auth`); this exposes session for RSC/client. */
export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => ctx.session),
});
