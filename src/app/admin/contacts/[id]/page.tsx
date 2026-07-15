import type { Metadata } from "next";

import { ContactDetailView } from "@/feature/admin/views/contact-detail-view";

export const metadata: Metadata = {
  title: "Contact",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminContactDetailPage({ params }: Props) {
  const { id } = await params;
  return <ContactDetailView contactId={id} />;
}
