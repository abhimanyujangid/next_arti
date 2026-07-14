/** Prefer the message returned by better-auth / the API. */
export function authErrorMessage(
  error: { message?: string | null } | null | undefined,
  fallback = "Something went wrong",
): string {
  return error?.message?.trim() || fallback;
}
