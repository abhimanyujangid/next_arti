import { formatINR } from "@/lib/format";

import type { UserStats } from "@/feature/admin/components/user/types";

export function UserStatsStrip({ stats }: { stats: UserStats }) {
  const items = [
    { label: "Orders", value: String(stats.orderCount) },
    {
      label: "Spent",
      value: formatINR(stats.orderTotalSpent) || "—",
    },
    { label: "Reviews", value: String(stats.reviewCount) },
    { label: "Wishlist", value: String(stats.wishlistCount) },
    { label: "Cart items", value: String(stats.cartItemCount) },
  ];

  return (
    <section className="grid grid-cols-2 gap-px border border-[#e5e5e0] bg-[#e5e5e0] sm:grid-cols-5">
      {items.map((stat) => (
        <div key={stat.label} className="bg-white px-4 py-5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
            {stat.label}
          </div>
          <div className="mt-2 font-serif text-xl text-[#1a1a1a]">
            {stat.value}
          </div>
        </div>
      ))}
    </section>
  );
}
