"use client";

import { type ReactNode, createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, name?: string) => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("artisun.user.v1");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("artisun.user.v1");
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, name?: string) => {
    setLoading(true);
    // Mock network request
    await new Promise((r) => setTimeout(r, 600));
    const newUser = {
      id: "user-1",
      name: name || "Karan Malhotra",
      email,
    };
    localStorage.setItem("artisun.user.v1", JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const signUp = async (email: string, name: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const newUser = {
      id: "user-1",
      name,
      email,
    };
    localStorage.setItem("artisun.user.v1", JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    localStorage.removeItem("artisun.user.v1");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Return mock values if outside provider (during SSR or early mounting)
    return {
      user: null,
      loading: false,
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
    };
  }
  return ctx;
}
