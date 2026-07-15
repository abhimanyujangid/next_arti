import { router, adminProcedure } from "../init";
import { adminCategoriesRouter } from "./admin-categories";
import { adminProductsRouter } from "./admin-products";
import { adminReviewsRouter } from "./admin-reviews";
import { adminUsersRouter } from "./admin-users";

export const adminRouter = router({
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const [totalUsers, totalOrders] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.order.count(),
    ]);

    return {
      totalUsers,
      totalOrders,
      message: "Welcome to the Admin Dashboard",
    };
  }),
  categories: adminCategoriesRouter,
  products: adminProductsRouter,
  reviews: adminReviewsRouter,
  users: adminUsersRouter,
});
