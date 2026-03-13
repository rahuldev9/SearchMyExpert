"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import API from "@/lib/api";

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

      // Normalize data to prevent React object render errors
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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Available Projects</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const alreadyApplied = project.applicants?.some(
            (app: any) => app.expertId?._id === userId,
          );

          return (
            <div
              key={project._id}
              className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-xl hover:scale-[1.02] transition"
            >
              <h2 className="text-xl font-semibold">{project.title}</h2>

              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                  project.status === "OPEN"
                    ? "bg-green-600"
                    : project.status === "IN_PROGRESS"
                      ? "bg-yellow-500"
                      : "bg-gray-600"
                }`}
              >
                {project.status}
              </span>

              <p className="text-gray-300 mt-3 line-clamp-2">
                {project.description}
              </p>

              <p className="text-blue-400 mt-3 font-medium">
                Budget: ${project.budget}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Posted by: {project.businessName}
              </p>

              <div className="flex gap-3 mt-5">
                <a
                  href={`/dashboard/projects/${project._id}`}
                  className="flex-1 text-center bg-gray-700 hover:bg-gray-600 py-2 rounded-lg"
                >
                  View Details
                </a>

                <button
                  disabled={alreadyApplied}
                  onClick={() => apply(project._id)}
                  className={`flex-1 py-2 rounded-lg ${
                    alreadyApplied
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {alreadyApplied ? "Applied" : "Apply"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
