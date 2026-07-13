import { router, publicProcedure } from './init';
import { uploadRouter } from './routers/upload';
import { authRouter } from './routers/auth';

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return 'Hello World';
  }),
  upload: uploadRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
