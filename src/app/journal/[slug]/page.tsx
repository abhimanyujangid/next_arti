import type { Metadata } from "next";
import { JournalPost } from "@/feature/journal/components/journal-details";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Format slug to readable title
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${title} — ArtiSun Journal`,
    description: `Read the essay "${title}" on Indian art traditions and craft heritage.`,
    alternates: {
      canonical: `/journal/${slug}`,
    },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  return <JournalPost slug={slug} />;
}
