import type { Metadata } from "next";

import { JournalEditView } from "@/feature/admin/views/journal-edit-view";

export const metadata: Metadata = {
  title: "Edit journal post",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminJournalEditPage({ params }: Props) {
  const { id } = await params;
  return <JournalEditView postId={id} />;
}
