import type { Metadata } from "next";

import { ReviewsView } from "@/feature/admin/views/reviews-view";

export const metadata: Metadata = {
  title: "Reviews",
  robots: { index: false, follow: false },
};

export default function AdminReviewsPage() {
  return <ReviewsView />;
}
