"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await API.get(`/projects/${id}`);
        const project = res.data;

        setTitle(project.title);
        setDescription(project.description);
        setBudget(project.budget);
        setCategory(project.category);
      } catch (error) {
        console.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProject();
  }, [id]);

  async function updateProject() {
    try {
      await API.put(`/projects/${id}`, {
        title,
        description,
        budget,
        category,
      });

      alert("Project updated successfully");

      router.push(`/dashboard/projects/${id}`);
    } catch (err) {
      alert("You are not allowed to edit this project");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
          <p className="text-gray-600 text-lg">Loading project...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Project
            </h1>

            {/* TITLE */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Project Title
              </label>
              <input
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* BUDGET */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Budget</label>
              <input
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            {/* CATEGORY */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">
                Category
              </label>
              <input
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={updateProject}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
              >
                Update Project
              </button>

              <button
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
