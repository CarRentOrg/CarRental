"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppContext } from "@/contexts/App.Context";

export default function AuthCallback() {
    const router = useRouter();
    const { setToken } = useAppContext();

    useEffect(() => {
        const handleAuthCallback = async () => {
            // Check for hash parameters (implicit flow / magic link)
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Auth callback error:", error);
                router.push("/");
                return;
            }

            if (session) {
                // Set the token from Supabase session
                // Note: Ensure your backend accepts Supabase JWTs or you have a mechanism to exchange this
                setToken(session.access_token);
                console.log("Supabase session found, token set.");
            } else {
                console.log("No session found in callback.");
            }

            // Redirect to home/dashboard
            router.push("/");
        };

        handleAuthCallback();
    }, [router, setToken]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-400">Authenticating...</p>
            </div>
        </div>
    );
}
