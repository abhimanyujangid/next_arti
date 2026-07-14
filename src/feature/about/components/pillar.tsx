import React from "react";

interface PillarProps {
  number: string;
  title: string;
  body: React.ReactNode;
  image?: string;
  imageAlt?: string;
}

export function Pillar({ number, title, body, image, imageAlt }: PillarProps) {
  return (
    <div className="relative flex h-full flex-col">
      {image && (
        <div className="mb-6 md:mb-8 overflow-hidden border border-border/60 aspect-[4/3] md:aspect-[16/10]">
          <img
            src={image}
            alt={imageAlt ?? ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      )}
      <div className="font-display text-5xl md:text-6xl text-accent/60">{number}</div>
      <h3 className="mt-3 md:mt-4 font-display text-2xl md:text-3xl">{title}</h3>
      <hr className="gold-rule my-5 md:my-6" />
      <p className="text-base leading-relaxed text-foreground/80">{body}</p>
    </div>
  );
}
