"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductsPagination } from "@/feature/admin/components/product/products-pagination";

const PAGE_SIZE = 20;

export function ContactsListView() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.admin.contacts.list.useQuery({
    page,
    pageSize: PAGE_SIZE,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div>
        <h2 className="font-serif text-3xl text-[#1a1a1a]">Contacts</h2>
        <p className="mt-2 text-sm tracking-wide text-[#707065]">
          Messages from the public contact form.
        </p>
      </div>

      {isLoading ? (
        <div className="border border-[#e5e5e0] bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-14 w-full rounded-none border-b border-[#e5e5e0]"
            />
          ))}
        </div>
      ) : total === 0 ? (
        <div className="border border-dashed border-[#e5e5e0] bg-white px-6 py-12 text-center text-sm text-[#707065]">
          No contact messages yet.
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto border border-[#e5e5e0] bg-white">
            <div className="grid min-w-[820px] grid-cols-[140px_180px_minmax(200px,1fr)_90px_110px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
              <span>Name</span>
              <span>Email</span>
              <span>Message</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {items.map((row) => (
              <Link
                key={row.id}
                href={`/admin/contacts/${row.id}`}
                className="grid min-w-[820px] grid-cols-[140px_180px_minmax(200px,1fr)_90px_110px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 text-sm last:border-b-0 transition-colors hover:bg-[#fafaf8]"
              >
                <span className="truncate font-medium text-[#1a1a1a]">
                  {row.name}
                </span>
                <span className="truncate text-[#4a4a40]">{row.email}</span>
                <span className="max-w-[280px] truncate text-[#707065]">
                  {row.message}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#707065]">
                  {row.status}
                </span>
                <span className="truncate text-[#707065]">
                  {format(new Date(row.createdAt), "d MMM yyyy")}
                </span>
              </Link>
            ))}
          </div>

          <ProductsPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
