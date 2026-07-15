import type { Metadata } from "next";

import { OrderDetailView } from "@/feature/admin/views/order-detail-view";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetailView orderId={id} />;
}
