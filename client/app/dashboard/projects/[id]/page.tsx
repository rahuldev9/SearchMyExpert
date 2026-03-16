"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import ExportApplicants from "@/components/ExportProjects";
import { toast } from "sonner";

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

      toast.success("Applied successfully");

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
      toast.error("You already applied or something went wrong");
    }
  }

  async function handleDelete() {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${project._id}`);
      toast.success("Project deleted successfully");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete project");
    }
  }

  async function acceptExpert(expertId: string) {
    try {
      const res = await API.post(`/projects/${project._id}/accept`, {
        expertId,
      });

      toast.success("Expert accepted");

      setProject(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept expert");
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* PROJECT CARD */}

          {!project && (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
              <p className="text-gray-600 text-lg">Project not found</p>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {project.title}
                </h1>

                <p className="mt-3 text-gray-600 max-w-2xl">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Budget: ${project.budget}
                  </span>

                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {project.category}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm
                ${
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
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">
                {isOwner &&
                  ["OPEN", "IN_PROGRESS"].includes(project.status) && (
                    <button
                      onClick={() =>
                        router.push(`/dashboard/projects/${project._id}/edit`)
                      }
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                    >
                      Edit
                    </button>
                  )}

                {isOwner && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                )}

                {!isOwner && project.applicants?.length && (
                  <button
                    disabled={alreadyApplied}
                    onClick={applyToProject}
                    className={`px-4 py-2 rounded-lg text-white
                  ${
                    alreadyApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  >
                    {alreadyApplied ? "Applied" : "Apply"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* APPLICANTS TABLE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Applicants
              </h2>

              {isOwner && (
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <ExportApplicants applicants={project.applicants || []} />
                </div>
              )}
            </div>

            {project.applicants?.length === 0 ? (
              <p className="text-gray-500">No applicants yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-600 text-sm">
                      <th className="py-3">Expert</th>
                      <th>Status</th>
                      <th>Email</th>
                      {isOwner && <th className="text-right">Action</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {project.applicants?.map((app: any, index: number) => {
                      const expert =
                        typeof app.expertId === "object" ? app.expertId : null;

                      return (
                        <tr
                          key={app._id || expert?._id || index}
                          className="border-b hover:bg-gray-50"
                        >
                          <td
                            onClick={() =>
                              router.push(`/profile/${expert?._id}`)
                            }
                            className="py-3 font-medium text-gray-900 cursor-pointer"
                          >
                            {expert?.name || "Unknown Expert"}
                          </td>

                          <td>
                            <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                              {app.status || "Pending"}
                            </span>
                          </td>

                          <td className="text-gray-600 text-sm">
                            {expert?.email || "-"}
                          </td>

                          {isOwner && project.status === "OPEN" && (
                            <td className="text-right">
                              <button
                                onClick={() => acceptExpert(expert?._id)}
                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                              >
                                Accept
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
