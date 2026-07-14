import type { Metadata } from "next";
import { ResetPasswordView } from "@/feature/auth/views/reset-password-view";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your ArtiSun account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;
  const error = typeof params.error === "string" ? params.error : null;

  return <ResetPasswordView token={token} error={error} />;
}
