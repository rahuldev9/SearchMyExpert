"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

export default function ChatsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const res = await API.get("/chat/projects");
    setProjects(res.data);
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Chats</h1>

          {projects.length === 0 && (
            <div className="text-gray-500 text-center py-20">
              No conversations yet
            </div>
          )}

          <div className="space-y-4">
            {projects.map((p) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push(`/dashboard/chats/${p._id}`)}
                className="cursor-pointer bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {p.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Open conversation →
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
