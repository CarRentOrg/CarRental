"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function OwnerGuard({ children }: Props) {
  const { user, isOwner, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Not logged in
    if (!user) {
      router.replace("/");
      return;
    }

    // Logged in but not owner/admin
    if (!isOwner) {
      router.replace("/");
    }
  }, [user, isOwner, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-400">
        Checking permissions...
      </div>
    );
  }

  if (!user || !isOwner) return null;

  return <>{children}</>;
}
