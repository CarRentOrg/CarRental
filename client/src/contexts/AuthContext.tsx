"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { User } from "@/types";

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

  // ✅ loginWithToken
  const loginWithToken = async (token: string): Promise<User | null> => {
    try {
      localStorage.setItem("token", token);
      setToken(token);

      const res = await api.auth.getMe();
      setUser(res.user);
      setIsOwner(["owner"].includes(res.user.role));

      return res.user;
    } catch {
      logout();
      return null;
    }
  };

  // ✅ logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsOwner(false);
    localStorage.removeItem("token");
    router.push("/");
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
