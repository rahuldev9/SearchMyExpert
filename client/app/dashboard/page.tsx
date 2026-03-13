"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const role = Cookies.get("role");

    if (role === "business") {
      router.replace("/dashboard/business");
    } else if (role === "expert") {
      router.replace("/dashboard/expert");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      Redirecting to dashboard...
    </div>
  );
}
