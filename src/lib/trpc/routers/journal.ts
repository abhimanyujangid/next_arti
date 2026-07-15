import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "@/lib/trpc/init";

const journalListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverUrl: true,
  authorName: true,
  tags: true,
  publishedAt: true,
} as const;

const journalDetailSelect = {
  ...journalListSelect,
  body: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const journalRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.blogPost.findMany({
      where: { isPublished: true },
      select: journalListSelect,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().trim().min(1) }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.blogPost.findFirst({
        where: { slug: input.slug, isPublished: true },
        select: journalDetailSelect,
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Journal post not found.",
        });
      }

      return post;
    }),
});
