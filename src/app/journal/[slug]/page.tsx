import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import { JournalPost } from "@/feature/journal/components/journal-details";
import { serverTrpc } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const getPostBySlug = cache(async (slug: string) => {
  const caller = await serverTrpc();
  return caller.journal.getBySlug({ slug });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    const title = post.seoTitle ?? post.title;
    const description =
      post.seoDescription ??
      post.excerpt ??
      `Read the essay "${post.title}" on Indian art traditions and craft heritage.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/journal/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "article",
        url: `/journal/${slug}`,
        siteName: "ArtiSun",
        publishedTime: post.publishedAt
          ? new Date(post.publishedAt).toISOString()
          : undefined,
        modifiedTime: new Date(post.updatedAt).toISOString(),
        authors: post.authorName ? [post.authorName] : undefined,
        tags: post.tags.length > 0 ? post.tags : undefined,
        images: post.coverUrl
          ? [{ url: post.coverUrl, alt: post.title }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: post.coverUrl ? [post.coverUrl] : undefined,
      },
    };
  } catch {
    return {
      title: "Journal",
      alternates: { canonical: `/journal/${slug}` },
    };
  }
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    return <JournalPost post={post} />;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}
