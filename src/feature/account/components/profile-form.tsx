"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AccountNav } from "./account-layout";
import { useAuth } from "@/hooks/use-auth";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileForm() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const form = useForm({
    defaultValues: {
      full_name: profileName,
    },
    onSubmit: async ({ value }) => {
      setSaving(true);
      try {
        const res = await authClient.updateUser({
          name: value.full_name,
        });
        if (res?.error) {
          throw new Error(res.error.message || "Failed to update profile");
        }
        setProfileName(value.full_name);
        toast.success("Profile saved successfully");
      } catch (err: any) {
        toast.error(err.message || "Error updating profile");
      } finally {
        setSaving(false);
      }
    },
  });

  // Keep form in sync when user loads asynchronously
  useEffect(() => {
    if (profileName && !form.state.values.full_name) {
      form.setFieldValue("full_name", profileName);
    }
  }, [profileName, form]);

  const signOutUser = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <AccountNav isAdmin={false} />
        <section>
          <div className="eyebrow">Account</div>
          <h1 className="mt-2 font-display text-4xl">
            Welcome{profileName ? `, ${profileName.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{email}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="mt-10 max-w-md space-y-6"
          >
            <form.Field
              name="full_name"
              validators={{
                onChange: ({ value }) => {
                  const res = z.string().min(2, "Name must be at least 2 characters").safeParse(value);
                  return res.success ? undefined : res.error.issues[0].message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors[0]?.toString() : null;
                return (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name} className="eyebrow">Full name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Your full name"
                      className={`bg-transparent border-b border-t-0 border-x-0 border-foreground/30 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-accent px-0 ${error ? "border-destructive focus-visible:border-destructive" : ""}`}
                    />
                    {error && <span className="text-xs text-destructive">{error}</span>}
                  </div>
                );
              }}
            </form.Field>

            <Button
              disabled={saving}
              type="submit"
              className="bg-foreground text-background px-6 py-6 text-xs uppercase tracking-[0.24em] hover:bg-accent transition cursor-pointer disabled:opacity-50 rounded-none"
            >
              {saving ? "Saving…" : "Save profile"}
            </Button>
          </form>

          <hr className="gold-rule my-12" />
          <button onClick={signOutUser} className="text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-accent cursor-pointer">Sign out</button>
        </section>
      </div>
    </div>
  );
}
