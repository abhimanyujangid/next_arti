"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

import { trpc } from "@/lib/trpc/client";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

type ShippingSnapshot = {
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
};

export function OrderDetailView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data, isLoading, isError } = trpc.admin.orders.getById.useQuery({
    id: orderId,
  });

  const setStatus = trpc.admin.orders.setStatus.useMutation({
    onSuccess: async () => {
      toast.success("Order status updated");
      await utils.admin.orders.getById.invalidate({ id: orderId });
      await utils.admin.orders.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Skeleton className="h-4 w-28 rounded-none" />
        <Skeleton className="h-10 w-1/2 rounded-none" />
        <Skeleton className="h-48 w-full rounded-none" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl">
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyTitle>Order not found</EmptyTitle>
            <EmptyDescription>This order may have been removed.</EmptyDescription>
          </EmptyHeader>
          <Button
            className="mt-4 rounded-none"
            variant="outline"
            onClick={() => router.push("/admin/orders")}
          >
            Back to orders
          </Button>
        </Empty>
      </div>
    );
  }

  const ship = (data.shippingAddress ?? {}) as ShippingSnapshot;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <Link
        href="/admin/orders"
        className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#707065] hover:text-[#1a1a1a]"
      >
        <ArrowLeft className="size-3.5" />
        Orders
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#1a1a1a] md:text-4xl">
            {data.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-[#707065]">
            {format(new Date(data.createdAt), "d MMM yyyy · HH:mm")}
          </p>
          <Link
            href={`/admin/users/${data.user.id}`}
            className="mt-2 inline-block text-sm text-[#4a4a40] underline-offset-2 hover:underline"
          >
            {data.user.name} ({data.user.email})
          </Link>
        </div>

        <div className="min-w-[200px]">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
            Status
          </div>
          <Select
            value={data.status}
            disabled={setStatus.isPending}
            onValueChange={(value) => {
              if (!STATUSES.includes(value as (typeof STATUSES)[number])) return;
              setStatus.mutate({
                id: orderId,
                status: value as (typeof STATUSES)[number],
              });
            }}
          >
            <SelectTrigger className="mt-2 rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="grid gap-px border border-[#e5e5e0] bg-[#e5e5e0] sm:grid-cols-4">
        {[
          { label: "Subtotal", value: formatINR(data.subtotal) },
          { label: "Shipping", value: formatINR(data.shipping) || "—" },
          { label: "GST (18%)", value: formatINR(data.tax) || "—" },
          { label: "Total", value: formatINR(data.total) },
        ].map((stat) => (
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

      <section>
        <h2 className="font-serif text-2xl text-[#1a1a1a]">Items</h2>
        <div className="mt-4 border border-[#e5e5e0] bg-white">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b border-[#e5e5e0] px-4 py-4 last:border-b-0"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden border border-[#e5e5e0] bg-[#fafaf8]">
                {item.imageSnapshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageSnapshot}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[#1a1a1a]">
                  {item.titleSnapshot}
                </div>
                <div className="mt-1 text-sm text-[#707065]">
                  Qty {item.qty} · {formatINR(item.priceSnapshot)} each
                </div>
              </div>
              <div className="text-sm text-[#4a4a40]">
                {formatINR(item.priceSnapshot * item.qty)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-[#1a1a1a]">Shipping</h2>
        <div className="mt-4 border border-[#e5e5e0] bg-white px-4 py-4 text-sm text-[#4a4a40]">
          {ship.fullName ? (
            <>
              <div className="font-medium text-[#1a1a1a]">{ship.fullName}</div>
              <div className="mt-1 text-[#707065]">{ship.phone}</div>
              <div className="mt-2 leading-relaxed">
                {ship.line1}
                {ship.line2 ? `, ${ship.line2}` : ""}
                <br />
                {ship.city}, {ship.state} {ship.pincode}
                <br />
                {ship.country}
              </div>
            </>
          ) : (
            <span className="text-[#707065]">No shipping address on file.</span>
          )}
        </div>
      </section>

      {(data.razorpayOrderId || data.razorpayPaymentId) && (
        <section className="text-xs text-[#707065]">
          <div>Razorpay order: {data.razorpayOrderId ?? "—"}</div>
          <div className="mt-1">
            Payment: {data.razorpayPaymentId ?? "—"}
          </div>
        </section>
      )}
    </div>
  );
}
