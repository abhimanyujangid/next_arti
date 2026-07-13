"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, signIn, signUp } = useAuth();
  
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const redirectPath = searchParams.get("redirect") || "/account";

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectPath);
    }
  }, [user, loading, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setActionLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, "Karan Malhotra");
        toast.success("Welcome back to the House of ArtiSun");
      } else {
        if (!name) {
          toast.error("Please enter your name");
          setActionLoading(false);
          return;
        }
        await signUp(email, name);
        toast.success("Account created successfully!");
      }
      router.push(redirectPath);
    } catch {
      toast.error("Authentication failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    await signIn("google.collector@gmail.com", "Surya Bose");
    toast.success("Signed in with Google");
    router.push(redirectPath);
    setActionLoading(false);
  };

  if (loading || (user && !actionLoading)) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">Preparing your account</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20 text-sm">
      <div className="text-center mb-10">
        <div className="eyebrow">The house of ArtiSun</div>
        <h1 className="mt-3 font-display text-4xl">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={actionLoading}
        className="w-full border border-foreground/30 py-3 text-xs uppercase tracking-[0.24em] hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            fill="currentColor"
            d="M12 10.2v3.9h5.5c-.24 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.7 14.6 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c6.9 0 9.2-4.9 9.2-8.6 0-.6 0-1-.1-1.4H12z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
        <span className="flex-1 border-t border-border" />
        <span>or with email</span>
        <span className="flex-1 border-t border-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === "signup" && (
          <div>
            <label className="eyebrow block">Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 focus:outline-none focus:border-accent"
              placeholder="Your full name"
            />
          </div>
        )}
        <div>
          <label className="eyebrow block">Email address</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 focus:outline-none focus:border-accent"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="eyebrow block">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 focus:outline-none focus:border-accent"
            placeholder="••••••••"
          />
        </div>
        <button
          disabled={actionLoading}
          type="submit"
          className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.24em] hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
        >
          {actionLoading ? "Processing…" : mode === "signup" ? "Create Account" : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-center">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <button
              onClick={() => setMode("signup")}
              className="underline decoration-accent underline-offset-4 cursor-pointer"
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setMode("signin")}
              className="underline decoration-accent underline-offset-4 cursor-pointer"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
