import { FaqAccordion } from "@/feature/faq/components/faq-accordion";
import { FAQ_CATEGORIES } from "@/feature/faq/data/faqs";

export function FaqView() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-12 md:px-10 md:pt-16">
      <header className="mb-12 md:mb-16">
        <div className="eyebrow">The House of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Everything you need to know about our artworks, ordering, shipping,
          and policies.
        </p>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-14">
        {FAQ_CATEGORIES.map((category) => (
          <section key={category.id}>
            <div className="eyebrow mb-4">{category.title}</div>
            <FaqAccordion items={category.items} />
          </section>
        ))}
      </div>
    </div>
  );
}
