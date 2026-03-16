"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { motion } from "framer-motion";
import PaymentOptions from "@/components/PaymentPopup";
import { toast } from "sonner";

export default function MyProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewProjectId, setReviewProjectId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [Role, setRole] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await API.get("/auth/role");
        setRole(res.data.role);
      } catch (error) {
        console.error("Failed to fetch role:", error);
      }
    }

    fetchUserRole();
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await API.get("/projects/my-projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [Role]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !categoryFilter || project.category === categoryFilter;

    const matchesStatus = !statusFilter || project.status === statusFilter;

    const matchesPaymentStatus =
      !paymentStatusFilter || project.paymentStatus === paymentStatusFilter;

    return (
      matchesSearch && matchesCategory && matchesStatus && matchesPaymentStatus
    );
  });

  async function completeProject(projectId: string) {
    try {
      await API.post(`/projects/${projectId}/complete`);

      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId ? { ...p, status: "COMPLETED" } : p,
        ),
      );
    } catch (error) {
      toast.error("Failed to complete project");
    }
  }

  async function submitReview() {
    try {
      if (!reviewProjectId) return;

      await API.post(`/projects/${reviewProjectId}/review`, {
        rating,
        comment,
      });

      setProjects((prev) =>
        prev.map((p) =>
          p._id === reviewProjectId ? { ...p, reviewSubmitted: true } : p,
        ),
      );

      setReviewProjectId(null);
      setRating(5);
      setComment("");

      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error("Failed to submit review");
    }
  }

  async function closeProject(projectId: string) {
    try {
      await API.post(`/projects/${projectId}/close`);

      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? { ...p, status: "CLOSED" } : p)),
      );

      toast.success("Project closed successfully");
    } catch (error) {
      toast.error("Failed to close project");
    }
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen px-4 sm:px-6 py-10 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Projects</h1>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-md shadow-md p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-gray-100 px-4 py-2 rounded-lg outline-none focus:bg-white focus:shadow-sm"
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg outline-none"
            >
              <option value="">All Categories</option>
              <option value="DESIGN">Design</option>
              <option value="DEVELOPMENT">Development</option>
              <option value="MARKETING">Marketing</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg outline-none"
            >
              <option value="">All Status</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="bg-gray-100 px-4 py-2 rounded-lg outline-none"
            >
              <option value="">All Payments</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const canClose =
                project.reviewSubmitted && project.paymentStatus === "PAID";

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {project.title}
                      </h2>

                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                        {project.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-3">
                      {project.description}
                    </p>

                    <div className="mt-5 flex justify-between items-center">
                      <p className="font-bold text-blue-600 text-lg">
                        ${project.budget}
                      </p>

                      {project.paymentStatus && (
                        <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600">
                          {project.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {Role === "expert" && project.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => completeProject(project._id)}
                        className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Mark as Completed
                      </button>
                    )}

                    {Role === "business" && project.status === "COMPLETED" && (
                      <div className="flex flex-wrap gap-2">
                        {!project.reviewSubmitted && (
                          <button
                            onClick={() => setReviewProjectId(project._id)}
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            ⭐ Review
                          </button>
                        )}

                        {project.paymentStatus === "PENDING" && (
                          <PaymentOptions project={project} />
                        )}

                        <button
                          disabled={!canClose}
                          onClick={() => closeProject(project._id)}
                          className={`flex-1 py-2 rounded-lg transition ${
                            canClose
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          Close
                        </button>
                      </div>
                    )}

                    <Link
                      href={`/dashboard/projects/${project._id}`}
                      className="block text-center py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                    >
                      View Details →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Review Modal */}
        {reviewProjectId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Leave Review</h2>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-gray-100 p-2 rounded-lg mb-4"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write review..."
                className="w-full bg-gray-100 p-3 rounded-lg mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReviewProjectId(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={submitReview}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
