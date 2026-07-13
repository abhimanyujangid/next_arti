"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AccountNav({ isAdmin }: { isAdmin: boolean }) {
  return (
    <nav className="space-y-2 text-sm">
      {!isAdmin && (
        <>
          <div className="eyebrow mb-4">Your account</div>
          <NavLink href="/account">Profile</NavLink>
          <NavLink href="/account/orders">Orders</NavLink>
          <NavLink href="/account/addresses">Addresses</NavLink>
          <NavLink href="/account/wishlist">Wishlist</NavLink>
        </>
      )}
      {isAdmin && (
        <>
          <div className="eyebrow mb-4">Admin</div>
          <NavLink href="/account">Profile</NavLink>
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/products">Products</NavLink>
          <NavLink href="/admin/orders">Orders</NavLink>
        </>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "block py-1 hover:text-accent transition-colors",
        isActive ? "text-accent font-medium" : "text-foreground/80"
      )}
    >
      {children}
    </Link>
  );
}
