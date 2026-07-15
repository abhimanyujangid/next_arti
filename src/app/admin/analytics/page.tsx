import type { Metadata } from "next";

import { AnalyticsView } from "@/feature/admin/views/analytics-view";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return <AnalyticsView />;
}
