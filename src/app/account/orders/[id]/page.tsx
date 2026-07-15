import type { Metadata } from "next";

import { OrderDetailView } from "@/feature/account/views/order-detail-view";

export const metadata: Metadata = {
  title: "Order — ArtiSun",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AccountOrderDetailPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetailView orderId={id} />;
}
