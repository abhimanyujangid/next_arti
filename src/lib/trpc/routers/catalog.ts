import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma";

import { publicProcedure, protectedProcedure, router } from "@/lib/trpc/init";
import {
  mapCards,
  mapProductDetail,
  mapReview,
} from "@/feature/catalog/api/utils";

const listProductsInput = z.object({
  category: z.string().trim().optional(),
  q: z.string().trim().optional(),
  minPrice: z.number().nonnegative().optional().nullable(),
  maxPrice: z.number().nonnegative().optional().nullable(),
  availableOnly: z.boolean().optional().default(false),
  sort: z
    .enum(["newest", "price-asc", "price-desc", "title"])
    .optional()
    .default("newest"),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(48).optional().default(6),
  featured: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
});

const reviewWriteInput = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(10).max(2000),
});

const cardInclude = {
  category: { select: { slug: true, name: true } },
  images: {
    select: { url: true, alt: true, sortOrder: true },
    orderBy: { sortOrder: "asc" as const },
  },
} as const;

const reviewInclude = {
  user: { select: { name: true } },
} as const;

export const catalogRouter = router({
  listCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        coverUrl: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }),

  listProducts: publicProcedure
    .input(listProductsInput.optional())
    .query(async ({ ctx, input }) => {
      const {
        category,
        q,
        minPrice,
        maxPrice,
        availableOnly = false,
        sort = "newest",
        page = 1,
        pageSize = 6,
        featured,
        bestSeller,
      } = input ?? {};

      const where: Prisma.ProductWhereInput = {};

      if (category) {
        where.category = { slug: category };
      }

      if (q) {
        where.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { shortDesc: { contains: q, mode: "insensitive" } },
          { region: { contains: q, mode: "insensitive" } },
        ];
      }

      if (availableOnly) {
        where.isAvailable = true;
        where.stock = { gt: 0 };
      }

      if (featured) {
        where.isFeatured = true;
      }

      if (bestSeller) {
        where.isBestSeller = true;
      }

      if (minPrice != null || maxPrice != null) {
        const priceFilters: Prisma.ProductWhereInput[] = [];
        if (minPrice != null && maxPrice != null) {
          priceFilters.push(
            {
              AND: [
                { priceDiscounted: { not: null } },
                { priceDiscounted: { gte: minPrice, lte: maxPrice } },
              ],
            },
            {
              AND: [
                { priceDiscounted: null },
                { priceOriginal: { gte: minPrice, lte: maxPrice } },
              ],
            },
          );
        } else if (minPrice != null) {
          priceFilters.push(
            {
              AND: [
                { priceDiscounted: { not: null } },
                { priceDiscounted: { gte: minPrice } },
              ],
            },
            {
              AND: [
                { priceDiscounted: null },
                { priceOriginal: { gte: minPrice } },
              ],
            },
          );
        } else if (maxPrice != null) {
          priceFilters.push(
            {
              AND: [
                { priceDiscounted: { not: null } },
                { priceDiscounted: { lte: maxPrice } },
              ],
            },
            {
              AND: [
                { priceDiscounted: null },
                { priceOriginal: { lte: maxPrice } },
              ],
            },
          );
        }
        where.AND = [
          ...(Array.isArray(where.AND)
            ? where.AND
            : where.AND
              ? [where.AND]
              : []),
          { OR: priceFilters },
        ];
      }

      let orderBy: Prisma.ProductOrderByWithRelationInput;
      switch (sort) {
        case "price-asc":
          orderBy = { priceOriginal: "asc" };
          break;
        case "price-desc":
          orderBy = { priceOriginal: "desc" };
          break;
        case "title":
          orderBy = { title: "asc" };
          break;
        case "newest":
        default:
          orderBy = { createdAt: "desc" };
          break;
      }

      const [rows, total] = await Promise.all([
        ctx.db.product.findMany({
          where,
          include: cardInclude,
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        ctx.db.product.count({ where }),
      ]);

      return {
        items: mapCards(rows),
        total,
        page,
        pageSize,
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { slug: input.slug },
        include: {
          category: { select: { slug: true, name: true } },
          images: {
            select: { url: true, alt: true, sortOrder: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      });

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      }

      const relatedRows = product.categoryId
        ? await ctx.db.product.findMany({
            where: {
              categoryId: product.categoryId,
              id: { not: product.id },
            },
            include: cardInclude,
            orderBy: { createdAt: "desc" },
            take: 4,
          })
        : [];

      return {
        product: mapProductDetail(product),
        related: mapCards(relatedRows),
      };
    }),

  listReviews: publicProcedure
    .input(z.object({ productId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
        select: { id: true },
      });
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      }

      const rows = await ctx.db.productReview.findMany({
        where: { productId: input.productId, isApproved: true },
        include: reviewInclude,
        orderBy: { createdAt: "desc" },
      });

      const items = rows.map(mapReview);
      const count = items.length;
      const average =
        count > 0
          ? items.reduce((sum, r) => sum + r.rating, 0) / count
          : 0;

      const userId = ctx.session?.user?.id;
      let myReview = null as ReturnType<typeof mapReview> | null;
      if (userId) {
        const mine = await ctx.db.productReview.findUnique({
          where: {
            productId_userId: {
              productId: input.productId,
              userId,
            },
          },
          include: reviewInclude,
        });
        if (mine) {
          myReview = mapReview(mine);
        }
      }

      return { items, average, count, myReview };
    }),

  upsertReview: protectedProcedure
    .input(reviewWriteInput)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
        select: { id: true },
      });
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      }

      const userId = ctx.session.user.id;
      const row = await ctx.db.productReview.upsert({
        where: {
          productId_userId: {
            productId: input.productId,
            userId,
          },
        },
        create: {
          productId: input.productId,
          userId,
          rating: input.rating,
          title: input.title,
          body: input.body,
          isApproved: true,
        },
        update: {
          rating: input.rating,
          title: input.title,
          body: input.body,
          isApproved: true,
        },
        include: reviewInclude,
      });

      return mapReview(row);
    }),

  deleteMyReview: protectedProcedure
    .input(z.object({ productId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existing = await ctx.db.productReview.findUnique({
        where: {
          productId_userId: {
            productId: input.productId,
            userId,
          },
        },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found.",
        });
      }

      await ctx.db.productReview.delete({ where: { id: existing.id } });
      return { ok: true as const };
    }),
});
