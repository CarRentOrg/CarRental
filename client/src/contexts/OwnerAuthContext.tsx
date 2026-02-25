"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/types";

interface OwnerAuthContextType {
  owner: User | null;
  user: User | null; // Alias for compatibility
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<User | null>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const OwnerAuthContext = createContext<OwnerAuthContextType | null>(null);

export const OwnerAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [owner, setOwner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const hasHint = document.cookie
      .split("; ")
      .some((row) => row.startsWith("auth_hint="));
    if (!hasHint) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res?.user && res.user.role === "owner") {
        setOwner(res.user);
      }
    } catch (e) {
      console.error("Owner session restoration failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    const res = await api.auth.login({ email, password, isAdminLogin: true });
    if (res?.user && res.user.role === "owner") {
      setOwner(res.user);
      return res.user;
    }
    return null;
  };

  const logout = async () => {
    await api.auth.logout();
    setOwner(null);
    window.location.href = "/login";
  };

  return (
    <OwnerAuthContext.Provider
      value={{
        owner,
        user: owner, // Alias
        isAuthenticated: !!owner,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </OwnerAuthContext.Provider>
  );
};

export const useOwnerAuth = () => {
  const ctx = useContext(OwnerAuthContext);
  if (!ctx)
    throw new Error("useOwnerAuth must be used inside OwnerAuthProvider");
  return ctx;
};
