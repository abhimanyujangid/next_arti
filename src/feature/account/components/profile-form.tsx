"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { AccountNav } from "./account-layout";
import { useAuth } from "@/hooks/use-auth";

export function ProfileForm() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Local state for mock profile so users can test editing and saving!
  const [profileName, setProfileName] = useState("Karan Malhotra");
  const [email, setEmail] = useState("karan.malhotra@gmail.com");

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "Karan Malhotra");
      setEmail(user.email || "karan.malhotra@gmail.com");
    }
  }, [user]);

  const { register, handleSubmit } = useForm({
    values: { full_name: profileName },
  });

  const signOutUser = () => {
    // Just mock sign out and redirect to home
    toast.success("Signed out successfully");
    router.push("/");
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
            onSubmit={handleSubmit((v) => {
              setProfileName(v.full_name);
              toast.success("Profile saved");
            })}
            className="mt-10 max-w-md space-y-5"
          >
            <label className="block">
              <span className="eyebrow">Full name</span>
              <input
                {...register("full_name")}
                placeholder="Your full name"
                className="mt-2 w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
              />
            </label>
            <button className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.24em] hover:bg-accent transition cursor-pointer">
              Save profile
            </button>
          </form>

          <hr className="gold-rule my-12" />
          <button onClick={signOutUser} className="text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-accent cursor-pointer">Sign out</button>
        </section>
      </div>
    </div>
  );
}
