"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const Login = () => {
    const {
        showLogin,
        setShowLogin,
        axios,
        navigate,
        setToken,
    } = useAuth();

    const [state, setState] = useState<"login" | "register">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            setLoading(true);
            const endpoint = state === "login" ? "/api/user/login" : "/api/user/register";
            const { data } = await axios.post(endpoint, {
                name: state === "register" ? name : undefined,
                email,
                password,
            });

            if (data.success) {
                toast.success(data.message);
                if (data.token) {
                    setToken(data.token);

                    // Check user role and redirect accordingly
                    try {
                        const profile = await api.auth.getMe();
                        if (profile.user.role === 'admin' || profile.user.role === 'owner') {
                            navigate("/admin");
                        } else {
                            navigate("/");
                        }
                    } catch (e) {
                        navigate("/");
                    }

                    setShowLogin(false);
                } else {
                    toast.error('Login failed - no token');
                }
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (!showLogin) return null;

    return (
        <div
            onClick={() => setShowLogin(false)}
            className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-6 p-8 w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-600/20 blur-3xl rounded-full" />

                <div className="w-full flex flex-col items-center gap-2 relative z-10">
                    <p className="text-3xl font-bold text-white tracking-tight">
                        <span className="text-blue-500">Car</span>Rent
                    </p>
                    <p className="text-lg text-zinc-400">
                        {state === "login" ? "Welcome back" : "Create your account"}
                    </p>
                </div>

                <div className="w-full relative z-10">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center gap-3 w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all group duration-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="text-zinc-300 font-medium group-hover:text-white">Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-4 my-6">
                        <div className="h-px bg-zinc-800 flex-1" />
                        <span className="text-zinc-500 text-sm">or</span>
                        <div className="h-px bg-zinc-800 flex-1" />
                    </div>

                    <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                        {state === "register" && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-zinc-400">Full Name</label>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl outline-none text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                                    type="text"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-400">Email Address</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl outline-none text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                                type="email"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-400">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl outline-none text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                                type="password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white w-full py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Processing..." : (state === "register" ? "Create Account" : "Sign In")}
                        </button>
                    </form>

                    <div className="w-full text-center mt-6">
                        {state === "register" ? (
                            <p className="text-zinc-400">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setState("login")}
                                    className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
                                >
                                    Login here
                                </button>
                            </p>
                        ) : (
                            <p className="text-zinc-400">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setState("register")}
                                    className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
                                >
                                    Register here
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
