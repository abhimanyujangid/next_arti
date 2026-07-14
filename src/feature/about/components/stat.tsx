export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-3xl md:text-4xl text-accent">{value}</dt>
      <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</dd>
    </div>
  );
}
