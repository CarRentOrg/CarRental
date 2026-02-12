"use client";

import { ReactNode, useEffect } from "react";
import { useOwnerAuth } from "@/contexts/OwnerAuthContext";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function OwnerGuard({ children }: Props) {
  const { owner, isLoading } = useOwnerAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for initial auth check to complete
    if (isLoading) return;

    // Not logged in or not an owner
    if (!owner) {
      // Small delay to ensure state has settled
      const timeout = setTimeout(() => {
        // If we're on an admin route, redirect to admin login with callback
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/admin")) {
          router.replace(
            `/login?callbackUrl=${encodeURIComponent(currentPath + window.location.search)}`,
          );
        } else {
          router.replace("/");
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [owner, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-400">
        Checking permissions...
      </div>
    );
  }

  if (!owner) return null;

  return <>{children}</>;
}
