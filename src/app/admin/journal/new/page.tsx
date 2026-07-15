import type { Metadata } from "next";

import { JournalNewView } from "@/feature/admin/views/journal-new-view";

export const metadata: Metadata = {
  title: "New journal post",
  robots: { index: false, follow: false },
};

export default function AdminJournalNewPage() {
  return <JournalNewView />;
}
