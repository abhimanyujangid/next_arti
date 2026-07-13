import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <SiteHeader />
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
