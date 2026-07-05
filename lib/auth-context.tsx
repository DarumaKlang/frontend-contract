// lib/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type Role = "user" | "admin";

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
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (
    email: string,
    role: Role = "user",
    backendUser: Partial<User> | null = null,
    authToken: string | null = null
  ) => {
    const newUser: User = {
      email,
      role,
      ...(backendUser ?? {}),
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
    router.push("/profile");
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
