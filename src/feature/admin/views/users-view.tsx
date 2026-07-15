"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const PAGE_SIZE = 20;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function UsersView() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.admin.users.list.useQuery({
    page,
    pageSize: PAGE_SIZE,
  });

  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div>
        <h2 className="font-serif text-3xl text-[#1a1a1a]">Users</h2>
        <p className="mt-2 text-sm tracking-wide text-[#707065]">
          Manage customers and administrator accounts.
        </p>
      </div>

      {isLoading ? (
        <div className="border border-[#e5e5e0] bg-white">
          <div className="grid grid-cols-[48px_1fr_80px_80px_80px_120px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            <span />
            <span>User</span>
            <span>Role</span>
            <span>Orders</span>
            <span>Reviews</span>
            <span>Joined</span>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[48px_1fr_80px_80px_80px_120px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0"
            >
              <Skeleton className="size-10 rounded-none" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3 rounded-none" />
                <Skeleton className="h-3 w-1/2 rounded-none" />
              </div>
              <Skeleton className="h-4 w-12 rounded-none" />
              <Skeleton className="h-4 w-8 rounded-none" />
              <Skeleton className="h-4 w-8 rounded-none" />
              <Skeleton className="h-4 w-20 rounded-none" />
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No users yet</EmptyTitle>
            <EmptyDescription>
              Accounts will appear here after customers sign up.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div>
          <div className="overflow-x-auto border border-[#e5e5e0] bg-white">
            <div className="grid min-w-[720px] grid-cols-[48px_1fr_80px_80px_80px_120px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
              <span />
              <span>User</span>
              <span>Role</span>
              <span>Orders</span>
              <span>Reviews</span>
              <span>Joined</span>
            </div>

            {users.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="grid min-w-[720px] grid-cols-[48px_1fr_80px_80px_80px_120px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0 transition-colors hover:bg-[#fafaf8]"
              >
                <div className="flex size-10 items-center justify-center overflow-hidden border border-[#e5e5e0] bg-[#fafaf8] text-xs font-medium text-[#4a4a40]">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    initials(user.name)
                  )}
                </div>

                <div className="min-w-0">
                  <div className="truncate font-medium text-[#1a1a1a]">
                    {user.name}
                  </div>
                  <div className="truncate text-xs text-[#707065]">
                    {user.email}
                    {!user.emailVerified ? " · Unverified" : ""}
                  </div>
                </div>

                <div className="text-[10px] uppercase tracking-[0.14em] text-[#4a4a40]">
                  {user.role}
                </div>
                <div className="text-sm text-[#4a4a40]">
                  {user._count.orders}
                </div>
                <div className="text-sm text-[#4a4a40]">
                  {user._count.productReviews}
                </div>
                <div className="text-sm text-[#707065]">
                  {new Date(user.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.22em] text-[#707065]">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="hover:text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="hover:text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
