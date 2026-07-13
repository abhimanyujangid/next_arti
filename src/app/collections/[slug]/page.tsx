import type { Metadata } from "next";
import { CollectionDetails } from "@/features/catalog/components/collection-details";

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
    description: `Browse the curated ${title} collection at ArtiSun.`,
    alternates: {
      canonical: `/collections/${slug}`,
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  return <CollectionDetails slug={slug} />;
}
