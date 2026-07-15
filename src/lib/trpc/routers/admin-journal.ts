import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { adminProcedure, router } from "@/lib/trpc/init";
import { deleteObject, keyFromPublicUrl } from "@/lib/r2";

const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens.",
  );

const journalInputSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  slug: slugSchema,
  excerpt: z.string().trim().optional().nullable(),
  body: z.string().default(""),
  coverUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  authorName: z.string().trim().optional().nullable(),
  tags: z.array(z.string().trim().min(1)).default([]),
  isPublished: z.boolean().default(false),
  seoTitle: z.string().trim().optional().nullable(),
  seoDescription: z.string().trim().optional().nullable(),
});

const journalSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  body: true,
  coverUrl: true,
  authorName: true,
  tags: true,
  isPublished: true,
  seoTitle: true,
  seoDescription: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

function normalizeOptional(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function assertSlugAvailable(
  db: typeof import("@/lib/db").db,
  slug: string,
  excludeId?: string,
) {
  const existing = await db.blogPost.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing && existing.id !== excludeId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A journal post with this slug already exists.",
    });
  }
}

async function maybeDeleteCover(url: string | null | undefined) {
  if (!url) return;
  const key = keyFromPublicUrl(url);
  if (!key) return;
  try {
    await deleteObject(key);
  } catch (error) {
    console.error("Failed to delete journal cover", error);
  }
}

function revalidateJournalPublic(slug?: string) {
  revalidatePath("/journal");
  if (slug) {
    revalidatePath(`/journal/${slug}`);
  }
  revalidatePath("/sitemap.xml");
}

export const adminJournalRouter = router({
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.blogPost.findMany({
      select: journalSelect,
      orderBy: [{ updatedAt: "desc" }],
    });
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.blogPost.findUnique({
        where: { id: input.id },
        select: journalSelect,
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Journal post not found.",
        });
      }
      return post;
    }),

  create: adminProcedure
    .input(journalInputSchema)
    .mutation(async ({ ctx, input }) => {
      await assertSlugAvailable(ctx.db, input.slug);

      const publishedAt = input.isPublished ? new Date() : null;

      const post = await ctx.db.blogPost.create({
        data: {
          title: input.title,
          slug: input.slug,
          excerpt: normalizeOptional(input.excerpt),
          body: input.body,
          coverUrl: input.coverUrl || null,
          authorName: normalizeOptional(input.authorName),
          tags: input.tags,
          isPublished: input.isPublished,
          seoTitle: normalizeOptional(input.seoTitle),
          seoDescription: normalizeOptional(input.seoDescription),
          publishedAt,
        },
        select: journalSelect,
      });

      revalidateJournalPublic(post.slug);
      return post;
    }),

  update: adminProcedure
    .input(journalInputSchema.extend({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.blogPost.findUnique({
        where: { id: input.id },
        select: { id: true, coverUrl: true, publishedAt: true, slug: true },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Journal post not found.",
        });
      }

      await assertSlugAvailable(ctx.db, input.slug, input.id);

      const nextCoverUrl = input.coverUrl || null;
      if (existing.coverUrl && existing.coverUrl !== nextCoverUrl) {
        await maybeDeleteCover(existing.coverUrl);
      }

      const publishedAt = input.isPublished
        ? (existing.publishedAt ?? new Date())
        : existing.publishedAt;

      const post = await ctx.db.blogPost.update({
        where: { id: input.id },
        data: {
          title: input.title,
          slug: input.slug,
          excerpt: normalizeOptional(input.excerpt),
          body: input.body,
          coverUrl: nextCoverUrl,
          authorName: normalizeOptional(input.authorName),
          tags: input.tags,
          isPublished: input.isPublished,
          seoTitle: normalizeOptional(input.seoTitle),
          seoDescription: normalizeOptional(input.seoDescription),
          publishedAt,
        },
        select: journalSelect,
      });

      revalidateJournalPublic(existing.slug);
      if (existing.slug !== post.slug) {
        revalidateJournalPublic(post.slug);
      }
      return post;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.blogPost.findUnique({
        where: { id: input.id },
        select: { id: true, coverUrl: true, slug: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Journal post not found.",
        });
      }

      await ctx.db.blogPost.delete({ where: { id: input.id } });
      await maybeDeleteCover(existing.coverUrl);
      revalidateJournalPublic(existing.slug);

      return { ok: true as const };
    }),
});
