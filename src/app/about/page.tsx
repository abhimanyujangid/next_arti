import type { Metadata } from "next";
import { AboutView } from "@/feature/about/views/about-view";
import { ABOUT_TITLE, ABOUT_DESCRIPTION, ABOUT_URL, ABOUT_OG_IMAGE } from "@/feature/about/data/about-data";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  keywords: ["ArtiSun", "Indian art", "traditional Indian paintings", "Madhubani", "Tanjore", "Pattachitra", "palm leaf art", "handcrafted decor", "artisan gallery"],
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    type: "website",
    url: ABOUT_URL,
    siteName: "ArtiSun",
    images: [
      {
        url: ABOUT_OG_IMAGE,
        alt: "A master artisan at work in the ArtiSun studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    images: [ABOUT_OG_IMAGE],
  },
  alternates: {
    canonical: ABOUT_URL,
  },
};

export default function AboutPage() {
  return <AboutView />;
}
