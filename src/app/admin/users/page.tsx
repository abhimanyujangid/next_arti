import type { Metadata } from "next";

import { UsersView } from "@/feature/admin/views/users-view";

export const metadata: Metadata = {
  title: "Users",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return <UsersView />;
}
