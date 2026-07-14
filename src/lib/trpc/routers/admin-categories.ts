import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, router } from "@/lib/trpc/init";
import { deleteObject, keyFromPublicUrl } from "@/lib/r2";

const categoryInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  description: z.string().trim().optional().nullable(),
  parentId: z.string().cuid().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  coverUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
});

const categorySelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  parentId: true,
  sortOrder: true,
  coverUrl: true,
  createdAt: true,
  updatedAt: true,
  parent: { select: { id: true, name: true, slug: true } },
  _count: { select: { products: true, children: true } },
} as const;

async function assertSlugAvailable(
  db: typeof import("@/lib/db").db,
  slug: string,
  excludeId?: string,
) {
  const existing = await db.category.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing && existing.id !== excludeId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A category with this slug already exists.",
    });
  }
}

export const adminCategoriesRouter = router({
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      select: categorySelect,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }),

  create: adminProcedure
    .input(categoryInputSchema)
    .mutation(async ({ ctx, input }) => {
      await assertSlugAvailable(ctx.db, input.slug);

      if (input.parentId) {
        const parent = await ctx.db.category.findUnique({
          where: { id: input.parentId },
          select: { id: true },
        });
        if (!parent) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Parent category not found." });
        }
      }

      return ctx.db.category.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description || null,
          parentId: input.parentId || null,
          sortOrder: input.sortOrder,
          coverUrl: input.coverUrl || null,
        },
        select: categorySelect,
      });
    }),

  update: adminProcedure
    .input(categoryInputSchema.extend({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.category.findUnique({
        where: { id: input.id },
        select: { id: true, coverUrl: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Category not found." });
      }

      await assertSlugAvailable(ctx.db, input.slug, input.id);

      if (input.parentId === input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A category cannot be its own parent.",
        });
      }

      if (input.parentId) {
        const parent = await ctx.db.category.findUnique({
          where: { id: input.parentId },
          select: { id: true },
        });
        if (!parent) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Parent category not found." });
        }
      }

      const nextCoverUrl = input.coverUrl || null;
      if (
        existing.coverUrl &&
        existing.coverUrl !== nextCoverUrl
      ) {
        const oldKey = keyFromPublicUrl(existing.coverUrl);
        if (oldKey) {
          try {
            await deleteObject(oldKey);
          } catch (error) {
            console.error("Failed to delete previous cover", error);
          }
        }
      }

      return ctx.db.category.update({
        where: { id: input.id },
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description || null,
          parentId: input.parentId || null,
          sortOrder: input.sortOrder,
          coverUrl: nextCoverUrl,
        },
        select: categorySelect,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.category.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          coverUrl: true,
          _count: { select: { products: true, children: true } },
        },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Category not found." });
      }

      if (existing._count.products > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Remove or reassign products before deleting this category.",
        });
      }

      if (existing._count.children > 0) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Remove or reassign child categories before deleting this category.",
        });
      }

      await ctx.db.category.delete({ where: { id: input.id } });

      if (existing.coverUrl) {
        const key = keyFromPublicUrl(existing.coverUrl);
        if (key) {
          try {
            await deleteObject(key);
          } catch (error) {
            console.error("Failed to delete category cover", error);
          }
        }
      }

      return { ok: true as const };
    }),
});
