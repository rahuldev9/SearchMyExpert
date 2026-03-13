"use client";

import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { showConfirm } from "./ConfirmModal";
import { removeCurrentUser } from "@/lib/auth";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const ok = await showConfirm(
      "Are you sure you want to delete your account?",
      "warning",
    );

    if (!ok) return;
    try {
      const res = await API.post("/auth/logout");
      removeCurrentUser();
      router.push("/login");

      router.refresh(); // refresh middleware state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
    >
      Logout
    </button>
  );
}
