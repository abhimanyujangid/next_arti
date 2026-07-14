import type { Metadata } from "next";
import { ForgotPasswordView } from "@/feature/auth/views/forgot-password-view";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your ArtiSun account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
