import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, router } from "@/lib/trpc/init";
import { deleteObject, keyFromPublicUrl } from "@/lib/r2";

const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().trim().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
});

const productInputSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  shortDesc: z.string().trim().optional().nullable(),
  longDesc: z.string().trim().optional().nullable(),
  story: z.string().trim().optional().nullable(),
  categoryId: z.string().cuid().optional().nullable(),
  region: z.string().trim().optional().nullable(),
  material: z.string().trim().optional().nullable(),
  dimensions: z.string().trim().optional().nullable(),
  weightGrams: z.number().int().min(0).optional().nullable(),
  sku: z.string().trim().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  priceOriginal: z.number().positive("Price must be greater than 0."),
  priceDiscounted: z.number().positive().optional().nullable(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  seoTitle: z.string().trim().optional().nullable(),
  seoDescription: z.string().trim().optional().nullable(),
  images: z.array(productImageSchema).min(1, "Add at least one image."),
});

const productListSelect = {
  id: true,
  slug: true,
  title: true,
  shortDesc: true,
  stock: true,
  priceOriginal: true,
  priceDiscounted: true,
  isAvailable: true,
  isFeatured: true,
  isBestSeller: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  images: {
    select: { id: true, url: true, alt: true, sortOrder: true },
    orderBy: { sortOrder: "asc" as const },
    take: 1,
  },
} as const;

const productDetailSelect = {
  id: true,
  slug: true,
  title: true,
  shortDesc: true,
  longDesc: true,
  story: true,
  categoryId: true,
  region: true,
  material: true,
  dimensions: true,
  weightGrams: true,
  sku: true,
  stock: true,
  priceOriginal: true,
  priceDiscounted: true,
  isAvailable: true,
  isFeatured: true,
  isBestSeller: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  images: {
    select: { id: true, url: true, alt: true, sortOrder: true },
    orderBy: { sortOrder: "asc" as const },
  },
} as const;

async function assertSlugAvailable(
  db: typeof import("@/lib/db").db,
  slug: string,
  excludeId?: string,
) {
  const existing = await db.product.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing && existing.id !== excludeId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A product with this slug already exists.",
    });
  }
}

async function assertSkuAvailable(
  db: typeof import("@/lib/db").db,
  sku: string | null | undefined,
  excludeId?: string,
) {
  if (!sku) return;
  const existing = await db.product.findUnique({
    where: { sku },
    select: { id: true },
  });
  if (existing && existing.id !== excludeId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A product with this SKU already exists.",
    });
  }
}

async function assertCategoryExists(
  db: typeof import("@/lib/db").db,
  categoryId: string | null | undefined,
) {
  if (!categoryId) return;
  const category = await db.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Category not found." });
  }
}

async function deleteR2Urls(urls: string[]) {
  await Promise.all(
    urls.map(async (url) => {
      const key = keyFromPublicUrl(url);
      if (!key) return;
      try {
        await deleteObject(key);
      } catch (error) {
        console.error("Failed to delete product image from R2", error);
      }
    }),
  );
}

function normalizeProductData(input: z.infer<typeof productInputSchema>) {
  const discounted =
    input.priceDiscounted && input.priceDiscounted < input.priceOriginal
      ? input.priceDiscounted
      : null;

  return {
    title: input.title,
    slug: input.slug,
    shortDesc: input.shortDesc || null,
    longDesc: input.longDesc || null,
    story: input.story || null,
    categoryId: input.categoryId || null,
    region: input.region || null,
    material: input.material || null,
    dimensions: input.dimensions || null,
    weightGrams: input.weightGrams ?? null,
    sku: input.sku || null,
    stock: input.stock,
    priceOriginal: input.priceOriginal,
    priceDiscounted: discounted,
    isAvailable: input.isAvailable,
    isFeatured: input.isFeatured,
    isBestSeller: input.isBestSeller,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
  };
}

export const adminProductsRouter = router({
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany({
      select: productListSelect,
      orderBy: { updatedAt: "desc" },
    });
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        select: productDetailSelect,
      });
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      }
      return product;
    }),

  create: adminProcedure
    .input(productInputSchema)
    .mutation(async ({ ctx, input }) => {
      await assertSlugAvailable(ctx.db, input.slug);
      await assertSkuAvailable(ctx.db, input.sku);
      await assertCategoryExists(ctx.db, input.categoryId);

      return ctx.db.product.create({
        data: {
          ...normalizeProductData(input),
          images: {
            create: input.images.map((img, index) => ({
              url: img.url,
              alt: img.alt || null,
              sortOrder: img.sortOrder ?? index,
            })),
          },
        },
        select: productDetailSelect,
      });
    }),

  update: adminProcedure
    .input(productInputSchema.extend({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.product.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          images: { select: { id: true, url: true } },
        },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      }

      await assertSlugAvailable(ctx.db, input.slug, input.id);
      await assertSkuAvailable(ctx.db, input.sku, input.id);
      await assertCategoryExists(ctx.db, input.categoryId);

      const nextUrls = new Set(input.images.map((img) => img.url));
      const removedUrls = existing.images
        .filter((img) => !nextUrls.has(img.url))
        .map((img) => img.url);

      const product = await ctx.db.$transaction(async (tx) => {
        await tx.productImage.deleteMany({ where: { productId: input.id } });

        return tx.product.update({
          where: { id: input.id },
          data: {
            ...normalizeProductData(input),
            images: {
              create: input.images.map((img, index) => ({
                url: img.url,
                alt: img.alt || null,
                sortOrder: img.sortOrder ?? index,
              })),
            },
          },
          select: productDetailSelect,
        });
      });

      if (removedUrls.length > 0) {
        await deleteR2Urls(removedUrls);
      }

      return product;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.product.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          images: { select: { url: true } },
        },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      }

      await ctx.db.product.delete({ where: { id: input.id } });
      await deleteR2Urls(existing.images.map((img) => img.url));

      return { ok: true as const };
    }),
});
