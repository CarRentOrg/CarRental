"use client";

import React, { useState, useEffect } from "react";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { useOwnerAuth } from "@/contexts/OwnerAuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Key } from "lucide-react";

type AuthStep = "EMAIL" | "PASSWORD" | "OTP";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { login: userLogin, verifyOTP } = useUserAuth();
  const { login: ownerLogin } = useOwnerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<AuthStep>("EMAIL");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userLogin(email);
      // We ONLY allow the password flow (Owners) on this specific login page
      if (res.flow === "password") {
        setStep("PASSWORD");
      } else {
        // Explicitly deny guest OTP flow on this formal login page
        toast.error(
          "Access Denied. Please use the booking or profile page to verify your guest account.",
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await ownerLogin(email, password);
      if (user) {
        toast.success("Welcome, Owner!");
        // Use replace to prevent back navigation
        const target = callbackUrl.startsWith("/admin")
          ? callbackUrl
          : "/admin";
        router.replace(target);
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await verifyOTP(email, otp);
      if (user) {
        toast.success("Welcome back!");
        router.push(callbackUrl);
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-zinc-950/50 backdrop-blur-xl border border-zinc-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />

        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex p-4 bg-zinc-900 border border-zinc-800 rounded-3xl mb-4 group transition-all hover:border-blue-500/50">
            {step === "EMAIL" && (
              <Mail className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
            )}
            {step === "PASSWORD" && (
              <Lock className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />
            )}
            {step === "OTP" && (
              <Key className="w-8 h-8 text-teal-500 group-hover:scale-110 transition-transform" />
            )}
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none">
            {step === "EMAIL" && "Welcome Back"}
            {step === "PASSWORD" && "Owner Login"}
            {step === "OTP" && "Enter OTP"}
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            {step === "EMAIL" && "Sign in or create your account"}
            {step === "PASSWORD" && "Access your owner dashboard"}
            {step === "OTP" && `We sent a code to ${email}`}
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
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-zinc-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Continue"}
                </button>
              </form>
            )}

            {step === "PASSWORD" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-500 transition-colors">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-5 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-zinc-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Sign In to Dashboard"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("EMAIL")}
                  className="w-full text-zinc-500 font-bold text-sm hover:text-white transition-colors"
                >
                  Change Email
                </button>
              </form>
            )}

            {step === "OTP" && (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-teal-500 transition-colors">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-5 text-white outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all text-center text-3xl font-mono tracking-[0.5em]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-zinc-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : "Verify & Continue"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("EMAIL")}
                  className="w-full text-zinc-500 font-bold text-sm hover:text-white transition-colors"
                >
                  Wrong email? Go back
                </button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
