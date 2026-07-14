"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-form";
import { resetPassword } from "@/lib/auth-client";
import { useAppForm } from "@/hooks/use-app-form";
import { authErrorMessage } from "../utils/auth-error";
import {
  resetPasswordFormOptions,
  resetPasswordSchema,
} from "../utils/form-options";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm({
  token,
  error,
}: {
  token: string | null;
  error: string | null;
}) {
  const router = useRouter();

  const form = useAppForm({
    ...resetPasswordFormOptions,
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) return;

      const { error: resetError } = await resetPassword({
        newPassword: value.password,
        token,
      });

      if (resetError) {
        toast.error(authErrorMessage(resetError, "Failed to reset password"));
        return;
      }

      toast.success("Password updated. You can sign in now.");
      router.push("/auth");
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  if (error || !token) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">Link invalid or expired</h1>
        <p className="leading-relaxed text-muted-foreground">
          This password reset link is no longer valid. Request a new one to
          continue.
        </p>
        <Link
          href="/auth/forgot"
          className="inline-block underline decoration-accent underline-offset-4"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 text-center">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">Choose a new password</h1>
      </div>

      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            <form.AppField name="password">
              {(field) => (
                <field.TextField
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                />
              )}
            </form.AppField>

            <form.AppField name="confirmPassword">
              {(field) => (
                <field.TextField
                  label="Confirm password"
                  type="password"
                  placeholder="••••••••"
                />
              )}
            </form.AppField>
          </FieldGroup>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full cursor-pointer py-6 text-xs uppercase tracking-[0.24em] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </form.AppForm>

      <div className="mt-8 text-center">
        <Link
          href="/auth"
          className="underline decoration-accent underline-offset-4"
        >
          Back to sign in
        </Link>
      </div>
    </>
  );
}
