"use client";

import { useEffect } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function AuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        await API.get("/auth/me");
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          Cookies.remove("token");
          Cookies.remove("role");
        }
      }
    };

    checkUser();
  }, [router]);

  return null;
}
