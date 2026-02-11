"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { User } from "@/types";
import { useLoading } from "@/contexts/LoadingContext";

// ✅ Auth context interface
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  showLogin: boolean;
  setShowLogin: (v: boolean) => void;
  isOwner: boolean;
  setIsOwner: (v: boolean) => void;
  loginWithToken: (token: string) => Promise<User | null>;
  logout: () => void;
  navigate: (path: string) => void;
  requestOTP: (identifier: string) => Promise<boolean>;
  verifyOTP: (identifier: string, code: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  // ✅ Add token to axios headers automatically
  //   apiAxios.interceptors.request.use((config) => {
  //     const t = token || localStorage.getItem("token");
  //     if (t) config.headers.Authorization = `Bearer ${t}`;
  //     return config;
  //   });

  const { setIsLoading: setGlobalLoading } = useLoading();

  // ✅ loginWithToken
  const loginWithToken = async (token: string): Promise<User | null> => {
    setGlobalLoading(true);
    try {
      localStorage.setItem("token", token);
      setToken(token);

      const res = await api.auth.getMe();
      setUser(res.user);
      setIsOwner(["owner"].includes(res.user.role));

      setTimeout(() => setGlobalLoading(false), 2000); // Ensure min load time
      return res.user;
    } catch {
      logout();
      setGlobalLoading(false);
      return null;
    }
  };

  // ✅ logout
  const logout = () => {
    setGlobalLoading(true);
    setUser(null);
    setToken(null);
    setIsOwner(false);
    localStorage.removeItem("token");

    setTimeout(() => {
      router.push("/");
      setGlobalLoading(false);
    }, 2000);
  };

  // ✅ requestOTP
  const requestOTP = async (identifier: string): Promise<boolean> => {
    try {
      const res = await api.auth.requestOTP(identifier);
      return res.success;
    } catch (err) {
      console.error("OTP REQUEST ERROR", err);
      return false;
    }
  };

  // ✅ verifyOTP
  const verifyOTP = async (
    identifier: string,
    code: string,
  ): Promise<User | null> => {
    try {
      const res = await api.auth.verifyOTP(identifier, code);
      if (res.success && res.token) {
        localStorage.setItem("token", res.token);
        setToken(res.token);
        setUser(res.user);
        setIsOwner(["owner"].includes(res.user.role));
        return res.user;
      }
      return null;
    } catch (err) {
      console.error("OTP VERIFY ERROR", err);
      return null;
    }
  };

  // ✅ initialize on mount
  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("token");
      if (!stored) {
        setIsLoading(false);
        return;
      }
      await loginWithToken(stored);
      setIsLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        showLogin,
        setShowLogin,
        isOwner,
        setIsOwner,
        loginWithToken,
        logout,
        navigate: (path: string) => router.push(path),
        requestOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
