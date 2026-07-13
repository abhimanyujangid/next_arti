import { protectedProcedure, router } from '@/lib/trpc/init';
import { r2Client } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';

export const uploadRouter = router({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const extension = input.filename.split('.').pop() || '';
      const uniqueFilename = `${ctx.session.user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || 'artisun',
        Key: uniqueFilename,
        ContentType: input.contentType,
      });

      const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
      const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${uniqueFilename}`;

      return {
        presignedUrl,
        publicUrl,
      };
    }),
});
