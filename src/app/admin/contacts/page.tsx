import type { Metadata } from "next";

import { ContactsListView } from "@/feature/admin/views/contacts-list-view";

export const metadata: Metadata = {
  title: "Contacts",
  robots: { index: false, follow: false },
};

export default function AdminContactsPage() {
  return <ContactsListView />;
}
