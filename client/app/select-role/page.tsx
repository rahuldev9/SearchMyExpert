"use client";

import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Choose Account Type
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Select how you want to use the platform
          </p>

          <div className="mt-8 space-y-4">
            {/* Business */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRole("business")}
              className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition"
            >
              I want to hire experts
            </motion.button>

            {/* Expert */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRole("expert")}
              className="w-full py-4 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold transition"
            >
              I want to work as expert
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
