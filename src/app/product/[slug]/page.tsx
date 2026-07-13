import type { Metadata } from "next";
import { ProductDetails } from "@/features/catalog/components/product-details";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Format slug to readable title
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${title} — ArtiSun`,
    description: `View details for the handcrafted ${title} at ArtiSun.`,
    alternates: {
      canonical: `/product/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
}
