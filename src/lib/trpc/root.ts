import { router, publicProcedure } from './init';
import { uploadRouter } from './routers/upload';

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return 'Hello World';
  }),
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
