"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, BarChart3, Users, LogOut } from "lucide-react";
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
  SidebarMenuItem 
} from "@/components/ui/sidebar";

const adminNavigation = [
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

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-[#e5e5e0] bg-[#fdfdfc]">
      <SidebarHeader className="h-16 flex flex-row items-center px-6 border-b border-[#e5e5e0]">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl text-[#1a1a1a]">ArtiSun</span>
          <span className="text-[10px] tracking-widest text-[#707065] uppercase">Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-[#707065] uppercase mb-4">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {adminNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-[#f5f5f0] text-[#4a4a40] hover:text-[#1a1a1a] transition-colors rounded-none px-3 py-5">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4 mr-3" />
                      <span className="text-sm tracking-wide">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-[#e5e5e0]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-[#f5f5f0] text-[#707065] hover:text-[#1a1a1a] transition-colors rounded-none">
              <Link href="/account">
                <LogOut className="h-4 w-4 mr-3" />
                <span className="text-sm tracking-wide">Exit Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
