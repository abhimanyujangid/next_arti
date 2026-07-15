import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

import { publicProcedure, router } from "@/lib/trpc/init";
import { mapCards, mapProductDetail } from "@/feature/catalog/api/utils";

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

const cardInclude = {
  category: { select: { slug: true, name: true } },
  images: {
    select: { url: true, alt: true, sortOrder: true },
    orderBy: { sortOrder: "asc" as const },
  },
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
        // Filter on effective price: discounted if present, else original
        // Prisma can't express coalesce easily — fetch candidates via both fields with OR ranges
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
        where.AND = [...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), { OR: priceFilters }];
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
});
