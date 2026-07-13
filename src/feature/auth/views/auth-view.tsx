"use client";

import { AuthForm } from "../components/auth-form";

export function AuthView({ redirectPath }: { redirectPath: string }) {
  return (
    <div className="mx-auto max-w-md px-6 py-20 text-sm">
      <AuthForm redirectPath={redirectPath} />
    </div>
  );
}
