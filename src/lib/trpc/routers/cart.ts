import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { protectedProcedure, router } from "@/lib/trpc/init";

const cartLineSelect = {
  qty: true,
  product: {
    select: {
      id: true,
      slug: true,
      title: true,
      priceOriginal: true,
      priceDiscounted: true,
      images: {
        select: { url: true },
        orderBy: { sortOrder: "asc" as const },
        take: 1,
      },
    },
  },
} as const;

function mapCartItem(row: {
  qty: number;
  product: {
    id: string;
    slug: string;
    title: string;
    priceOriginal: number;
    priceDiscounted: number | null;
    images: { url: string }[];
  };
}) {
  return {
    product_id: row.product.id,
    slug: row.product.slug,
    title: row.product.title,
    price: row.product.priceDiscounted ?? row.product.priceOriginal,
    image: row.product.images[0]?.url ?? "",
    qty: row.qty,
  };
}

async function getOrCreateCart(
  db: typeof import("@/lib/db").db,
  userId: string,
) {
  const existing = await db.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return db.cart.create({ data: { userId } });
}

export const cartRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const cart = await getOrCreateCart(ctx.db, ctx.session.user.id);
    const items = await ctx.db.cartItem.findMany({
      where: { cartId: cart.id },
      select: cartLineSelect,
      orderBy: { createdAt: "asc" },
    });
    return { items: items.map(mapCartItem) };
  }),

  setItem: protectedProcedure
    .input(
      z.object({
        productId: z.string().cuid(),
        qty: z.number().int().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
        select: { id: true },
      });
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      }

      const cart = await getOrCreateCart(ctx.db, ctx.session.user.id);

      if (input.qty <= 0) {
        await ctx.db.cartItem.deleteMany({
          where: { cartId: cart.id, productId: input.productId },
        });
      } else {
        await ctx.db.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: input.productId,
            },
          },
          create: {
            cartId: cart.id,
            productId: input.productId,
            qty: input.qty,
          },
          update: { qty: input.qty },
        });
      }

      const items = await ctx.db.cartItem.findMany({
        where: { cartId: cart.id },
        select: cartLineSelect,
        orderBy: { createdAt: "asc" },
      });
      return { items: items.map(mapCartItem) };
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    const cart = await getOrCreateCart(ctx.db, ctx.session.user.id);
    await ctx.db.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { items: [] as ReturnType<typeof mapCartItem>[] };
  }),

  /** Merge: sum qty for shared products; keep server-only and client-only lines. */
  replace: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string().cuid(),
            qty: z.number().int().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cart = await getOrCreateCart(ctx.db, ctx.session.user.id);
      const existing = await ctx.db.cartItem.findMany({
        where: { cartId: cart.id },
        select: { productId: true, qty: true },
      });

      const qtyByProduct = new Map<string, number>();
      for (const row of existing) {
        qtyByProduct.set(row.productId, row.qty);
      }
      for (const item of input.items) {
        qtyByProduct.set(
          item.productId,
          (qtyByProduct.get(item.productId) ?? 0) + item.qty,
        );
      }

      const productIds = [...qtyByProduct.keys()];
      if (productIds.length > 0) {
        const valid = await ctx.db.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true },
        });
        const validIds = new Set(valid.map((p) => p.id));
        for (const id of productIds) {
          if (!validIds.has(id)) qtyByProduct.delete(id);
        }
      }

      await ctx.db.$transaction(async (tx) => {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        const data = [...qtyByProduct.entries()].map(([productId, qty]) => ({
          cartId: cart.id,
          productId,
          qty,
        }));
        if (data.length > 0) {
          await tx.cartItem.createMany({ data });
        }
      });

      const items = await ctx.db.cartItem.findMany({
        where: { cartId: cart.id },
        select: cartLineSelect,
        orderBy: { createdAt: "asc" },
      });
      return { items: items.map(mapCartItem) };
    }),
});
