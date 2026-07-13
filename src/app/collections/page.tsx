import type { Metadata } from "next";
import { CollectionList } from "@/features/catalog/components/collection-list";

export const metadata: Metadata = {
  title: "Collections — ArtiSun",
  description: "Curated collections of handcrafted Indian art and heirloom decor.",
  alternates: {
    canonical: "/collections",
  },
};

export default function CollectionsPage() {
  return <CollectionList />;
}
