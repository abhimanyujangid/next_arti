import type { Metadata } from "next";

import { JournalList } from "@/feature/journal/components/journal-list";
import {
  JOURNAL_DESCRIPTION,
  JOURNAL_KEYWORDS,
  JOURNAL_TITLE,
} from "@/feature/journal/data/journal-seo";
import { serverTrpc } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: JOURNAL_TITLE,
  description: JOURNAL_DESCRIPTION,
  keywords: JOURNAL_KEYWORDS,
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    title: JOURNAL_TITLE,
    description: JOURNAL_DESCRIPTION,
    type: "website",
    url: "/journal",
    siteName: "ArtiSun",
  },
  twitter: {
    card: "summary_large_image",
    title: JOURNAL_TITLE,
    description: JOURNAL_DESCRIPTION,
  },
};

export default async function JournalPage() {
  const api = await serverTrpc();
  const posts = await api.journal.list();

  return <JournalList posts={posts} />;
}
