"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        await api.get("/auth/me");
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          Cookies.remove("token");
          Cookies.remove("role");

          router.push("/login");
        }
      }
    };

    const token = Cookies.get("token");

    if (token) {
      checkUser();
    }
  }, []);

  return null;
}
