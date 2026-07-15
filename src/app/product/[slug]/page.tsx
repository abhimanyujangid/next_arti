import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

import { ProductDetails } from "@/feature/catalog/components/product-details";
import { serverTrpc } from "@/lib/trpc/server";

type Props = {
  params: Promise<{ slug: string }>;
};

const getProductBySlug = cache(async (slug: string) => {
  const caller = await serverTrpc();
  return caller.catalog.getBySlug({ slug });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { product } = await getProductBySlug(slug);
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

  try {
    const { product, related } = await getProductBySlug(slug);
    return <ProductDetails product={product} related={related} />;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}
