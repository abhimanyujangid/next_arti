"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { signIn as betterSignIn } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { signInSchema, signUpSchema } from "../utils/schemas";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

export function AuthForm({ redirectPath }: { redirectPath: string }) {
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [actionLoading, setActionLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectPath);
    }
  }, [user, loading, router, redirectPath]);

  // TanStack Form configuration
  const form = useForm({
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setActionLoading(true);
      setNotice(null);
      try {
        if (mode === "signin") {
          const res = await signIn(value.email, value.password);
          if (res?.error) {
            setActionLoading(false);
            return;
          }
          toast.success("Welcome back to the House of ArtiSun");
          router.push(redirectPath);
        } else {
          if (!value.full_name) {
            toast.error("Please enter your name");
            setActionLoading(false);
            return;
          }
          const res = await signUp(value.email, value.full_name, value.password);
          if (res?.error) {
            setActionLoading(false);
            if (res.error.toLowerCase().includes("verify") || res.error.toLowerCase().includes("confirmation")) {
              setNotice("Please verify your email address before signing in. Check your inbox for the activation link.");
            }
            return;
          }
          setNotice("A verification email has been sent. Please check your inbox and verify your email before logging in.");
          toast.success("Account created! Verify email to log in.");
          setMode("signin");
          form.reset();
        }
      } finally {
        setActionLoading(false);
      }
    },
  });

  const handleGoogleSignIn = async () => {
    setActionLoading(true);
    setNotice(null);
    try {
      await betterSignIn.social({
        provider: "google",
        callbackURL: window.location.origin + redirectPath,
      });
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || (user && !actionLoading)) {
    return (
      <div className="text-center">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">Preparing your account</h1>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-10">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
      </div>

      {notice && (
        <div className="mb-6 border border-accent/40 bg-accent/5 px-4 py-4 font-display text-lg text-foreground/90 leading-relaxed text-center">
          {notice}
        </div>
      )}

      <Button
        onClick={handleGoogleSignIn}
        disabled={actionLoading}
        variant="outline"
        className="w-full py-6 text-xs uppercase tracking-[0.24em] transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            fill="currentColor"
            d="M12 10.2v3.9h5.5c-.24 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.7 14.6 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c6.9 0 9.2-4.9 9.2-8.6 0-.6 0-1-.1-1.4H12z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
        <span className="flex-1 border-t border-border" />
        <span>or with email</span>
        <span className="flex-1 border-t border-border" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {mode === "signup" && (
          <form.Field
            name="full_name"
            validators={{
              onSubmit: ({ value }) => {
                const res = signUpSchema.shape.full_name.safeParse(value);
                return res.success ? undefined : res.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <FormField
                label="Full name"
                type="text"
                placeholder="Your full name"
                field={field}
              />
            )}
          </form.Field>
        )}

        <form.Field
          name="email"
          validators={{
            onSubmit: ({ value }) => {
              const res = signInSchema.shape.email.safeParse(value);
              return res.success ? undefined : res.error.issues[0].message;
            },
          }}
        >
          {(field) => (
            <FormField
              label="Email address"
              type="email"
              placeholder="your@email.com"
              field={field}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onSubmit: ({ value }) => {
              const res = signInSchema.shape.password.safeParse(value);
              return res.success ? undefined : res.error.issues[0].message;
            },
          }}
        >
          {(field) => (
            <FormField
              label="Password"
              type="password"
              placeholder="••••••••"
              field={field}
            />
          )}
        </form.Field>

        <Button
          disabled={actionLoading}
          type="submit"
          className="w-full py-6 text-xs uppercase tracking-[0.24em] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {actionLoading ? "Processing…" : mode === "signup" ? "Create Account" : "Sign In"}
        </Button>
      </form>

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
              className="underline decoration-accent underline-offset-4 cursor-pointer"
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
              className="underline decoration-accent underline-offset-4 cursor-pointer"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </>
  );
}
