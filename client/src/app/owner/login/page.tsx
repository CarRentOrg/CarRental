"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Car, Lock } from "lucide-react";

export default function OwnerLoginPage() {
  const router = useRouter();
  const { setShowLogin, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Ensure global modal doesn't pop up here
  useEffect(() => setShowLogin(false), [setShowLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login({ email, password });

      if (user?.role === "owner") {
        toast.success("Welcome, Owner!");
        router.push("/admin");
      } else if (user) {
        toast.error("Unauthorized access");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-white">Owner Portal</h1>
            <p className="text-zinc-500 font-medium mt-1">
              Authorized access only
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@luxerra.mn"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-zinc-100 transition-all active:scale-[0.98] flex items-center justify-center"
          >
            {loading ? (
              <div className="h-6 w-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="pt-4 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-zinc-500 text-sm font-bold hover:text-white transition-colors"
          >
            Back to home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
