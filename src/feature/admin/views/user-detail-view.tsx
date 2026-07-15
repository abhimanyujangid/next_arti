"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { UserAddresses } from "@/feature/admin/components/user/user-addresses";
import { UserDetailNotFound } from "@/feature/admin/components/user/user-detail-not-found";
import { UserDetailSkeleton } from "@/feature/admin/components/user/user-detail-skeleton";
import { UserHeader } from "@/feature/admin/components/user/user-header";
import { UserOrders } from "@/feature/admin/components/user/user-orders";
import { UserReviews } from "@/feature/admin/components/user/user-reviews";
import { UserRoleConfirmDialog } from "@/feature/admin/components/user/user-role-confirm-dialog";
import { UserStatsStrip } from "@/feature/admin/components/user/user-stats-strip";
import type { UserRole } from "@/feature/admin/components/user/types";

export function UserDetailView({ userId }: { userId: string }) {
  const utils = trpc.useUtils();
  const { data, isLoading, isError } = trpc.admin.users.getById.useQuery({
    id: userId,
  });
  const session = trpc.auth.getSession.useQuery();

  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  const setRole = trpc.admin.users.setRole.useMutation({
    onSuccess: async (result) => {
      toast.success(
        result.role === "admin"
          ? "User promoted to admin"
          : "User demoted to user",
      );
      setPendingRole(null);
      await utils.admin.users.getById.invalidate({ id: userId });
      await utils.admin.users.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const isSelf = session.data?.user?.id === userId;

  if (isLoading) return <UserDetailSkeleton />;
  if (isError || !data) return <UserDetailNotFound />;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <Link
        href="/admin/users"
        className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#707065] hover:text-[#1a1a1a]"
      >
        <ArrowLeft className="size-3.5" />
        Users
      </Link>

      <UserHeader
        user={data}
        isSelf={isSelf}
        isUpdatingRole={setRole.isPending}
        onRoleSelect={setPendingRole}
      />

      <UserStatsStrip stats={data.stats} />
      <UserAddresses addresses={data.addresses} />
      <UserOrders orders={data.orders} />
      <UserReviews reviews={data.reviews} />

      <UserRoleConfirmDialog
        open={Boolean(pendingRole)}
        userName={data.name}
        pendingRole={pendingRole}
        isPending={setRole.isPending}
        onOpenChange={(open) => {
          if (!open) setPendingRole(null);
        }}
        onConfirm={() => {
          if (!pendingRole) return;
          setRole.mutate({ id: userId, role: pendingRole });
        }}
      />
    </div>
  );
}
