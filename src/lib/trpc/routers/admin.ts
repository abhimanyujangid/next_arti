import { router, adminProcedure } from "../init";
import { adminCategoriesRouter } from "./admin-categories";
import { adminProductsRouter } from "./admin-products";
import { adminReviewsRouter } from "./admin-reviews";
import { adminUsersRouter } from "./admin-users";
import { adminAnalyticsRouter } from "./admin-analytics";
import { adminOrdersRouter } from "./admin-orders";
import { adminContactsRouter } from "./admin-contacts";
import { adminJournalRouter } from "./admin-journal";

export const adminRouter = router({
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const [totalUsers, totalOrders] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.order.count({ where: { status: { not: "pending" } } }),
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
  analytics: adminAnalyticsRouter,
  orders: adminOrdersRouter,
  contacts: adminContactsRouter,
  journal: adminJournalRouter,
});
