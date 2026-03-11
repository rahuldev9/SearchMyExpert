"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function HireButton() {
  const router = useRouter();

  const handleHire = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    // Not logged in
    if (!token) {
      router.push("/login");
      return;
    }

    // Logged in but not business
    if (role !== "business") {
      alert("Only business accounts can hire experts.");
      return;
    }

    // Valid business user
    alert("🎉 Expert hired successfully!");
  };

  return (
    <button
      onClick={handleHire}
      className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
    >
      Hire Expert
    </button>
  );
}
