import type { Metadata } from "next";

import { CheckoutView } from "@/feature/checkout/views/checkout-view";

export const metadata: Metadata = {
  title: "Checkout — ArtiSun",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
