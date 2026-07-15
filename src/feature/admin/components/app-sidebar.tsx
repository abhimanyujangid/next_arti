"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Users,
  LogOut,
  Tags,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const dashboardNavigation = [
  {
    title: "Home",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
];

const catalogNavigation = [
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <Sidebar className="border-r border-[#e5e5e0] bg-[#fdfdfc]">
      <SidebarHeader className="flex h-16 flex-row items-center border-b border-[#e5e5e0] px-6">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl text-[#1a1a1a]">ArtiSun</span>
          <span className="text-[10px] uppercase tracking-widest text-[#707065]">
            Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#707065]">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {dashboardNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="rounded-none px-3 py-5 text-[#4a4a40] transition-colors hover:bg-[#f5f5f0] hover:text-[#1a1a1a]"
                  >
                    <Link href={item.url}>
                      <item.icon className="mr-3 size-4" />
                      <span className="text-sm tracking-wide">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#707065]">
            Catalog
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {catalogNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="rounded-none px-3 py-5 text-[#4a4a40] transition-colors hover:bg-[#f5f5f0] hover:text-[#1a1a1a]"
                  >
                    <Link href={item.url}>
                      <item.icon className="mr-3 size-4" />
                      <span className="text-sm tracking-wide">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#e5e5e0] p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                await signOut();
                router.push("/auth");
              }}
              className="w-full cursor-pointer justify-start rounded-none px-3 py-5 text-[#707065] transition-colors hover:bg-[#f5f5f0] hover:text-[#1a1a1a]"
            >
              <LogOut className="mr-3 size-4" />
              <span className="text-sm tracking-wide">Exit Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
