"use client";

import { useEffect, useState } from "react";

import { trpc } from "@/lib/trpc/client";
import { UsersEmpty } from "@/feature/admin/components/user/users-empty";
import { UsersPageHeader } from "@/feature/admin/components/user/users-page-header";
import { UsersPagination } from "@/feature/admin/components/user/users-pagination";
import { UsersTable } from "@/feature/admin/components/user/users-table";
import { UsersTableSkeleton } from "@/feature/admin/components/user/users-table-skeleton";

const PAGE_SIZE = 20;

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
      <UsersPageHeader />

      {isLoading ? (
        <UsersTableSkeleton />
      ) : total === 0 ? (
        <UsersEmpty />
      ) : (
        <div>
          <UsersTable users={users} />
          <UsersPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
