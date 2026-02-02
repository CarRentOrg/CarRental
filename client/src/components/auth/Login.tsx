"use client";

import React, { useState } from "react";
import { useAppContext } from "../../contexts/App.Context";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

const Login = () => {
    const {
        showLogin,
        setShowLogin,
        axios,
        navigate,
        setToken,
    } = useAppContext();

    const [state, setState] = useState<"login" | "register">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
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
        }
    };

    if (!showLogin) return null;

    return (
        <div
            onClick={() => setShowLogin(false)}
            className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center text-sm text-gray-600 bg-black/50 backdrop-blur-sm"
        >
            <form
                onSubmit={onSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-96 text-gray-500 rounded-2xl shadow-2xl border border-gray-100 bg-white"
            >
                <div className="w-full flex flex-col items-center gap-2 mb-4">
                    <p className="text-3xl font-bold text-gray-800">
                        <span className="text-blue-600">Car</span>Rent
                    </p>
                    <p className="text-xl font-medium text-gray-600">
                        {state === "login" ? "Welcome Back" : "Create Account"}
                    </p>
                </div>

                {state === "register" && (
                    <div className="w-full">
                        <p className="font-medium mb-1">Full Name</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="John Doe"
                            className="border border-gray-200 rounded-lg w-full p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            type="text"
                            required
                        />
                    </div>
                )}

                <div className="w-full ">
                    <p className="font-medium mb-1">Email Address</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="example@gmail.com"
                        className="border border-gray-200 rounded-lg w-full p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        type="email"
                        required
                    />
                </div>

                <div className="w-full ">
                    <p className="font-medium mb-1">Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="••••••••"
                        className="border border-gray-200 rounded-lg w-full p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        type="password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white w-full py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 mt-2"
                >
                    {state === "register" ? "Sign Up" : "Login"}
                </button>

                <div className="w-full text-center mt-2">
                    {state === "register" ? (
                        <p>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setState("login")}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Login here
                            </button>
                        </p>
                    ) : (
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setState("register")}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Register here
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Login;
