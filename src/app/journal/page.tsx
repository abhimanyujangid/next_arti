import type { Metadata } from "next";
import { JournalList } from "@/feature/journal/components/journal-list";

export const metadata: Metadata = {
  title: "The Journal — ArtiSun",
  description: "Essays on Indian craft traditions, artisans, and the making of ArtiSun's collectible works.",
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    title: "The Journal — ArtiSun",
    description: "Essays on Indian craft traditions, artisans, and the making of ArtiSun's collectible works.",
    url: "/journal",
  },
};

export default function JournalPage() {
  return <JournalList />;
}
