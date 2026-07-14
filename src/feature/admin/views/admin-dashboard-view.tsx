"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/hooks/use-auth";

export function AdminDashboardView() {
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.admin.getDashboardStats.useQuery();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-serif text-3xl text-[#1a1a1a]">Overview</h2>
        <p className="text-[#707065] mt-2 tracking-wide text-sm">
          Welcome back, {user?.name || "Admin"}. Here is what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#e5e5e0] p-8 bg-white">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#707065] mb-4">Total Users</div>
          <div className="font-serif text-5xl text-[#1a1a1a]">{isLoading ? "..." : stats?.totalUsers}</div>
        </div>
        
        <div className="border border-[#e5e5e0] p-8 bg-white">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#707065] mb-4">Total Orders</div>
          <div className="font-serif text-5xl text-[#1a1a1a]">{isLoading ? "..." : stats?.totalOrders}</div>
        </div>
      </div>
    </div>
  );
}
