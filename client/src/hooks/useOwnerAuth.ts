"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { showToast } from "@/lib/toast";

/**
 * Hook for specialized Owner authentication logic.
 * Ensures the user is an owner and provides helper actions.
 */
export const useOwnerAuth = () => {
  const auth = useAuth();
  const router = useRouter();

  const { user, isOwner, isLoading, login, logout } = auth;

  // Simple guard within the hook if needed (though OwnerGuard is preferred)
  const requireOwner = () => {
    if (!isLoading && (!user || !isOwner)) {
      showToast.error("Unauthorized. Access restricted to owners.");
      router.push("/login");
      return false;
    }
    return true;
  };

  return {
    user,
    isOwner,
    isLoading,
    login,
    logout,
    requireOwner,
  };
};
