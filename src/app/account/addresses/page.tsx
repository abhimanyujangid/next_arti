import type { Metadata } from "next";

import { AddressesView } from "@/feature/account/views/addresses-view";

export const metadata: Metadata = {
  title: "Addresses",
  robots: { index: false, follow: false },
};

export default function AddressesPage() {
  return <AddressesView />;
}
