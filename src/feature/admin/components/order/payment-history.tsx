import { format } from "date-fns";

import { formatINR } from "@/lib/format";

type PaymentHistoryItem = {
  id: string;
  event: string;
  amount: number;
  currency: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  failureCode: string | null;
  failureMessage: string | null;
  createdAt: Date | string;
};

const EVENT_LABEL: Record<string, string> = {
  initiated: "Initiated",
  success: "Success",
  failed: "Failed",
  cancelled: "Cancelled",
};

function eventClass(event: string) {
  switch (event) {
    case "success":
      return "text-emerald-700";
    case "failed":
      return "text-red-700";
    case "cancelled":
      return "text-amber-700";
    default:
      return "text-[#707065]";
  }
}

export function PaymentHistory({
  items,
}: {
  items: PaymentHistoryItem[];
}) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-[#1a1a1a]">Payment history</h2>
      {items.length === 0 ? (
        <div className="mt-4 border border-dashed border-[#e5e5e0] bg-white px-4 py-6 text-sm text-[#707065]">
          No payment events recorded for this order.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-[#e5e5e0] border border-[#e5e5e0] bg-white">
          {items.map((entry) => (
            <li key={entry.id} className="px-4 py-4 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span
                  className={
                    "text-[10px] font-medium uppercase tracking-[0.16em] " +
                    eventClass(entry.event)
                  }
                >
                  {EVENT_LABEL[entry.event] ?? entry.event}
                </span>
                <span className="text-xs text-[#707065]">
                  {format(new Date(entry.createdAt), "d MMM yyyy · HH:mm:ss")}
                </span>
              </div>
              <div className="mt-2 text-[#4a4a40]">
                {formatINR(entry.amount)}
              </div>
              {(entry.razorpayOrderId || entry.razorpayPaymentId) && (
                <div className="mt-2 space-y-0.5 text-xs text-[#707065]">
                  {entry.razorpayOrderId ? (
                    <div>Razorpay order: {entry.razorpayOrderId}</div>
                  ) : null}
                  {entry.razorpayPaymentId ? (
                    <div>Payment: {entry.razorpayPaymentId}</div>
                  ) : null}
                </div>
              )}
              {(entry.failureCode || entry.failureMessage) && (
                <div className="mt-2 text-xs text-red-700/90">
                  {entry.failureCode ? `${entry.failureCode}: ` : ""}
                  {entry.failureMessage}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
