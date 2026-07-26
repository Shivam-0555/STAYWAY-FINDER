"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Loader2 } from "lucide-react";

type Role = "student" | "owner" | "admin";

export function ProtectedRoute({
  children,
  allowedRoles = ["student", "owner", "admin"],
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const userRole = (user?.role as Role | undefined) ?? "student";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }

    if (!isLoading && isAuthenticated && !allowedRoles.includes(userRole)) {
      router.push("/");
    }
  }, [allowedRoles, isAuthenticated, isLoading, router, userRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
