import { router, protectedProcedure } from '../init';

export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        _count: {
          select: { orders: true, wishlists: true }
        }
      }
    });
    return user;
  }),
});
