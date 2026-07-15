import { router, publicProcedure } from './init';
import { uploadRouter } from './routers/upload';
import { authRouter } from './routers/auth';
import { adminRouter } from './routers/admin';
import { userRouter } from './routers/user';
import { catalogRouter } from './routers/catalog';
import { cartRouter } from './routers/cart';
import { wishlistRouter } from './routers/wishlist';

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return 'Hello World';
  }),
  upload: uploadRouter,
  auth: authRouter,
  admin: adminRouter,
  user: userRouter,
  catalog: catalogRouter,
  cart: cartRouter,
  wishlist: wishlistRouter,
});

export type AppRouter = typeof appRouter;
