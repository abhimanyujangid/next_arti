import { z } from "zod";

import { publicProcedure, router } from "@/lib/trpc/init";

export const contactRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(2, "Name is required."),
        email: z
          .string()
          .trim()
          .email("Enter a valid email.")
          .transform((v) => v.toLowerCase()),
        message: z
          .string()
          .trim()
          .min(10, "Please write a bit more detail.")
          .max(5000, "Message is too long."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactMessage.create({
        data: {
          name: input.name,
          email: input.email,
          message: input.message,
          status: "new",
        },
      });
      return { ok: true as const };
    }),
});
