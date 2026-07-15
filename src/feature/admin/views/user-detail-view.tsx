"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserDetailView({ userId }: { userId: string }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data, isLoading, isError } = trpc.admin.users.getById.useQuery({
    id: userId,
  });
  const session = trpc.auth.getSession.useQuery();

  const [pendingRole, setPendingRole] = useState<"user" | "admin" | null>(null);

  const setRole = trpc.admin.users.setRole.useMutation({
    onSuccess: async (result) => {
      toast.success(
        result.role === "admin" ? "User promoted to admin" : "User demoted to user",
      );
      setPendingRole(null);
      await utils.admin.users.getById.invalidate({ id: userId });
      await utils.admin.users.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const isSelf = session.data?.user?.id === userId;

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Skeleton className="h-4 w-28 rounded-none" />
        <div className="flex gap-6">
          <Skeleton className="size-20 rounded-none" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-9 w-1/2 rounded-none" />
            <Skeleton className="h-4 w-1/3 rounded-none" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-none" />
        <Skeleton className="h-40 w-full rounded-none" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl">
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyTitle>User not found</EmptyTitle>
            <EmptyDescription>
              This account may have been removed.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            className="mt-4 rounded-none"
            variant="outline"
            onClick={() => router.push("/admin/users")}
          >
            Back to users
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <Link
        href="/admin/users"
        className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#707065] hover:text-[#1a1a1a]"
      >
        <ArrowLeft className="size-3.5" />
        Users
      </Link>

      <section className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-5">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden border border-[#e5e5e0] bg-[#fafaf8] text-lg font-medium text-[#4a4a40]">
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.image}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              initials(data.name)
            )}
          </div>
          <div>
            <h1 className="font-serif text-3xl text-[#1a1a1a] md:text-4xl">
              {data.name}
            </h1>
            <div className="mt-2 text-sm text-[#707065]">{data.email}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em]">
              <span className="border border-[#e5e5e0] bg-[#fafaf8] px-2 py-1 text-[#4a4a40]">
                {data.role}
              </span>
              <span
                className={
                  data.emailVerified
                    ? "border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-800"
                    : "border border-amber-200 bg-amber-50 px-2 py-1 text-amber-800"
                }
              >
                {data.emailVerified ? "Verified" : "Unverified"}
              </span>
              <span className="border border-[#e5e5e0] bg-[#fafaf8] px-2 py-1 text-[#707065]">
                Joined{" "}
                {new Date(data.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex min-w-[200px] flex-col gap-2">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
            Role
          </div>
          <Select
            value={data.role}
            disabled={isSelf || setRole.isPending}
            onValueChange={(value) => {
              if (value === data.role) return;
              if (value !== "user" && value !== "admin") return;
              setPendingRole(value);
            }}
          >
            <SelectTrigger className="rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="user">user</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
            </SelectContent>
          </Select>
          {isSelf && (
            <p className="text-xs text-[#707065]">You cannot change your own role.</p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-px border border-[#e5e5e0] bg-[#e5e5e0] sm:grid-cols-5">
        {[
          { label: "Orders", value: String(data.stats.orderCount) },
          {
            label: "Spent",
            value: formatINR(data.stats.orderTotalSpent) || "—",
          },
          { label: "Reviews", value: String(data.stats.reviewCount) },
          { label: "Wishlist", value: String(data.stats.wishlistCount) },
          { label: "Cart items", value: String(data.stats.cartItemCount) },
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
        <h2 className="font-serif text-2xl text-[#1a1a1a]">Addresses</h2>
        {data.addresses.length === 0 ? (
          <p className="mt-4 border border-dashed border-[#e5e5e0] bg-white px-6 py-8 text-center text-sm text-[#707065]">
            No saved addresses.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.addresses.map((addr) => (
              <div
                key={addr.id}
                className="border border-[#e5e5e0] bg-white px-4 py-4 text-sm text-[#4a4a40]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-[#1a1a1a]">{addr.fullName}</div>
                  {addr.isDefault && (
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[#707065]">
                      Default
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[#707065]">{addr.phone}</div>
                <div className="mt-2 leading-relaxed">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""}
                  <br />
                  {addr.city}, {addr.state} {addr.pincode}
                  <br />
                  {addr.country}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-2xl text-[#1a1a1a]">Orders</h2>
        {data.orders.length === 0 ? (
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
            {data.orders.map((order) => (
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
          <Link href="/admin/orders" className="underline-offset-2 hover:underline">
            Orders
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-[#1a1a1a]">Reviews</h2>
        {data.reviews.length === 0 ? (
          <p className="mt-4 border border-dashed border-[#e5e5e0] bg-white px-6 py-8 text-center text-sm text-[#707065]">
            No reviews yet.
          </p>
        ) : (
          <div className="mt-4 border border-[#e5e5e0] bg-white">
            {data.reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-[#e5e5e0] px-4 py-4 last:border-b-0"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#707065]">
                  <span>{review.rating}/5</span>
                  <span>·</span>
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    className={
                      review.isApproved ? "text-emerald-700" : "text-amber-700"
                    }
                  >
                    {review.isApproved ? "Approved" : "Hidden"}
                  </span>
                </div>
                <div className="mt-2 font-medium text-[#1a1a1a]">
                  {review.title || "Untitled review"}
                </div>
                {review.body && (
                  <p className="mt-1 text-sm text-[#4a4a40]">{review.body}</p>
                )}
                <div className="mt-2 text-xs text-[#707065]">
                  <Link
                    href={`/admin/products/${review.product.id}`}
                    className="underline-offset-2 hover:text-accent hover:underline"
                  >
                    {review.product.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AlertDialog
        open={Boolean(pendingRole)}
        onOpenChange={(open) => {
          if (!open) setPendingRole(null);
        }}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Change role?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRole
                ? `Set ${data.name} to “${pendingRole}”. This affects admin access immediately.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none"
              disabled={setRole.isPending || !pendingRole}
              onClick={(e) => {
                e.preventDefault();
                if (!pendingRole) return;
                setRole.mutate({ id: userId, role: pendingRole });
              }}
            >
              {setRole.isPending ? "Saving…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
