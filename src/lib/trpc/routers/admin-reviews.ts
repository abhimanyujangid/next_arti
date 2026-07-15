import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, router } from "@/lib/trpc/init";

export const adminReviewsRouter = router({
  /** Products that have at least one review — index for moderation. */
  listProductsWithReviews: adminProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      where: { reviews: { some: {} } },
      select: {
        id: true,
        title: true,
        slug: true,
        images: {
          select: { url: true },
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        reviews: {
          select: { rating: true, isApproved: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return products.map((p) => {
      const count = p.reviews.length;
      const pendingCount = p.reviews.filter((r) => !r.isApproved).length;
      const average =
        count > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / count
          : 0;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        coverUrl: p.images[0]?.url ?? null,
        reviewStats: { count, average, pendingCount },
      };
    });
  }),

  setApproved: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        isApproved: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.productReview.findUnique({
        where: { id: input.id },
        select: { id: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found." });
      }

      return ctx.db.productReview.update({
        where: { id: input.id },
        data: { isApproved: input.isApproved },
        select: {
          id: true,
          isApproved: true,
        },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.productReview.findUnique({
        where: { id: input.id },
        select: { id: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found." });
      }

      await ctx.db.productReview.delete({ where: { id: input.id } });
      return { ok: true as const };
    }),
});
