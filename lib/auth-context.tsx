// lib/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from '@/lib/supabase';

type Role = "user" | "admin";

const AUTH_SESSION_COOKIE = "frontend_contract_auth";
const ADMIN_EMAIL = "k.net.game01@gmail.com";

interface User {
  id?: string;
  email: string;
  role: Role;
  name?: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, role?: Role, backendUser?: Partial<User> | null, authToken?: string | null) => void;
  logout: () => void;
  signInWithSupabase: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUpWithSupabase: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  signInWithMagicLink: (email: string) => Promise<{ ok: boolean; error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const isAdminEmail = (email?: string | null) => email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

const normalizeUser = (value: Partial<User> | null | undefined, fallbackRole: Role = "user"): User | null => {
  if (!value?.email) return null;

  return {
    id: value.id,
    email: value.email,
    role: isAdminEmail(value.email) ? "admin" : (value.role ?? fallbackRole),
    name: value.name,
  };
};

const persistAuthCookie = (user: User | null, token: string | null = null) => {
  if (typeof document === "undefined") return;

  if (user && (token || user.email)) {
    const payload = encodeURIComponent(JSON.stringify({
      authenticated: true,
      email: user.email,
      role: user.role,
      name: user.name ?? null,
    }));
    document.cookie = `${AUTH_SESSION_COOKIE}=${payload}; path=/; max-age=604800; SameSite=Lax`;
    return;
  }

  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
};

const clearAuthCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser) {
      const parsedUser = normalizeUser(JSON.parse(storedUser));
      if (parsedUser) {
        setUser(parsedUser);
        persistAuthCookie(parsedUser, storedToken);
      }
    }

    if (storedToken) {
      setToken(storedToken);
    }

    const supabase = getSupabaseClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (session?.access_token) {
        const nextUser = normalizeUser({
          id: session.user.id,
          email: session.user.email ?? "",
          role: "user",
          name: session.user.user_metadata?.full_name ?? session.user.email ?? undefined,
        });
        if (nextUser) {
          setToken(session.access_token);
          setUser(nextUser);
          localStorage.setItem("auth_token", session.access_token);
          localStorage.setItem("auth_user", JSON.stringify(nextUser));
          persistAuthCookie(nextUser, session.access_token);
        }
      }
    });
  }, []);

  const login = (
    email: string,
    role: Role = "user",
    backendUser: Partial<User> | null = null,
    authToken: string | null = null
  ) => {
    const newUser: User = {
      ...(backendUser ?? {}),
      email,
      role: isAdminEmail(email) ? "admin" : (backendUser?.role ?? role),
    };

    localStorage.setItem("auth_user", JSON.stringify(newUser));
    if (authToken) {
      localStorage.setItem("auth_token", authToken);
      setToken(authToken);
    } else {
      localStorage.removeItem("auth_token");
      setToken(null);
    }

    setUser(newUser);
    persistAuthCookie(newUser, authToken);
    router.push("/profile");
  };

  const logout = () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      void supabase.auth.signOut();
    }
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    setUser(null);
    setToken(null);
    clearAuthCookie();
    router.push("/login");
  };

  const signInWithSupabase = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { ok: false, error: "Supabase is not configured" };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      return { ok: false, error: error?.message || "Sign-in failed" };
    }

    const session = data.session;
    const newUser: User = {
      id: session.user.id,
      email: session.user.email ?? email,
      role: isAdminEmail(session.user.email ?? email) ? "admin" : "user",
      name: session.user.user_metadata?.full_name ?? session.user.email ?? undefined,
    };

    localStorage.setItem("auth_user", JSON.stringify(newUser));
    localStorage.setItem("auth_token", session.access_token);
    setUser(newUser);
    setToken(session.access_token);
    persistAuthCookie(newUser, session.access_token);
    router.push("/profile");
    return { ok: true };
  };

  const signUpWithSupabase = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { ok: false, error: "Supabase is not configured" };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`,
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (data.session) {
      const session = data.session;
      const newUser: User = {
        id: session.user.id,
        email: session.user.email ?? email,
        role: isAdminEmail(session.user.email ?? email) ? "admin" : "user",
        name: session.user.user_metadata?.full_name ?? session.user.email ?? undefined,
      };
      localStorage.setItem("auth_user", JSON.stringify(newUser));
      localStorage.setItem("auth_token", session.access_token);
      setUser(newUser);
      setToken(session.access_token);
      persistAuthCookie(newUser, session.access_token);
      router.push("/profile");
    }

    return { ok: true };
  };

  const signInWithGoogle = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { ok: false, error: "Supabase is not configured" };
    }

    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : `${process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  };

  const signInWithMagicLink = async (email: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { ok: false, error: "Supabase is not configured" };
    }

    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : `${process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, message: "Magic link sent. Please check your email." };
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signInWithSupabase, signUpWithSupabase, signInWithGoogle, signInWithMagicLink }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
