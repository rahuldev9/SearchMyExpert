"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import API from "@/lib/api";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    const id = user?.id || user?._id;
    setUserId(id);

    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await API.get("/projects");

      const rawProjects = res.data.projects || res.data;

      const safeProjects = rawProjects.map((p: any) => ({
        ...p,
        businessName:
          typeof p.businessId === "object" ? p.businessId?.name : "Unknown",

        applicants: (p.applicants || []).map((a: any) => ({
          expertId:
            typeof a.expertId === "object"
              ? {
                  _id: a.expertId._id,
                  name: a.expertId.name,
                }
              : { _id: a.expertId },
        })),
      }));

      setProjects(safeProjects);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  }

  async function apply(projectId: string) {
    try {
      await API.post(`/projects/${projectId}/apply`);

      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId
            ? {
                ...project,
                applicants: [
                  ...(project.applicants || []),
                  {
                    expertId: { _id: userId },
                  },
                ],
              }
            : project,
        ),
      );

      alert("Applied successfully");
    } catch (error) {
      alert("You already applied or something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-gray-600 text-lg">Loading projects...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Available Projects
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const alreadyApplied = project.applicants?.some(
                (app: any) => app.expertId?._id === userId,
              );

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold text-gray-900">
                    {project.title}
                  </h2>

                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                      project.status === "OPEN"
                        ? "bg-green-100 text-green-700"
                        : project.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {project.status}
                  </span>

                  <p className="text-gray-600 mt-3 line-clamp-3">
                    {project.description}
                  </p>

                  <p className="text-blue-600 font-medium mt-3">
                    Budget: ${project.budget}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Posted by: {project.businessName}
                  </p>

                  <div className="flex gap-3 mt-5">
                    <a
                      href={`/dashboard/projects/${project._id}`}
                      className="flex-1 text-center py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                    >
                      View Details
                    </a>

                    {project.status === "OPEN" && (
                      <button
                        disabled={alreadyApplied}
                        onClick={() => apply(project._id)}
                        className={`flex-1 py-2 rounded-lg text-white transition ${
                          alreadyApplied
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {alreadyApplied ? "Applied" : "Apply"}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
