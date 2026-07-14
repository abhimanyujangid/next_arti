"use client";

import { ResetPasswordForm } from "../components/reset-password-form";

export function ResetPasswordView({
  token,
  error,
}: {
  token: string | null;
  error: string | null;
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-20 text-sm">
      <ResetPasswordForm token={token} error={error} />
    </div>
  );
}
