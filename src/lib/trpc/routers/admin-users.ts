import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, router } from "@/lib/trpc/init";

/** Better Auth user ids are strings; not always RFC UUID version-compliant. */
const userIdSchema = z.string().min(1);

const listInput = z
  .object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(20),
  })
  .optional();

export const adminUsersRouter = router({
  list: adminProcedure.input(listInput).query(async ({ ctx, input }) => {
    const page = input?.page ?? 1;
    const pageSize = input?.pageSize ?? 20;

    const [items, total] = await Promise.all([
      ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: { orders: true, productReviews: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      ctx.db.user.count(),
    ]);

    return { items, total, page, pageSize };
  }),

  getById: adminProcedure
    .input(z.object({ id: userIdSchema }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          addresses: {
            where: { deletedAt: null },
            orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
            select: {
              id: true,
              fullName: true,
              phone: true,
              line1: true,
              line2: true,
              city: true,
              state: true,
              pincode: true,
              country: true,
              isDefault: true,
            },
          },
          orders: {
            orderBy: { createdAt: "desc" },
            take: 50,
            select: {
              id: true,
              orderNumber: true,
              status: true,
              total: true,
              currency: true,
              createdAt: true,
              _count: { select: { items: true } },
            },
          },
          productReviews: {
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              rating: true,
              title: true,
              body: true,
              isApproved: true,
              createdAt: true,
              product: {
                select: { id: true, title: true, slug: true },
              },
            },
          },
          _count: {
            select: {
              orders: true,
              productReviews: true,
              wishlists: true,
            },
          },
          cart: {
            select: {
              _count: { select: { items: true } },
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      }

      const spent = await ctx.db.order.aggregate({
        where: {
          userId: input.id,
          status: { notIn: ["cancelled", "refunded"] },
        },
        _sum: { total: true },
      });

      const {
        orders,
        productReviews,
        _count,
        cart,
        ...profile
      } = user;

      return {
        ...profile,
        orders: orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          status: o.status,
          total: o.total,
          currency: o.currency,
          createdAt: o.createdAt,
          itemCount: o._count.items,
        })),
        reviews: productReviews,
        stats: {
          orderCount: _count.orders,
          orderTotalSpent: spent._sum.total ?? 0,
          reviewCount: _count.productReviews,
          wishlistCount: _count.wishlists,
          cartItemCount: cart?._count.items ?? 0,
        },
      };
    }),

  setRole: adminProcedure
    .input(
      z.object({
        id: userIdSchema,
        role: z.enum(["user", "admin"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot change your own role.",
        });
      }

      const target = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: { id: true, role: true },
      });
      if (!target) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      }

      if (target.role === "admin" && input.role === "user") {
        const adminCount = await ctx.db.user.count({
          where: { role: "admin" },
        });
        if (adminCount <= 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot demote the last admin.",
          });
        }
      }

      return ctx.db.user.update({
        where: { id: input.id },
        data: { role: input.role },
        select: { id: true, role: true },
      });
    }),
});
