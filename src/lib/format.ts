export function formatINR(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function discountPct(original: number, discounted: number | null | undefined): number | null {
  if (!discounted || discounted >= original) return null;
  return Math.round(((original - discounted) / original) * 100);
}
