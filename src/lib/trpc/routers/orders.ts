import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma";

import { protectedProcedure, router } from "@/lib/trpc/init";
import {
  getRazorpayClient,
  getRazorpayKeyId,
  inrToPaise,
  verifyRazorpaySignature,
} from "@/lib/razorpay";
import { calcGst, calcOrderTotal } from "@/lib/pricing";

const cartItemInput = z.object({
  productId: z.string().cuid(),
  qty: z.number().int().min(1).max(99),
});

const newAddressInput = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(8),
  line1: z.string().trim().min(3),
  line2: z.string().trim().optional().nullable(),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  pincode: z.string().trim().min(4),
  country: z.string().trim().min(2).default("India"),
  isDefault: z.boolean().default(false),
});

const addressSnapshotSelect = {
  id: true,
  fullName: true,
  phone: true,
  line1: true,
  line2: true,
  city: true,
  state: true,
  pincode: true,
  country: true,
} as const;

type AddressSnapshot = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

function toSnapshot(addr: AddressSnapshot & { id?: string }) {
  return {
    fullName: addr.fullName,
    phone: addr.phone,
    line1: addr.line1,
    line2: addr.line2,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    country: addr.country,
  };
}

async function nextOrderNumber(db: typeof import("@/lib/db").db) {
  const year = new Date().getFullYear();
  const prefix = `AS-${year}-`;
  const latest = await db.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  let seq = 1;
  if (latest?.orderNumber) {
    const part = latest.orderNumber.slice(prefix.length);
    const n = Number.parseInt(part, 10);
    if (Number.isFinite(n)) seq = n + 1;
  }
  return `${prefix}${String(seq).padStart(5, "0")}`;
}

async function clearUserCart(
  db: typeof import("@/lib/db").db,
  userId: string,
) {
  const cart = await db.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await db.cartItem.deleteMany({ where: { cartId: cart.id } });
}

const myOrderSelect = {
  id: true,
  orderNumber: true,
  status: true,
  total: true,
  currency: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      titleSnapshot: true,
      qty: true,
      priceSnapshot: true,
      imageSnapshot: true,
    },
  },
} as const;

const myOrderDetailSelect = {
  id: true,
  orderNumber: true,
  status: true,
  subtotal: true,
  shipping: true,
  tax: true,
  total: true,
  currency: true,
  shippingAddress: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      titleSnapshot: true,
      imageSnapshot: true,
      priceSnapshot: true,
      qty: true,
    },
  },
} as const;

