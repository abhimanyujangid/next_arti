import Link from "next/link";

import { formatINR } from "@/lib/format";

import type { UserOrderRow } from "@/feature/admin/components/user/types";

export function UserOrders({ orders }: { orders: UserOrderRow[] }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-[#1a1a1a]">Orders</h2>
      {orders.length === 0 ? (
        <p className="mt-4 border border-dashed border-[#e5e5e0] bg-white px-6 py-8 text-center text-sm text-[#707065]">
          No orders yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto border border-[#e5e5e0] bg-white">
          <div className="grid min-w-[640px] grid-cols-[1.2fr_100px_100px_80px_120px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            <span>Order</span>
            <span>Status</span>
            <span>Total</span>
            <span>Items</span>
            <span>Date</span>
          </div>
          {orders.map((order) => (
            <div
              key={order.id}
              className="grid min-w-[640px] grid-cols-[1.2fr_100px_100px_80px_120px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 text-sm last:border-b-0"
            >
              <div className="font-medium text-[#1a1a1a]">
                {order.orderNumber}
              </div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-[#707065]">
                {order.status}
              </div>
              <div className="text-[#4a4a40]">{formatINR(order.total)}</div>
              <div className="text-[#4a4a40]">{order.itemCount}</div>
              <div className="text-[#707065]">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-[#707065]">
        Full order management lives under{" "}
        <Link
          href="/admin/orders"
          className="underline-offset-2 hover:underline"
        >
          Orders
        </Link>
        .
      </p>
    </section>
  );
}
