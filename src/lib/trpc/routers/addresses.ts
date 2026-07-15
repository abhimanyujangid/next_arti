import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "@/lib/trpc/init";

const addressSelect = {
  id: true,
  fullName: true,
  phone: true,
  line1: true,
  line2: true,
  city: true,
  state: true,
  pincode: true,
  country: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
} as const;

const createAddressInput = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  phone: z.string().trim().min(8, "Phone is required."),
  line1: z.string().trim().min(3, "Address line 1 is required."),
  line2: z.string().trim().optional().nullable(),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().min(2, "State is required."),
  pincode: z.string().trim().min(4, "Pincode is required."),
  country: z.string().trim().min(2).default("India"),
  isDefault: z.boolean().default(false),
});

async function clearDefaults(
  db: typeof import("@/lib/db").db,
  userId: string,
  excludeId?: string,
) {
  await db.address.updateMany({
    where: {
      userId,
      deletedAt: null,
      isDefault: true,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    data: { isDefault: false },
  });
}

async function findOwnedActive(
  db: typeof import("@/lib/db").db,
  userId: string,
  id: string,
) {
  return db.address.findFirst({
    where: { id, userId, deletedAt: null },
    select: { id: true, isDefault: true },
  });
}

export const addressesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.address.findMany({
      where: { userId: ctx.session.user.id, deletedAt: null },
      select: addressSelect,
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }),

  create: protectedProcedure
    .input(createAddressInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (input.isDefault) {
        await clearDefaults(ctx.db, userId);
      }

      return ctx.db.address.create({
        data: {
          userId,
          fullName: input.fullName,
          phone: input.phone,
          line1: input.line1,
          line2: input.line2 || null,
          city: input.city,
          state: input.state,
          pincode: input.pincode,
          country: input.country || "India",
          isDefault: input.isDefault,
        },
        select: addressSelect,
      });
    }),

  setDefault: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existing = await findOwnedActive(ctx.db, userId, input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not found.",
        });
      }

      await clearDefaults(ctx.db, userId, input.id);
      return ctx.db.address.update({
        where: { id: input.id },
        data: { isDefault: true },
        select: addressSelect,
      });
    }),

  softDelete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existing = await findOwnedActive(ctx.db, userId, input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not found.",
        });
      }

      await ctx.db.address.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
          isDefault: false,
        },
      });

      if (existing.isDefault) {
        const next = await ctx.db.address.findFirst({
          where: { userId, deletedAt: null },
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });
        if (next) {
          await ctx.db.address.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
        }
      }

      return { ok: true as const };
    }),
});
