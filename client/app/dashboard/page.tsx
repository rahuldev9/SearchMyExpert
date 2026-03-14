"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = Cookies.get("role");

    // No role → login
    if (!role) {
      router.replace("/login");
      return;
    }

    // Root dashboard redirect
    if (pathname === "/dashboard") {
      if (role === "expert") {
        router.replace("/dashboard/expert");
      } else if (role === "business") {
        router.replace("/dashboard/business");
      }
      return;
    }

    // Expert accessing business dashboard
    if (role === "expert" && pathname.startsWith("/dashboard/business")) {
      const newPath = pathname.replace(
        "/dashboard/business",
        "/dashboard/expert",
      );
      router.replace(newPath);
      return;
    }

    // Business accessing expert dashboard
    if (role === "business" && pathname.startsWith("/dashboard/expert")) {
      const newPath = pathname.replace(
        "/dashboard/expert",
        "/dashboard/business",
      );
      router.replace(newPath);
      return;
    }

    // If no redirect needed
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  return null;
}
