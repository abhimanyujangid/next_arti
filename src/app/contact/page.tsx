import type { Metadata } from "next";
import { ContactPageClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact — ArtiSun",
  description: "Get in touch with our curators about a piece, a commission or a gift.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
