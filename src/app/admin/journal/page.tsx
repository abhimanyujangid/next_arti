import type { Metadata } from "next";

import { JournalView } from "@/feature/admin/views/journal-view";

export const metadata: Metadata = {
  title: "Journal",
  robots: { index: false, follow: false },
};

export default function AdminJournalPage() {
  return <JournalView />;
}
