import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { ShopCatalog } from "@/feature/catalog/components/shop-catalog";
import { shopSearchParamsCache } from "@/feature/catalog/lib/params";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse collectible handcrafted Indian artworks — paintings, wood art, brass and heirloom decor.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Handcrafted Indian Art — ArtiSun",
    description:
      "Browse collectible handcrafted Indian artworks — paintings, wood art, brass and heirloom decor.",
    url: "/shop",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await shopSearchParamsCache.parse(searchParams);
  return <ShopCatalog />;
}
