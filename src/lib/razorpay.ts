import crypto from "crypto";
import Razorpay from "razorpay";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env ${name}`);
  }
  return value;
}

export function getRazorpayKeyId() {
  // Prefer server KEY_ID — NEXT_PUBLIC is only a client mirror and may be mis-set.
  return process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
}

export function getRazorpayClient() {
  const key_id = requireEnv("RAZORPAY_KEY_ID");
  const key_secret = requireEnv("RAZORPAY_KEY_SECRET");
  return new Razorpay({ key_id, key_secret });
}

export function verifyRazorpaySignature(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const secret = requireEnv("RAZORPAY_KEY_SECRET");
  const body = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === input.razorpaySignature;
}

/** Amount in paise for Razorpay (INR). */
export function inrToPaise(amount: number) {
  return Math.round(amount * 100);
}
