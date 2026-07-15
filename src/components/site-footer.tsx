"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NewsletterForm } from "@/feature/newsletter/components/newsletter-form";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-16 md:grid-cols-4 md:px-10">
        <div className="max-w-md md:col-span-2">
          <div className="mb-3 font-display text-3xl">ArtiSun</div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Collectible handmade art and heirloom objects from the workshops of
            India. Every piece is one of one — signed, story-carried and shipped
            in museum packaging.
          </p>
          <NewsletterForm />
        </div>

        <div>
          <div className="eyebrow mb-4">Shop</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-accent">
                All Works
              </Link>
            </li>
            <li>
              <Link href="/shop?category=paintings" className="hover:text-accent">
                Paintings
              </Link>
            </li>
            <li>
              <Link href="/shop?category=wood-art" className="hover:text-accent">
                Wood Art
              </Link>
            </li>
            <li>
              <Link href="/shop?category=metal-art" className="hover:text-accent">
                Brass &amp; Bronze
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:text-accent">
                Collections
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">The House</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-accent">
                Our Craft
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-accent">
                Orders &amp; Shipping
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-accent">
                Account
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:px-10">
          <span>© {new Date().getFullYear()} ArtiSun. Handmade in India.</span>
          <span className="uppercase tracking-[0.2em]">
            Free shipping across India · Museum packaging
          </span>
        </div>
      </div>
    </footer>
  );
}
