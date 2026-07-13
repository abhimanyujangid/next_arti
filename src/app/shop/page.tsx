import type { Metadata } from "next";
import { ShopCatalog } from "@/feature/catalog/components/shop-catalog";

export const metadata: Metadata = {
  title: "Shop Handcrafted Indian Art — ArtiSun",
  description: "Browse collectible handcrafted Indian artworks — paintings, wood art, brass and heirloom decor.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Handcrafted Indian Art — ArtiSun",
    description: "Browse collectible handcrafted Indian artworks — paintings, wood art, brass and heirloom decor.",
    url: "/shop",
  },
};

export default function ShopPage() {
  return <ShopCatalog />;
}
