import type { Metadata } from "next";
import { Suspense } from "react";

import { OrdersListView } from "@/feature/admin/views/orders-list-view";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersListView />
    </Suspense>
  );
}