export const ordersRouter = router({
  myList: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.order.findMany({
      where: {
        userId: ctx.session.user.id,
        status: { not: "pending" },
      },
      select: myOrderSelect,
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
          status: { not: "pending" },
        },
        select: myOrderDetailSelect,
      });
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found.",
        });
      }
      return order;
    }),

  createPaymentOrder: protectedProcedure
    .input(
      z.object({
        items: z.array(cartItemInput).min(1),
        addressId: z.string().cuid().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const productIds = input.items.map((i) => i.productId);
      const products = await ctx.db.product.findMany({
        where: {
          id: { in: productIds },
          isAvailable: true,
        },
        select: {
          id: true,
          title: true,
          priceOriginal: true,
          priceDiscounted: true,
          stock: true,
          images: {
            select: { url: true },
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      });

      if (products.length !== productIds.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more products are unavailable.",
        });
      }

      const byId = new Map(products.map((p) => [p.id, p]));
      let subtotal = 0;
      const lineItems: {
        productId: string;
        titleSnapshot: string;
        imageSnapshot: string | null;
        priceSnapshot: number;
        qty: number;
      }[] = [];

      for (const item of input.items) {
        const product = byId.get(item.productId);
        if (!product) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Product not found.",
          });
        }
        if (product.stock < item.qty) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Insufficient stock for ${product.title}.`,
          });
        }
        const price = product.priceDiscounted ?? product.priceOriginal;
        subtotal += price * item.qty;
        lineItems.push({
          productId: product.id,
          titleSnapshot: product.title,
          imageSnapshot: product.images[0]?.url ?? null,
          priceSnapshot: price,
          qty: item.qty,
        });
      }

      const shipping = 0;
      const tax = calcGst(subtotal);
      const total = calcOrderTotal({ subtotal, shipping });

      let shippingAddress: Prisma.InputJsonValue = {};
      let addressId: string | null = null;

      if (input.addressId) {
        const address = await ctx.db.address.findFirst({
          where: {
            id: input.addressId,
            userId,
            deletedAt: null,
          },
          select: addressSnapshotSelect,
        });
        if (!address) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Address not found.",
          });
        }
        addressId = address.id;
        shippingAddress = toSnapshot(address);
      }

      const orderNumber = await nextOrderNumber(ctx.db);
      const amountPaise = inrToPaise(total);

      const razorpay = getRazorpayClient();
      const keyId = getRazorpayKeyId();
      if (!keyId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Razorpay key is not configured.",
        });
      }

      const rzOrder = await razorpay.orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: orderNumber,
        notes: { userId, orderNumber },
      });

      const order = await ctx.db.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          status: "pending",
          subtotal,
          shipping,
          tax,
          total,
          currency: "INR",
          razorpayOrderId: rzOrder.id,
          shippingAddress,
          items: {
            create: lineItems,
          },
        },
        select: { id: true, orderNumber: true },
      });

      await ctx.db.paymentHistory.create({
        data: {
          orderId: order.id,
          event: "initiated",
          amount: total,
          currency: "INR",
          razorpayOrderId: rzOrder.id,
        },
      });

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        razorpayOrderId: rzOrder.id,
        amountPaise,
        currency: "INR",
        keyId,
      };
    }),

  reportPaymentEvent: protectedProcedure
    .input(
      z.object({
        orderId: z.string().cuid(),
        event: z.enum(["failed", "cancelled"]),
        razorpayPaymentId: z.string().min(1).optional().nullable(),
        failureCode: z.string().max(100).optional().nullable(),
        failureMessage: z.string().max(500).optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: { id: input.orderId, userId: ctx.session.user.id },
        select: {
          id: true,
          total: true,
          currency: true,
          razorpayOrderId: true,
        },
      });
      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }

      await ctx.db.paymentHistory.create({
        data: {
          orderId: order.id,
          event: input.event,
          amount: order.total,
          currency: order.currency,
          razorpayOrderId: order.razorpayOrderId,
          razorpayPaymentId: input.razorpayPaymentId ?? null,
          failureCode: input.failureCode ?? null,
          failureMessage: input.failureMessage ?? null,
        },
      });

      return { ok: true as const };
    }),

  verifyAndComplete: protectedProcedure
    .input(
      z.object({
        orderId: z.string().cuid(),
        razorpayPaymentId: z.string().min(1),
        razorpayOrderId: z.string().min(1),
        razorpaySignature: z.string().min(1),
        newAddress: newAddressInput.optional().nullable(),
        addressId: z.string().cuid().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const order = await ctx.db.order.findFirst({
        where: { id: input.orderId, userId },
        select: {
          id: true,
          status: true,
          total: true,
          currency: true,
          razorpayOrderId: true,
          addressId: true,
          orderNumber: true,
        },
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }

      if (order.status === "paid") {
        return { orderId: order.id, orderNumber: order.orderNumber };
      }

      if (order.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order cannot be completed.",
        });
      }

      if (order.razorpayOrderId !== input.razorpayOrderId) {
        await ctx.db.paymentHistory.create({
          data: {
            orderId: order.id,
            event: "failed",
            amount: order.total,
            currency: order.currency,
            razorpayOrderId: input.razorpayOrderId,
            razorpayPaymentId: input.razorpayPaymentId,
            failureCode: "order_mismatch",
            failureMessage: "Payment order mismatch.",
          },
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment order mismatch.",
        });
      }

      const valid = verifyRazorpaySignature({
        razorpayOrderId: input.razorpayOrderId,
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
      });
      if (!valid) {
        await ctx.db.paymentHistory.create({
          data: {
            orderId: order.id,
            event: "failed",
            amount: order.total,
            currency: order.currency,
            razorpayOrderId: input.razorpayOrderId,
            razorpayPaymentId: input.razorpayPaymentId,
            failureCode: "invalid_signature",
            failureMessage: "Invalid payment signature.",
          },
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid payment signature.",
        });
      }

      let addressId = order.addressId ?? input.addressId ?? null;
      let snapshot: AddressSnapshot | null = null;

      if (input.newAddress) {
        if (input.newAddress.isDefault) {
          await ctx.db.address.updateMany({
            where: { userId, deletedAt: null, isDefault: true },
            data: { isDefault: false },
          });
        }
        const created = await ctx.db.address.create({
          data: {
            userId,
            fullName: input.newAddress.fullName,
            phone: input.newAddress.phone,
            line1: input.newAddress.line1,
            line2: input.newAddress.line2 || null,
            city: input.newAddress.city,
            state: input.newAddress.state,
            pincode: input.newAddress.pincode,
            country: input.newAddress.country || "India",
            isDefault: input.newAddress.isDefault,
          },
          select: addressSnapshotSelect,
        });
        addressId = created.id;
        snapshot = toSnapshot(created);
      } else if (addressId) {
        const existing = await ctx.db.address.findFirst({
          where: { id: addressId, userId, deletedAt: null },
          select: addressSnapshotSelect,
        });
        if (!existing) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Address not found.",
          });
        }
        snapshot = toSnapshot(existing);
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Shipping address is required.",
        });
      }

      await ctx.db.$transaction([
        ctx.db.order.update({
          where: { id: order.id },
          data: {
            status: "paid",
            addressId,
            shippingAddress: snapshot,
            razorpayPaymentId: input.razorpayPaymentId,
            razorpaySignature: input.razorpaySignature,
          },
        }),
        ctx.db.paymentHistory.create({
          data: {
            orderId: order.id,
            event: "success",
            amount: order.total,
            currency: order.currency,
            razorpayOrderId: input.razorpayOrderId,
            razorpayPaymentId: input.razorpayPaymentId,
          },
        }),
      ]);

      await clearUserCart(ctx.db, userId);

      return { orderId: order.id, orderNumber: order.orderNumber };
    }),
});
