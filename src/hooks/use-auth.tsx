"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession, signOut as betterSignOut, signIn as betterSignIn, signUp as betterSignUp } from "@/lib/auth-client";

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: string;
};

type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string } | void>;
  signUp: (email: string, name: string, password?: string) => Promise<{ error?: string } | void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
  initialSession = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialSession?: Session | null;
}) {
  const { data, isPending } = useSession();
  const [user, setUser] = useState<User | null>(initialUser);
  const [session, setSession] = useState<Session | null>(initialSession);

  useEffect(() => {
    if (data) {
      setUser(data.user as any);
      setSession(data.session as any);
    } else if (!isPending) {
      setUser(null);
      setSession(null);
    }
  }, [data, isPending]);

  const signIn = async (email: string, password?: string) => {
    const res = await betterSignIn.email({
      email,
      password: password || "",
    });
    if (res?.error) {
      const errMsg = res.error.message || "Failed to sign in";
      toast.error(errMsg);
      return { error: errMsg };
    }
  };

  const signUp = async (email: string, name: string, password?: string) => {
    const res = await betterSignUp.email({
      email,
      password: password || "",
      name,
      callbackURL: "/account",
    });
    if (res?.error) {
      const errMsg = res.error.message || "Failed to sign up";
      toast.error(errMsg);
      return { error: errMsg };
    }
  };

  const signOut = async () => {
    await betterSignOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading: isPending,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Return safe fallback for outside AuthProvider during early rendering
    return {
      user: null,
      session: null,
      loading: false,
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
    };
  }
  return ctx;
}
