"use client";

import { useRouter } from "next/navigation";
import API from "@/lib/api";

export default function SelectRole() {
  const router = useRouter();

  const setRole = async (role: string) => {
    await API.post("/auth/set-role", { role });

    if (role === "business") {
      router.push("/dashboard/business");
    } else {
      router.push("/dashboard/expert");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">Choose Account Type</h1>

        <button
          onClick={() => setRole("business")}
          className="w-full mb-4 bg-blue-600 text-white py-3 rounded"
        >
          I want to hire experts
        </button>

        <button
          onClick={() => setRole("expert")}
          className="w-full bg-green-600 text-white py-3 rounded"
        >
          I want to work as expert
        </button>
      </div>
    </div>
  );
}
