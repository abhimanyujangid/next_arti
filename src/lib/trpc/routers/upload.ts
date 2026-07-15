import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, router } from "@/lib/trpc/init";
import { createPresignedPutUrl, getPublicUrl } from "@/lib/r2";

const ALLOWED_FOLDERS = ["categories", "products"] as const;
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const uploadRouter = router({
  getPresignedUrl: adminProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        contentType: z.enum(ALLOWED_CONTENT_TYPES),
        folder: z.enum(ALLOWED_FOLDERS).default("categories"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const extension = input.filename.split(".").pop()?.toLowerCase() || "bin";
      const key = `${input.folder}/${ctx.session.user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}.${extension}`;

      try {
        const presignedUrl = await createPresignedPutUrl({
          key,
          contentType: input.contentType,
        });
        const publicUrl = getPublicUrl(key);

        return { key, presignedUrl, publicUrl };
      } catch (error) {
        console.error("Failed to create presigned URL", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create upload URL",
        });
      }
    }),
});
