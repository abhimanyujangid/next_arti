import Link from "next/link";

import { FaqAccordion } from "@/feature/faq/components/faq-accordion";
import { getHomeFaqs } from "@/feature/faq/data/faqs";

export function FaqSection() {
  const items = getHomeFaqs();

  return (
    <section className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Common questions
            </h2>
          </div>
          <Link
            href="/faq"
            className="border-b border-accent pb-1 text-xs uppercase tracking-[0.22em] hover:text-accent"
          >
            View all FAQs →
          </Link>
        </div>
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
