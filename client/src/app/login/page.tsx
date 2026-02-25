"use client";

import React, { useState } from "react";
import { useOwnerAuth } from "@/contexts/OwnerAuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Key } from "lucide-react";
import { api } from "@/lib/api";

type AuthStep = "EMAIL" | "PASSWORD" | "OTP";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { login: ownerLogin } = useOwnerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<AuthStep>("EMAIL");
  const [loading, setLoading] = useState(false);

  // Step 1: Check if email exists and is an OWNER
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Explicitly check for owner access (isAdminLogin: true)
      // This will return 403 if not an owner, preventing OTP flow
      const res = await api.auth.login({ email, isAdminLogin: true });

      if (res.flow === "password") {
        setStep("PASSWORD");
      }
    } catch (err: any) {
      toast.error(err.message || "Access Denied");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Login with password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await ownerLogin(email, password);
      if (user) {
        toast.success("Welcome, Owner!");
        const target = callbackUrl.startsWith("/admin")
          ? callbackUrl
          : "/admin";
        router.replace(target);
      } else {
        toast.error("Invalid password");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-zinc-950/50 backdrop-blur-xl border border-zinc-800 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600" />

        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex p-4 bg-zinc-900 border border-zinc-800 rounded-3xl mb-4 group transition-all hover:border-blue-500/50">
            {step === "EMAIL" && (
              <Mail className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
            )}
            {step === "PASSWORD" && (
              <Lock className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
            {step === "EMAIL" && "Welcome Back"}
            {step === "PASSWORD" && "Enter Password"}
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            {step === "EMAIL" && "Sign in to your owner dashboard"}
            {step === "PASSWORD" && "Verify your identity"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {step === "EMAIL" && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-14 pr-6 py-5 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg placeholder:text-zinc-700"
                    />
                  </div>
                </div>
                <button
                  disabled={loading}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-zinc-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Checking..." : "Continue"}
                </button>
              </form>
            )}

            {step === "PASSWORD" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500 transition-colors">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="password"
                      required
                      autoFocus
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-14 pr-6 py-5 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg placeholder:text-zinc-700"
                    />
                  </div>
                </div>
                <button
                  disabled={loading}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-zinc-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("EMAIL")}
                  className="w-full text-zinc-500 font-bold text-sm hover:text-white transition-colors"
                >
                  Use a different email
                </button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
