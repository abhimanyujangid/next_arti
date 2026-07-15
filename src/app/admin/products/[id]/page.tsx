import type { Metadata } from "next";

import { ProductDetailView } from "@/feature/admin/views/product-detail-view";

export const metadata: Metadata = {
  title: "Product",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailView productId={id} />;
}
