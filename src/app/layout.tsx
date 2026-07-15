import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: {
    default: "ArtiSun | Luxury Indian Art Gallery",
    template: "%s | ArtiSun",
  },
  description: "Collectible handmade art and heirloom objects from the workshops of India.",
  keywords: ["indian art", "luxury art", "handicrafts", "artisan", "heritage art", "collectibles"],
  authors: [{ name: "ArtiSun" }],
  openGraph: {
    title: "ArtiSun | Luxury Indian Art Gallery",
    description: "Collectible handmade art and heirloom objects from the workshops of India.",
    type: "website",
    locale: "en_IN",
  },
};

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border/60 bg-background/85 md:h-20" />
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let sessionData = null;
  try {
    sessionData = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    // Fallback if request context is not available during static generation
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers initialUser={sessionData?.user} initialSession={sessionData?.session}>
          <Suspense fallback={<HeaderFallback />}>
            <SiteHeader />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
