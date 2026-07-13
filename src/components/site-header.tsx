"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "The Craft" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Replicate TanStack redirects logic
  const searchString = searchParams.toString();
  const currentQuery = searchString ? `?${searchString}` : "";
  const authRedirect = pathname.startsWith("/auth")
    ? ""
    : encodeURIComponent(pathname + currentQuery);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-6 md:h-20 md:px-10">
        <button
          className="md:hidden -ml-2 p-2 text-foreground"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex items-baseline gap-1 mr-auto md:mr-0">
          <span className="font-display text-2xl md:text-3xl tracking-tight">ArtiSun</span>
          <span className="hidden md:inline eyebrow ml-3 pb-1">Est. India</span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-10">
          {NAV.map((n) => {
            const isActive = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "text-[0.78rem] uppercase tracking-[0.22em] text-foreground/80 hover:text-accent transition-colors",
                  isActive && "text-accent"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          <Link href="/shop" aria-label="Search" className="p-2 hover:text-accent transition-colors">
            <Search className="h-4.5 w-4.5" strokeWidth={1.4} />
          </Link>
          {user ? (
            <Link href="/account/wishlist" aria-label="Wishlist" className="p-2 hover:text-accent transition-colors">
              <Heart className="h-4.5 w-4.5" strokeWidth={1.4} />
            </Link>
          ) : (
            <Link
              href={`/auth${authRedirect ? `?redirect=${authRedirect}` : ""}`}
              aria-label="Wishlist"
              className="p-2 hover:text-accent transition-colors"
            >
              <Heart className="h-4.5 w-4.5" strokeWidth={1.4} />
            </Link>
          )}
          {user ? (
            <Link href="/account" aria-label="Account" className="p-2 hover:text-accent transition-colors">
              <User className="h-4.5 w-4.5" strokeWidth={1.4} />
            </Link>
          ) : (
            <Link
              href={`/auth${authRedirect ? `?redirect=${authRedirect}` : ""}`}
              aria-label="Account"
              className="p-2 hover:text-accent transition-colors"
            >
              <User className="h-4.5 w-4.5" strokeWidth={1.4} />
            </Link>
          )}
          <Link href="/cart" aria-label="Cart" className="p-2 hover:text-accent transition-colors">
            <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.4} />
          </Link>
        </div>
      </div>

      {open && (
        <nav className={cn("md:hidden border-t border-border/60 bg-background")}>
          <div className="flex flex-col px-6 py-4">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-[0.2em] text-foreground/80"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
