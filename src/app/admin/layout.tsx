import { redirect } from "next/navigation";
import { serverTrpc } from "@/lib/trpc/server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/feature/admin/components/app-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const api = await serverTrpc();
  const session = await api.auth.getSession();
  
  if (!session?.user) {
    redirect("/auth?redirect=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col overflow-hidden bg-[#fbfbf9]">
        <div className="flex h-16 items-center gap-4 border-b border-[#e5e5e0] px-6 bg-white">
          <SidebarTrigger />
          <h1 className="text-sm font-medium tracking-wide text-[#1a1a1a]">Admin Dashboard</h1>
        </div>
        <div className="flex-1 overflow-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
