import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const createTRPCContext = async (opts?: { req?: Request; headers?: Headers }) => {
  let session = null;
  try {
    const reqHeaders = opts?.headers || (await headers());
    // Better Auth getSession
    session = await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch (error) {
    // Session fetching failed or we are in a build step where headers() is not available
  }

  return {
    db,
    session,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  // Check if the user has the 'admin' role
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin privileges required' });
  }
  return next({ ctx });
});
