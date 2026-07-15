import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma";

import { adminProcedure, router } from "@/lib/trpc/init";
import {
  ORDERS_PAGE_SIZE,
  ORDERS_RANGE_VALUES,
  ORDERS_SORT_BY_VALUES,
  ORDERS_SORT_DIR_VALUES,
  ORDERS_STATUS_VALUES,
  rangeToCreatedAtGte,
} from "@/feature/admin/lib/orders-params";

const ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

const listSelect = {
  id: true,
  orderNumber: true,
  status: true,
  total: true,
  currency: true,
  createdAt: true,
  user: {
    select: { id: true, name: true, email: true },
  },
  _count: { select: { items: true } },
} as const;

const detailSelect = {
  id: true,
  orderNumber: true,
  status: true,
  subtotal: true,
  shipping: true,
  tax: true,
  total: true,
  currency: true,
  razorpayOrderId: true,
  razorpayPaymentId: true,
  shippingAddress: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  addressId: true,
  user: {
    select: { id: true, name: true, email: true },
  },
  items: {
    select: {
      id: true,
      productId: true,
      titleSnapshot: true,
      imageSnapshot: true,
      priceSnapshot: true,
      qty: true,
    },
  },
  paymentHistories: {
    select: {
      id: true,
      event: true,
      amount: true,
      currency: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      failureCode: true,
      failureMessage: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  },
} as const;

export const adminOrdersRouter = router({
  list: adminProcedure
    .input(
      z
        .object({
          page: z.number().int().min(1).default(1),
          pageSize: z.number().int().min(1).max(100).default(ORDERS_PAGE_SIZE),
          range: z.enum(ORDERS_RANGE_VALUES).default("all"),
          status: z.enum(ORDERS_STATUS_VALUES).default("all"),
          sortBy: z.enum(ORDERS_SORT_BY_VALUES).default("createdAt"),
          sortDir: z.enum(ORDERS_SORT_DIR_VALUES).default("desc"),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const pageSize = input?.pageSize ?? ORDERS_PAGE_SIZE;
      const range = input?.range ?? "all";
      const status = input?.status ?? "all";
      const sortBy = input?.sortBy ?? "createdAt";
      const sortDir = input?.sortDir ?? "desc";

      const where: Prisma.OrderWhereInput = {
        status: status === "all" ? { not: "pending" } : status,
      };

      const gte = rangeToCreatedAtGte(range);
      if (gte) {
        where.createdAt = { gte };
      }

      const orderBy: Prisma.OrderOrderByWithRelationInput = {
        [sortBy]: sortDir,
      };

      const [items, total] = await Promise.all([
        ctx.db.order.findMany({
          where,
          select: listSelect,
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        ctx.db.order.count({ where }),
      ]);

      return { items, total, page, pageSize };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.id },
        select: detailSelect,
      });
      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }
      return order;
    }),

  setStatus: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        status: z.enum(ORDER_STATUSES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.order.findUnique({
        where: { id: input.id },
        select: { id: true, status: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }

      return ctx.db.order.update({
        where: { id: input.id },
        data: { status: input.status },
        select: { id: true, status: true },
      });
    }),
});
