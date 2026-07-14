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
