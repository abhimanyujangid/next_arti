import preservingImage from "@/assets/product-madhubani.jpg";
import visionImage from "@/assets/product-tanjore.jpg";

export const SITE_URL = "https://arti-sun-gallery.lovable.app";
export const ABOUT_URL = `${SITE_URL}/about`;
export const ABOUT_TITLE = "About ArtiSun — Authentic Indian Art & Handcrafted Creations";
export const ABOUT_DESCRIPTION =
  "Meet ArtiSun: a curated gallery preserving traditional Indian art — canvas paintings, palm leaf art, silk paintings, and handcrafted decor — connecting master artisans with collectors worldwide.";
export const ABOUT_OG_IMAGE = `${SITE_URL}/images/artisan-story.jpg`;

export const pageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  url: ABOUT_URL,
  primaryImageOfPage: ABOUT_OG_IMAGE,
  mainEntity: {
    "@type": "Organization",
    name: "ArtiSun",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description:
      "ArtiSun is a curated space dedicated to preserving and celebrating traditional Indian art and handcrafted creations.",
    foundingLocation: "Delhi, India",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sector 9, Rohini",
      addressLocality: "Delhi",
      postalCode: "110085",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-9565366555",
        contactType: "customer service",
        email: "artisun.in@gmail.com",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    employee: [
      { "@type": "Person", name: "Prashanth Bose", jobTitle: "Managing Partner" },
      { "@type": "Person", name: "Surya", jobTitle: "Managing Director" },
    ],
  },
};

export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "About", item: ABOUT_URL },
  ],
};

export const stats = [
  { value: "100+", label: "Artworks" },
  { value: "4", label: "Art Forms" },
  { value: "100%", label: "Handcrafted" },
];

export const artForms = [
  "Traditional Canvas Paintings",
  "Palm Leaf Art",
  "Silk Paintings",
  "Handcrafted Decorative Artworks",
];

export const pillars = [
  {
    number: "01",
    title: "Preserving Traditional Art",
    image: preservingImage.src,
    imageAlt: "Traditional Madhubani artwork",
    body: "At ArtiSun, we believe traditional art forms deserve to be preserved and appreciated in modern spaces. These artworks are not just decorative items — they represent history, culture, and the creativity of skilled artisans. By showcasing these creations, we aim to support traditional art forms and bring them to art lovers, collectors, and interior spaces around the world.",
  },
  {
    number: "02",
    title: "Our Vision",
    image: visionImage.src,
    imageAlt: "Tanjore painting reflecting artistic heritage",
    body: "Our vision is to create a platform where authentic handmade artworks can reach people who value cultural heritage and artistic excellence. We want every artwork to find a home where it can inspire, beautify spaces, and keep traditional art alive for generations to come.",
  },
];

export const leaders = [
  {
    role: "Managing Partner",
    name: "Prashanth Bose",
    quote: "We assure guaranteed quality in every name and creation that comes to you.",
    image: "/images/manager_1.png",
  },
  {
    role: "Managing Director",
    name: "Surya",
    quote: "Explore heritage and rare art through our journey and join to make a mark.",
  },
];
