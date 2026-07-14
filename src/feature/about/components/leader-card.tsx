interface LeaderCardProps {
  role: string;
  name: string;
  quote: string;
  image?: string;
}

export function LeaderCard({ role, name, quote, image }: LeaderCardProps) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex flex-col sm:flex-row gap-8 items-start">
      <div className="shrink-0">
        {image ? (
          <div className="h-40 w-40 overflow-hidden border border-border/60">
            <img src={image} alt={name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-40 w-40 flex items-center justify-center border border-border/60 bg-secondary/40 font-display text-4xl text-accent">
            {initials}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{role}</div>
        <h3 className="mt-2 font-display text-2xl md:text-3xl">{name}</h3>
        <hr className="gold-rule my-5" />
        <p className="text-base leading-relaxed italic text-foreground/80">"{quote}"</p>
      </div>
    </div>
  );
}
