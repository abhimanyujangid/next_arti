import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { serverTrpc } from "@/lib/trpc/server";
import { UserAccountView } from "@/feature/account/views/user-account-view";

export const metadata: Metadata = {
  title: "Account — ArtiSun",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function AccountPage() {
  const api = await serverTrpc();
  
  // Securely get the session on the server
  const session = await api.auth.getSession();
  
  if (!session?.user) {
    redirect("/auth?redirect=/account");
  }

  // Render Admin View if user has admin role
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  // Standard User Flow - Prefetch data on the server!
  const userProfile = await api.user.getProfile();

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
      <UserAccountView initialData={userProfile} />
    </div>
  );
}
