"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/feature/cart/hooks/use-cart-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "The Craft" },
  { href: "/contact", label: "Contact" },
];

const menuPanelVariants = {
  closed: {
    opacity: 0,
    y: -12,
    height: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
  open: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const backdropVariants = {
  closed: { opacity: 0, transition: { duration: 0.22, ease: "easeOut" } },
  open: { opacity: 1, transition: { duration: 0.28, ease: "easeOut" } },
} as const;

export function SiteHeader() {
  const { user } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);

  useEffect(() => {
    if (open) setMenuMounted(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Replicate TanStack redirects logic
  const searchString = searchParams.toString();
  const currentQuery = searchString ? `?${searchString}` : "";
  const authRedirect = pathname.startsWith("/auth")
    ? ""
    : encodeURIComponent(pathname + currentQuery);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md",
          menuMounted && "z-[9999]",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-6 md:h-20 md:px-10">
          <button
            className="md:hidden -ml-2 p-2 text-foreground"
            aria-label="Menu"
            aria-expanded={open}
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
                    isActive && "text-accent",
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
              <Link
                href="/account/wishlist"
                aria-label="Wishlist"
                className="p-2 hover:text-accent transition-colors"
              >
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
              <Link
                href={user.role === "admin" ? "/admin" : "/account"}
                aria-label="Account"
                className="p-2 hover:text-accent transition-colors"
              >
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
            <Link
              href="/cart"
              aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
              className="relative p-2 hover:text-accent transition-colors"
            >
              <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.4} />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium leading-none text-accent-foreground">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          </div>
        </div>

        <AnimatePresence onExitComplete={() => setMenuMounted(false)}>
          {open && (
            <motion.nav
              key="mobile-nav"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuPanelVariants}
              className="absolute inset-x-0 top-full z-[9999] overflow-hidden border-b border-border/60 bg-background md:hidden"
            >
              <div className="flex flex-col px-6 py-4">
                {NAV.map((n, i) => (
                  <motion.div
                    key={n.href}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.035, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-sm uppercase tracking-[0.2em] text-foreground/80"
                    >
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav-backdrop"
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            className="fixed inset-0 z-[9998] bg-black/50 md:hidden"
            aria-hidden
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
