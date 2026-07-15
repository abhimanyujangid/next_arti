import type { Metadata } from "next";

import { ProductsView } from "@/feature/admin/views/products-view";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <ProductsView />;
}
