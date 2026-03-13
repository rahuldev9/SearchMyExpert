"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function CreateProject() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");

  async function submitProject() {
    try {
      const res = await API.post("/projects/create", {
        title,
        description,
        budget,
        category,
        notificationType: "PROJECT_POSTED",
      });

      const project = res.data.project;

      toast.success("Project Created Successfully");

      router.push("/dashboard/my-projects");
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    }
  }

  return (
    <DashboardLayout>
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo / Title */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg sm:text-xl font-bold text-gray-900"
          >
            Project Dashboard
          </motion.h1>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard/my-projects")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition"
            >
              My Projects
            </motion.button>
          </div>
        </div>
      </header>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-xl mx-auto"
        >
          <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Create Project
            </h1>

            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Project Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />

              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Project Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={submitProject}
              className="mt-6 w-full py-3 rounded-xl font-semibold text-white
              bg-blue-500 hover:bg-blue-600 transition shadow-md"
            >
              Post Project
            </motion.button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
