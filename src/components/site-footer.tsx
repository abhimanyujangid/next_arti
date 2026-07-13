"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // Mock newsletter subscription
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Welcome. We'll write soon from the workshops.");
      setEmail("");
    } catch {
      toast.error("Please enter a valid email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 grid gap-14 md:grid-cols-4">
        <div className="md:col-span-2 max-w-md">
          <div className="font-display text-3xl mb-3">ArtiSun</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Collectible handmade art and heirloom objects from the workshops of India.
            Every piece is one of one — signed, story-carried and shipped in museum packaging.
          </p>
          <form onSubmit={handle} className="mt-8 flex gap-3 max-w-sm">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 border-b border-foreground/40 bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-accent"
            />
            <button
              disabled={loading}
              className="text-xs uppercase tracking-[0.22em] text-foreground hover:text-accent disabled:opacity-50"
            >
              {loading ? "…" : "Subscribe"}
            </button>
          </form>
        </div>

        <div>
          <div className="eyebrow mb-4">Shop</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-accent">All Works</Link></li>
            <li><Link href="/shop?category=paintings" className="hover:text-accent">Paintings</Link></li>
            <li><Link href="/shop?category=wood-art" className="hover:text-accent">Wood Art</Link></li>
            <li><Link href="/shop?category=metal-art" className="hover:text-accent">Brass &amp; Bronze</Link></li>
            <li><Link href="/collections" className="hover:text-accent">Collections</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">The House</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-accent">Our Craft</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link href="/account/orders" className="hover:text-accent">Orders &amp; Shipping</Link></li>
            <li><Link href="/account" className="hover:text-accent">Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-6 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} ArtiSun. Handmade in India.</span>
          <span className="uppercase tracking-[0.2em]">Free shipping across India · Museum packaging</span>
        </div>
      </div>
    </footer>
  );
}
