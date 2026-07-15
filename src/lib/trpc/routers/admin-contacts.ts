import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, router } from "@/lib/trpc/init";
import { getEmailHtml, sendEmail } from "@/lib/email";

const PAGE_SIZE = 20;

const listSelect = {
  id: true,
  name: true,
  email: true,
  message: true,
  status: true,
  repliedAt: true,
  createdAt: true,
} as const;

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function plainTextToEmailHtml(text: string) {
  const escaped = escapeHtml(text.trim());
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((block) => {
      const withBreaks = block.replaceAll("\n", "<br />");
      return `<p style="margin: 0 0 16px; line-height: 1.6;">${withBreaks}</p>`;
    })
    .join("");
  return paragraphs || `<p style="margin: 0;">${escaped}</p>`;
}

export const adminContactsRouter = router({
  list: adminProcedure
    .input(
      z
        .object({
          page: z.number().int().min(1).default(1),
          pageSize: z.number().int().min(1).max(100).default(PAGE_SIZE),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const pageSize = input?.pageSize ?? PAGE_SIZE;

      const [items, total] = await Promise.all([
        ctx.db.contactMessage.findMany({
          select: listSelect,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        ctx.db.contactMessage.count(),
      ]);

      return { items, total, page, pageSize };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.contactMessage.findUnique({
        where: { id: input.id },
        select: listSelect,
      });
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Contact message not found.",
        });
      }
      return item;
    }),

  reply: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        subject: z.string().trim().min(3).max(200),
        message: z.string().trim().min(10).max(10000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.contactMessage.findUnique({
        where: { id: input.id },
        select: { id: true, email: true, name: true },
      });
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Contact message not found.",
        });
      }

      try {
        await sendEmail({
          to: item.email,
          subject: input.subject,
          html: getEmailHtml(plainTextToEmailHtml(input.message)),
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send email. Please try again.",
        });
      }

      await ctx.db.contactMessage.update({
        where: { id: item.id },
        data: {
          status: "replied",
          repliedAt: new Date(),
        },
      });

      return { ok: true as const };
    }),
});
