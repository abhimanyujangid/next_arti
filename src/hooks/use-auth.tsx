"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  useSession,
  signOut as betterSignOut,
  signIn as betterSignIn,
  signUp as betterSignUp,
} from "@/lib/auth-client";
import { authErrorMessage } from "@/feature/auth/utils/auth-error";

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

type AuthResult = { error: string | null };

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, name: string, password: string) => Promise<AuthResult>;
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
      setUser(data.user as User);
      setSession(data.session as Session);
    } else if (!isPending) {
      setUser(null);
      setSession(null);
    }
  }, [data, isPending]);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await betterSignIn.email({ email, password });
    return { error: error ? authErrorMessage(error, "Failed to sign in") : null };
  };

  const signUp = async (
    email: string,
    name: string,
    password: string,
  ): Promise<AuthResult> => {
    const { error } = await betterSignUp.email({
      email,
      password,
      name,
      callbackURL: "/account",
    });
    return { error: error ? authErrorMessage(error, "Failed to sign up") : null };
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
    return {
      user: null,
      session: null,
      loading: false,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => {},
    };
  }
  return ctx;
}
