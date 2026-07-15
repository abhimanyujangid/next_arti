import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import { ProductDetails } from "@/feature/catalog/components/product-details";
import { serverTrpc } from "@/lib/trpc/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const caller = await serverTrpc();
    const { product } = await caller.catalog.getBySlug({ slug });
    return {
      title: product.title,
      description:
        product.short_desc ??
        `View details for ${product.title} at ArtiSun.`,
      alternates: {
        canonical: `/product/${slug}`,
      },
    };
  } catch {
    return {
      title: "Product",
      alternates: { canonical: `/product/${slug}` },
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const caller = await serverTrpc();

  try {
    const { product, related } = await caller.catalog.getBySlug({ slug });
    return <ProductDetails product={product} related={related} />;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}
