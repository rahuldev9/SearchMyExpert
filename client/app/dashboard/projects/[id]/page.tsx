"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Project not found
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
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-8">
        {/* Owner Actions */}
        {isOwner && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={() =>
                router.push(`/dashboard/projects/${project._id}/edit`)
              }
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
            >
              Edit Project
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Delete Project
            </button>
          </div>
        )}

        {/* Apply Button */}
        {!isOwner && (
          <div className="mb-4">
            <button
              disabled={alreadyApplied}
              onClick={applyToProject}
              className={`px-4 py-2 rounded-lg ${
                alreadyApplied
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {alreadyApplied ? "Already Applied" : "Apply for Project"}
            </button>
          </div>
        )}

        <h1 className="text-2xl font-bold">{project.title}</h1>

        <p className="mt-4 text-gray-300">{project.description}</p>

        <p className="mt-4 text-blue-400">Budget: ${project.budget}</p>

        <p className="text-gray-400">Category: {project.category}</p>

        <p className="mt-2 text-purple-400">Status: {project.status}</p>

        {/* Applicants */}
        <h2 className="mt-8 text-xl font-semibold">Applicants</h2>

        {project.applicants?.length === 0 && (
          <p className="text-gray-400 mt-2">No applicants yet</p>
        )}

        {project.applicants?.map((app: any, index: number) => {
          const expert = typeof app.expertId === "object" ? app.expertId : null;

          return (
            <div
              key={app._id || expert?._id || index}
              className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10"
            >
              {/* <Link href={`/profile/${expert._id}`}>
                <p className="text-gray-300">
                  Expert Name: {expert?.name || "Unknown Expert"}
                </p>
              </Link> */}
              <p className="text-gray-300">
                Expert Name: {expert?.name || "Unknown Expert"}
              </p>
              {expert?.email && (
                <p className="text-sm text-gray-400">{expert.email}</p>
              )}

              <p className="text-sm text-gray-400 mt-1">
                Status: {app.status || "Pending"}
              </p>

              {/* Accept Button Only For Owner */}
              {isOwner && project.status === "OPEN" && (
                <button
                  onClick={() => acceptExpert(expert?._id)}
                  className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                >
                  Accept
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
