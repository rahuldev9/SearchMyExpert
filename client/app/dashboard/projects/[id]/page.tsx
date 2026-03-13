"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();

    if (user) {
      const uid = user.id || user._id;
      setUserId(String(uid));
    }

    async function fetchProject() {
      try {
        const res = await API.get(`/projects/${id}`);
        setProject(res.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProject();
  }, [id]);

  async function applyToProject() {
    try {
      await API.post(`/projects/${project._id}/apply`);

      alert("Applied successfully");

      setProject((prev: any) => ({
        ...prev,
        applicants: [
          ...(prev.applicants || []),
          {
            _id: Date.now(),
            expertId: {
              _id: userId,
              name: "You",
            },
            status: "Pending",
          },
        ],
      }));
    } catch (error) {
      console.error(error);
      alert("You already applied or something went wrong");
    }
  }

  async function handleDelete() {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${project._id}`);
      alert("Project deleted successfully");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete project");
    }
  }

  async function acceptExpert(expertId: string) {
    try {
      const res = await API.post(`/projects/${project._id}/accept`, {
        expertId,
      });

      alert("Expert accepted");

      setProject(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to accept expert");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-gray-600 text-lg">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-gray-600 text-lg">Project not found</p>
      </div>
    );
  }

  const projectOwnerId =
    typeof project.businessId === "object"
      ? project.businessId?._id
      : project.businessId;

  const isOwner = String(projectOwnerId) === String(userId);

  const alreadyApplied = project.applicants?.some((app: any) => {
    const expert = app.expertId;
    return typeof expert === "object"
      ? String(expert._id) === String(userId)
      : String(expert) === String(userId);
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-8"
        >
          {/* Owner Actions */}
          {isOwner && (
            <div className="flex gap-3 mb-6">
              {["OPEN", "IN_PROGRESS"].includes(project.status) && (
                <button
                  onClick={() =>
                    router.push(`/dashboard/projects/${project._id}/edit`)
                  }
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                >
                  Edit Project
                </button>
              )}

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete Project
              </button>
            </div>
          )}

          {/* Apply Button */}
          {!isOwner && (
            <div className="mb-6">
              <button
                disabled={alreadyApplied}
                onClick={applyToProject}
                className={`px-4 py-2 rounded-lg text-white ${
                  alreadyApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {alreadyApplied ? "Already Applied" : "Apply for Project"}
              </button>
            </div>
          )}

          {/* Project Info */}
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>

          <p className="mt-4 text-gray-600">{project.description}</p>

          <div className="mt-6 space-y-2">
            <p className="text-blue-600 font-medium">
              Budget: ${project.budget}
            </p>

            <p className="text-gray-600">Category: {project.category}</p>

            <span
              className={`inline-block px-3 py-1 text-xs rounded-full ${
                project.status === "OPEN"
                  ? "bg-green-100 text-green-700"
                  : project.status === "IN_PROGRESS"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              {project.status}
            </span>
          </div>

          {/* Applicants */}
          <h2 className="mt-10 text-xl font-semibold text-gray-900">
            Applicants
          </h2>

          {project.applicants?.length === 0 && (
            <p className="text-gray-500 mt-2">No applicants yet</p>
          )}

          <div className="mt-4 space-y-3">
            {project.applicants?.map((app: any, index: number) => {
              const expert =
                typeof app.expertId === "object" ? app.expertId : null;

              return (
                <div
                  key={app._id || expert?._id || index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <p className="text-gray-900 font-medium">
                    {expert?.name || "Unknown Expert"}
                  </p>

                  {expert?.email && (
                    <p className="text-sm text-gray-500">{expert.email}</p>
                  )}

                  <p className="text-sm text-gray-500 mt-1">
                    Status: {app.status || "Pending"}
                  </p>

                  {/* Accept Button */}
                  {isOwner && project.status === "OPEN" && (
                    <button
                      onClick={() => acceptExpert(expert?._id)}
                      className="mt-3 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                    >
                      Accept
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
