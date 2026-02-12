"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useOwnerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Preserve the callback URL where the user was trying to go
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login({ email, password });
      if (success) {
        toast.success("Welcome back, Admin");
        router.push(callbackUrl);
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] relative z-10 shadow-2xl shadow-blue-900/20"
      >
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-2">Admin Portal</h1>
          <p className="text-zinc-500 text-sm">
            Restricted access area. Please identify yourself.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-3">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-700 outline-none focus:border-blue-500 transition-all font-medium"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-3">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-700 outline-none focus:border-blue-500 transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                Login <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-zinc-600 font-bold hover:text-white transition-colors"
          >
            Available only for authorized personnel.
          </a>
        </div>
      </motion.div>
    </div>
  );
}
