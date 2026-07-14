import { router, adminProcedure, protectedProcedure } from '../init';

export const adminRouter = router({
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const totalUsers = await ctx.db.user.count();
    const totalOrders = await ctx.db.order.count();
    
    return {
      totalUsers,
      totalOrders,
      message: "Welcome to the Admin Dashboard"
    };
  }),
});
