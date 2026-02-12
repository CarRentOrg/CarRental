"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/types";

interface UserAuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<{ flow: "otp" | "password" }>;
  requestOTP: (identifier: string) => Promise<boolean>;
  verifyOTP: (identifier: string, code: string) => Promise<User | null>;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export const UserAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const hasHint = document.cookie
      .split("; ")
      .some((row) => row.startsWith("auth_hint="));
    if (!hasHint) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res?.user && res.user.role === "user") {
        setUser(res.user);
      }
    } catch (e) {
      console.error("User session restoration failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string) => {
    const res = await api.auth.login({ email });
    return res as any; // { flow: 'otp' | 'password' }
  };

  const requestOTP = async (identifier: string) => {
    try {
      const res = await api.auth.requestOTP(identifier);
      return res.success;
    } catch (e) {
      console.error("OTP request failed", e);
      return false;
    }
  };

  const verifyOTP = async (identifier: string, code: string) => {
    try {
      const res = await api.auth.verifyOTP(identifier, code);
      if (res?.user) {
        setUser(res.user);
        return res.user;
      }
      return null;
    } catch (e: any) {
      console.error("OTP verification failed", e);
      throw e; // Pass the error with message to the component
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <UserAuthContext.Provider
      value={{ user, isLoading, login, requestOTP, verifyOTP, logout }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used inside UserAuthProvider");
  return ctx;
};
