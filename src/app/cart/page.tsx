import type { Metadata } from "next";
import { CartView } from "@/features/cart/components/cart-view";

export const metadata: Metadata = {
  title: "Your Cart — ArtiSun",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartPage() {
  return <CartView />;
}
