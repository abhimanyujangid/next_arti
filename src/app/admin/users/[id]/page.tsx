import type { Metadata } from "next";

import { UserDetailView } from "@/feature/admin/views/user-detail-view";

export const metadata: Metadata = {
  title: "User",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  return <UserDetailView userId={id} />;
}
