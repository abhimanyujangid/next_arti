import type { Metadata } from "next";
import { Suspense } from "react";

import { OrdersView } from "@/feature/account/views/orders-view";

export const metadata: Metadata = {
  title: "Orders — ArtiSun",
  robots: { index: false, follow: false },
};

export default function AccountOrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersView />
    </Suspense>
  );
}
