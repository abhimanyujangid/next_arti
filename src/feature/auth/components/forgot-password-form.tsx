"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-form";
import { requestPasswordReset } from "@/lib/auth-client";
import { useAppForm } from "@/hooks/use-app-form";
import { authErrorMessage } from "../utils/auth-error";
import {
  forgotPasswordFormOptions,
  forgotSchema,
} from "../utils/form-options";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const form = useAppForm({
    ...forgotPasswordFormOptions,
    validators: {
      onSubmit: forgotSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await requestPasswordReset({
        email: value.email,
        redirectTo: `${window.location.origin}/auth/reset`,
      });

      if (error) {
        toast.error(authErrorMessage(error, "Failed to send reset email"));
        return;
      }

      setSent(true);
      toast.success("If an account exists, a reset link has been sent.");
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  if (sent) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">Check your inbox</h1>
        <p className="leading-relaxed text-muted-foreground">
          If an account exists for that email, we sent a link to reset your
          password. The link expires in one hour.
        </p>
        <Link
          href="/auth"
          className="inline-block underline decoration-accent underline-offset-4"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 text-center">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">Forgot password</h1>
        <p className="mt-3 text-muted-foreground">
          Enter your email and we&apos;ll send a reset link.
        </p>
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
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  label="Email address"
                  type="email"
                  placeholder="your@email.com"
                />
              )}
            </form.AppField>
          </FieldGroup>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full cursor-pointer py-6 text-xs uppercase tracking-[0.24em] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Sending…" : "Send reset link"}
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
