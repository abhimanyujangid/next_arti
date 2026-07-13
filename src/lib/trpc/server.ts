import { appRouter } from '@/lib/trpc/root';
import { createTRPCContext, t } from '@/lib/trpc/init';

const createCaller = t.createCallerFactory(appRouter);

/**
 * This is a server-side caller for tRPC.
 * It allows you to call your tRPC procedures directly from React Server Components (RSC).
 */
export const serverTrpc = async () => {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
};
