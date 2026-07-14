import { Metadata } from "next";
import { AdminDashboardView } from "@/feature/admin/views/admin-dashboard-view";

export const metadata: Metadata = {
  title: "Admin Dashboard — ArtiSun",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AdminPage() {
  return <AdminDashboardView />;
}
