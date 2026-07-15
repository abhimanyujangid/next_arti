import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { protectedProcedure, router } from "@/lib/trpc/init";

const wishSelect = {
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

function mapWishItem(row: {
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
    image: row.product.images[0]?.url ?? "",
    price: row.product.priceDiscounted ?? row.product.priceOriginal,
  };
}

export const wishlistRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.wishlist.findMany({
      where: { userId: ctx.session.user.id },
      select: wishSelect,
      orderBy: { createdAt: "desc" },
    });
    return { items: rows.map(mapWishItem) };
  }),

  toggle: protectedProcedure
    .input(z.object({ productId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
        select: { id: true },
      });
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      }

      const userId = ctx.session.user.id;
      const existing = await ctx.db.wishlist.findUnique({
        where: {
          userId_productId: { userId, productId: input.productId },
        },
      });

      if (existing) {
        await ctx.db.wishlist.delete({
          where: {
            userId_productId: { userId, productId: input.productId },
          },
        });
      } else {
        await ctx.db.wishlist.create({
          data: { userId, productId: input.productId },
        });
      }

      const rows = await ctx.db.wishlist.findMany({
        where: { userId },
        select: wishSelect,
        orderBy: { createdAt: "desc" },
      });
      return { items: rows.map(mapWishItem) };
    }),

  replace: protectedProcedure
    .input(z.object({ productIds: z.array(z.string().cuid()) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existing = await ctx.db.wishlist.findMany({
        where: { userId },
        select: { productId: true },
      });

      const ids = new Set([
        ...existing.map((r) => r.productId),
        ...input.productIds,
      ]);

      if (ids.size > 0) {
        const valid = await ctx.db.product.findMany({
          where: { id: { in: [...ids] } },
          select: { id: true },
        });
        const validIds = valid.map((p) => p.id);

        await ctx.db.$transaction(async (tx) => {
          await tx.wishlist.deleteMany({ where: { userId } });
          if (validIds.length > 0) {
            await tx.wishlist.createMany({
              data: validIds.map((productId) => ({ userId, productId })),
              skipDuplicates: true,
            });
          }
        });
      }

      const rows = await ctx.db.wishlist.findMany({
        where: { userId },
        select: wishSelect,
        orderBy: { createdAt: "desc" },
      });
      return { items: rows.map(mapWishItem) };
    }),
});
