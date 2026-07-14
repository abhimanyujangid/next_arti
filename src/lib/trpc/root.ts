import { router, publicProcedure } from './init';
import { uploadRouter } from './routers/upload';
import { authRouter } from './routers/auth';
import { adminRouter } from './routers/admin';
import { userRouter } from './routers/user';
import { catalogRouter } from './routers/catalog';

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return 'Hello World';
  }),
  upload: uploadRouter,
  auth: authRouter,
  admin: adminRouter,
  user: userRouter,
  catalog: catalogRouter,
});

export type AppRouter = typeof appRouter;
