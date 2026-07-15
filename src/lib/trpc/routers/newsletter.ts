import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "@/lib/trpc/init";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z
          .string()
          .trim()
          .email("Enter a valid email address.")
          .transform((value) => value.toLowerCase()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.newsletterSubscriber.findUnique({
        where: { email: input.email },
        select: { id: true },
      });

      if (existing) {
        // Idempotent success — don't leak subscriber list details aggressively
        return { ok: true as const, alreadySubscribed: true };
      }

      try {
        await ctx.db.newsletterSubscriber.create({
          data: { email: input.email },
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not subscribe right now. Please try again.",
        });
      }

      return { ok: true as const, alreadySubscribed: false };
    }),
});
