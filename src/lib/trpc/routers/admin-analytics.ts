import { z } from "zod";

import { adminProcedure, router } from "@/lib/trpc/init";

const rangeSchema = z.enum(["7d", "30d", "90d", "all"]).default("30d");

type AnalyticsRange = z.infer<typeof rangeSchema>;

const EXCLUDED_ORDER_STATUSES = ["cancelled", "refunded"] as const;

function getRangeBounds(range: AnalyticsRange) {
  const to = new Date();
  if (range === "all") {
    return { from: null as Date | null, to };
  }
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const from = new Date(to);
  from.setDate(from.getDate() - days);
  from.setHours(0, 0, 0, 0);
  return { from, to };
}

function toDayKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function createdAtWhere(from: Date | null) {
  return from ? { gte: from } : undefined;
}

function enumerateDays(from: Date, to: Date) {
  const days: string[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);
  while (cursor <= end) {
    days.push(toDayKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export const adminAnalyticsRouter = router({
  overview: adminProcedure
    .input(z.object({ range: rangeSchema }).optional())
    .query(async ({ ctx, input }) => {
      const range = input?.range ?? "30d";
      const { from, to } = getRangeBounds(range);
      const dateFilter = createdAtWhere(from);

      const revenueOrderWhere = {
        ...(dateFilter ? { createdAt: dateFilter } : {}),
        status: { notIn: [...EXCLUDED_ORDER_STATUSES] },
      };

      const [
        revenueOrders,
        statusGroups,
        signups,
        reviews,
        orderItems,
      ] = await Promise.all([
        ctx.db.order.findMany({
          where: revenueOrderWhere,
          select: { createdAt: true, total: true },
          orderBy: { createdAt: "asc" },
        }),
        ctx.db.order.groupBy({
          by: ["status"],
          where: dateFilter ? { createdAt: dateFilter } : undefined,
          _count: { id: true },
        }),
        ctx.db.user.findMany({
          where: dateFilter ? { createdAt: dateFilter } : undefined,
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
        }),
        ctx.db.productReview.findMany({
          where: dateFilter ? { createdAt: dateFilter } : undefined,
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
        }),
        ctx.db.orderItem.findMany({
          where: {
            order: revenueOrderWhere,
          },
          select: {
            titleSnapshot: true,
            qty: true,
            priceSnapshot: true,
          },
        }),
      ]);

      const revenueMap = new Map<string, { revenue: number; orders: number }>();
      for (const order of revenueOrders) {
        const day = toDayKey(order.createdAt);
        const entry = revenueMap.get(day) ?? { revenue: 0, orders: 0 };
        entry.revenue += order.total;
        entry.orders += 1;
        revenueMap.set(day, entry);
      }

      const signupMap = new Map<string, number>();
      for (const user of signups) {
        const day = toDayKey(user.createdAt);
        signupMap.set(day, (signupMap.get(day) ?? 0) + 1);
      }

      const reviewMap = new Map<string, number>();
      for (const review of reviews) {
        const day = toDayKey(review.createdAt);
        reviewMap.set(day, (reviewMap.get(day) ?? 0) + 1);
      }

      const dayKeys =
        from != null
          ? enumerateDays(from, to)
          : [
              ...new Set([
                ...revenueMap.keys(),
                ...signupMap.keys(),
                ...reviewMap.keys(),
              ]),
            ].sort();

      const revenueByDay = dayKeys.map((date) => ({
        date,
        revenue: revenueMap.get(date)?.revenue ?? 0,
        orders: revenueMap.get(date)?.orders ?? 0,
      }));

      const signupsByDay = dayKeys.map((date) => ({
        date,
        count: signupMap.get(date) ?? 0,
      }));

      const reviewsByDay = dayKeys.map((date) => ({
        date,
        count: reviewMap.get(date) ?? 0,
      }));

      const productAgg = new Map<
        string,
        { title: string; qty: number; revenue: number }
      >();
      for (const item of orderItems) {
        const existing = productAgg.get(item.titleSnapshot) ?? {
          title: item.titleSnapshot,
          qty: 0,
          revenue: 0,
        };
        existing.qty += item.qty;
        existing.revenue += item.priceSnapshot * item.qty;
        productAgg.set(item.titleSnapshot, existing);
      }

      const topProducts = [...productAgg.values()]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8)
        .map((p) => ({
          title: p.title,
          qty: p.qty,
          revenue: p.revenue,
        }));

      const ordersByStatus = statusGroups.map((g) => ({
        status: g.status,
        count: g._count.id,
      }));

      return {
        range,
        from: from?.toISOString() ?? null,
        to: to.toISOString(),
        revenueByDay,
        ordersByStatus,
        signupsByDay,
        reviewsByDay,
        topProducts,
      };
    }),
});
