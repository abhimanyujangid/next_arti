/** GST rate applied to product subtotal (exclusive of shipping). */
export const GST_RATE = 0.18;

/** Round to nearest paise (2 decimal places). */
export function roundINR(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** GST amount for a product subtotal. */
export function calcGst(subtotal: number): number {
  return roundINR(subtotal * GST_RATE);
}

/** Order total: subtotal + shipping + GST. */
export function calcOrderTotal(input: {
  subtotal: number;
  shipping?: number;
}): number {
  const shipping = input.shipping ?? 0;
  return roundINR(input.subtotal + shipping + calcGst(input.subtotal));
}
