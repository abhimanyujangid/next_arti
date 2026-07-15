import type { Metadata } from "next";

import { FaqView } from "@/feature/faq/views/faq-view";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about ArtiSun artworks, ordering, shipping, and returns.",
};

export default function FaqPage() {
  return <FaqView />;
}
