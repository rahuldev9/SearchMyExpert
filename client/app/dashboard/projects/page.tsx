"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import API from "@/lib/api";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    const id = user?.id || user?._id || null;

    setUserId(id);

    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await API.get("/projects");

      const rawProjects = res?.data?.projects || res?.data || [];

      const safeProjects = (rawProjects || []).map((p: any) => ({
        ...p,

        businessName:
          p?.businessId && typeof p.businessId === "object"
            ? p.businessId?.name
            : "Unknown",

        applicants: (p?.applicants || []).map((a: any) => {
          if (!a?.expertId) return { expertId: null };

          if (typeof a.expertId === "object") {
            return {
              expertId: {
                _id: a.expertId?._id,
                name: a.expertId?.name,
              },
            };
          }

          return { expertId: { _id: a.expertId } };
        }),
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
                  { expertId: { _id: userId } },
                ],
              }
            : project,
        ),
      );

      toast.success("Applied successfully");
    } catch (error) {
      toast.error("You already applied or something went wrong");
    }
  }
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase()) ||
      project.businessName?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !categoryFilter || project.category === categoryFilter;

    const matchesStatus = !statusFilter || project.status === statusFilter;

    const matchesPaymentStatus =
      !paymentStatusFilter || project.paymentStatus === paymentStatusFilter;

    return (
      matchesSearch && matchesCategory && matchesStatus && matchesPaymentStatus
    );
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Available Projects
          </h1>

          {/* SKELETON LOADER */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>

                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>

                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>

                  <div className="flex gap-3 mt-5">
                    <div className="h-9 bg-gray-200 rounded w-full"></div>
                    <div className="h-9 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* SEARCH + FILTERS */}
          <div className="p-4 rounded-xl border-none mb-6 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="DESIGN">Design</option>
              <option value="DEVELOPMENT">Development</option>
              <option value="MARKETING">Marketing</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {/* Payment Status */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">All Payments</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {/* NO PROJECTS */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold text-gray-700">
                No Projects Available
              </h2>
              <p className="text-gray-500 mt-2">
                There are currently no projects open for applications.
              </p>
            </div>
          )}

          {/* PROJECT GRID */}
          {!loading && projects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const alreadyApplied = project.applicants?.some(
                  (app: any) => app?.expertId?._id === userId,
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
