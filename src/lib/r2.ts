import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const bucketName = process.env.R2_BUCKET_NAME || "artisun";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
  // R2 rejects AWS SDK v3 default flexible checksums on presigned PUTs
  // (URL gets x-amz-checksum-crc32=AAAAAA== which doesn't match the body).
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

function getPublicDomain(): string {
  const raw = process.env.R2_PUBLIC_DOMAIN?.trim();
  if (!raw) {
    throw new Error(
      "R2_PUBLIC_DOMAIN is not configured. Use your public r2.dev hostname or custom domain (not the *.r2.cloudflarestorage.com API host).",
    );
  }

  return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function getPublicUrl(key: string): string {
  return `https://${getPublicDomain()}/${key}`;
}

export async function createPresignedPutUrl(opts: {
  key: string;
  contentType: string;
  expiresIn?: number;
}): Promise<string> {
  if (!process.env.R2_ACCESS_KEY_ID?.trim() || !process.env.R2_SECRET_ACCESS_KEY?.trim()) {
    throw new Error(
      "R2 credentials missing. Set R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in .env",
    );
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: opts.key,
    ContentType: opts.contentType,
  });

  return getSignedUrl(r2Client, command, {
    expiresIn: opts.expiresIn ?? 3600,
  });
}

export async function deleteObject(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
}

/** Extract object key from a public R2 URL on our domain, if possible. */
export function keyFromPublicUrl(publicUrl: string): string | null {
  const domain = process.env.R2_PUBLIC_DOMAIN;
  if (!domain) return null;
  const prefix = `https://${domain}/`;
  if (!publicUrl.startsWith(prefix)) return null;
  return publicUrl.slice(prefix.length) || null;
}
