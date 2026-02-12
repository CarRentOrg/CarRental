"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { User } from "@/types";
import { useLoading } from "@/contexts/LoadingContext";

interface GuestUser {
  identifier: string; // email or phone
  type: "email" | "phone";
  verified: boolean;
}

interface AuthContextType {
  user: User | null; // Logged in Admin/Owner
  guest: GuestUser | null; // Temporary Guest
  token: string | null;
  isLoading: boolean;
  showLogin: boolean; // For Admin Login Modal if used, or we just rely on page
  setShowLogin: (v: boolean) => void;
  isOwner: boolean;

  // Actions
  login: (data: any) => Promise<User | null>;
  loginAsGuest: (identifier: string, type: "email" | "phone") => void;
  verifyGuest: () => void; // Mark guest as verified
  logout: () => void;

  requestOTP: (identifier: string) => Promise<boolean>;
  verifyOTP: (identifier: string, code: string) => Promise<boolean>; // Returns success
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [guest, setGuest] = useState<GuestUser | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const { setIsLoading: setGlobalLoading } = useLoading();

  // Load Admin/User Session
  const loadUser = async () => {
    // Check if we have an auth hint before trying to load user
    // This prevents redundant 401 calls for guests
    if (typeof window !== "undefined") {
      const hasHint = document.cookie
        .split("; ")
        .some((row) => row.startsWith("auth_hint="));
      if (!hasHint) {
        setIsLoading(false);
        return null;
      }
    }

    try {
      const res = await api.auth.getMe();
      if (res && res.user) {
        const userData = res.user;
        setUser(userData);
        setIsOwner(userData.role === "owner");
        return userData;
      }
    } catch (e: any) {
      // If it's a 401, we just aren't logged in, which is fine
      if (
        e.message?.includes("401") ||
        e.message?.toLowerCase().includes("not authorized")
      ) {
        // Quiet failure
      } else {
        console.error("Session restoration failed:", e);
      }
      setUser(null);
      setIsOwner(false);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (data: any) => {
    setGlobalLoading(true);
    try {
      const res = await api.auth.login(data);
      if (res && res.user) {
        setUser(res.user);
        setIsOwner(res.user.role === "owner");
        setGlobalLoading(false);
        return res.user; // Return user object so caller can check role
      }
    } catch (e: any) {
      console.error("Login Context Error:", e);
      throw e;
    } finally {
      setGlobalLoading(false);
    }
    return null;
  };

  const loginAsGuest = (identifier: string, type: "email" | "phone") => {
    setGuest({ identifier, type, verified: false });
  };

  const verifyGuest = () => {
    if (guest) {
      setGuest({ ...guest, verified: true });
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.error("Logout error", e);
    }
    // Clear local state
    localStorage.removeItem("token");
    localStorage.removeItem("ownerToken");
    setUser(null);
    setIsOwner(false);
    router.push("/");
  };

  const requestOTP = async (identifier: string) => {
    const res = await api.auth.requestOTP(identifier);
    return res.success;
  };

  const verifyOTP = async (identifier: string, code: string) => {
    const res = await api.auth.verifyOTP(identifier, code);
    if (res.success) {
      // Server sets cookie. We just reload user state.
      setUser(res.user);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        guest,
        token,
        isLoading,
        showLogin,
        setShowLogin,
        isOwner,
        login,
        loginAsGuest,
        verifyGuest,
        logout,
        requestOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
