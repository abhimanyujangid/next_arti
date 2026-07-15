"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-form";
import { useAuth } from "@/hooks/use-auth";
import { useAppForm } from "@/hooks/use-app-form";
import {
  signInFormOptions,
  authCredentialsSchema,
} from "../utils/form-options";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function AuthForm({ redirectPath }: { redirectPath: string }) {
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [notice, setNotice] = useState<string | null>(null);

  const getRedirectTarget = (usr: NonNullable<typeof user>) => {
    if (usr.role === "admin") {
      return redirectPath.startsWith("/admin") ? redirectPath : "/admin";
    }
    return redirectPath === "/" ? "/account" : redirectPath;
  };

  useEffect(() => {
    if (!loading && user) {
      router.push(getRedirectTarget(user));
    }
  }, [user, loading, router, redirectPath]);

  const form = useAppForm({
    ...signInFormOptions,
    validators: {
      onSubmit: authCredentialsSchema(mode),
    },
    onSubmit: async ({ value }) => {
      setNotice(null);

      if (mode === "signin") {
        const { error } = await signIn(value.email, value.password);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Welcome back to the House of ArtiSun");
        router.push(redirectPath);
        return;
      }

      const { error } = await signUp(
        value.email,
        value.full_name,
        value.password,
      );
      if (error) {
        toast.error(error);
        return;
      }

      setNotice(
        "A verification email has been sent. Please check your inbox and verify your email before logging in.",
      );
      toast.success("Account created — verify your email to sign in.");
      setMode("signin");
      form.reset();
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  if (loading || user) {
    return (
      <div className="text-center">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">Preparing your account</h1>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 text-center">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
      </div>

      {notice && (
        <div className="mb-6 border border-accent/40 bg-accent/5 px-4 py-4 text-center font-display text-lg leading-relaxed text-foreground/90">
          {notice}
        </div>
      )}

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
            {mode === "signup" && (
              <form.AppField name="full_name">
                {(field) => (
                  <field.TextField
                    label="Full name"
                    placeholder="Your full name"
                  />
                )}
              </form.AppField>
            )}

            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  label="Email address"
                  type="email"
                  placeholder="your@email.com"
                />
              )}
            </form.AppField>

            <form.AppField name="password">
              {(field) => (
                <field.TextField
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                />
              )}
            </form.AppField>
          </FieldGroup>

          {mode === "signin" && (
            <div className="-mt-2 text-right">
              <Link
                href="/auth/forgot"
                className="text-xs uppercase tracking-[0.18em] underline decoration-accent underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full cursor-pointer py-6 text-xs uppercase tracking-[0.24em] transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? "Processing…"
              : mode === "signup"
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>
      </form.AppForm>

      <div className="mt-8 text-center">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <button
              type="button"
              onClick={() => {
                setNotice(null);
                setMode("signup");
              }}
              className="cursor-pointer underline decoration-accent underline-offset-4"
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setNotice(null);
                setMode("signin");
              }}
              className="cursor-pointer underline decoration-accent underline-offset-4"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </>
  );
}
