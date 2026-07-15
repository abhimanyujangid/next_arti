import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, router } from "@/lib/trpc/init";

export const adminReviewsRouter = router({
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.productReview.findMany({
      select: {
        id: true,
        rating: true,
        title: true,
        body: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: { id: true, title: true, slug: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
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
