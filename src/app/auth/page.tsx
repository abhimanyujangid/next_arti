import { serverTrpc } from "@/lib/trpc/server";
import { redirect } from "next/navigation";
import { AuthView } from "@/feature/auth/views/auth-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create an account at ArtiSun.",
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const api = await serverTrpc();
  const session = await api.auth.getSession();
  
  const params = await searchParams;
  let redirectPath = typeof params.redirect === 'string' ? params.redirect : '/account';

  // If already authenticated, redirect immediately on the server
  if (session?.user) {
    if (session.user.role === "admin") {
      const target = redirectPath.startsWith("/admin") ? redirectPath : "/admin";
      redirect(target);
    } else {
      const target = redirectPath === "/" ? "/account" : redirectPath;
      redirect(target);
    }
  }

  return <AuthView redirectPath={redirectPath} />;
}
