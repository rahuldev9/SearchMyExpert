"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import PayButton from "@/components/PayButton";
import { getUserId } from "@/contexts/AuthDetails";
import CashFree from "@/components/CashFreePay";
import PaymentOptions from "@/components/PaymentPopup";
import { toast } from "sonner";
const userId = getUserId();
export default function MyProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewProjectId, setReviewProjectId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [closingProject, setClosingProject] = useState(false);
  const [Role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  // const role = Cookies.get("role");

  const expertId = projects.find((p) => p.selectedExpert)?.selectedExpert;

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
        if (res) {
          setProjects(res.data);
        }
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
      console.error("Complete project error:", error);
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

      if (closingProject) {
        await API.post(`/projects/${reviewProjectId}/close`);
      }

      setProjects((prev) =>
        prev.map((p) =>
          p._id === reviewProjectId
            ? { ...p, status: closingProject ? "CLOSED" : p.status }
            : p,
        ),
      );

      setReviewProjectId(null);
      setComment("");
      setRating(5);
      setClosingProject(false);

      toast.success(
        closingProject
          ? "Project closed successfully with review"
          : "Review submitted successfully",
      );
    } catch (error) {
      console.error("Review error:", error);
      toast.error("Failed to submit review");
    }
  }

  //return
  return (
    <DashboardLayout>
      <div className=" bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Projects</h1>

          {/* SEARCH + FILTERS */}
          <div className="bg-white p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4">
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
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CLOSED">Closed</option>
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
          {!loading && projects.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold text-gray-700">
                No Projects Yet
              </h2>
              <p className="text-gray-500 mt-2">
                You don't have any projects assigned yet.
              </p>
            </div>
          )}
          {/* NO FILTER RESULTS */}
          {!loading && projects.length > 0 && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold text-gray-700">
                No Matching Projects
              </h2>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
          {/* SKELETON LOADER */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>

                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>

                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>

                  <div className="h-9 bg-gray-200 rounded mt-5"></div>
                </div>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Section */}
                <div>
                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                      {project.title}
                    </h2>

                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap
        ${
          project.status === "IN_PROGRESS"
            ? "bg-yellow-100 text-yellow-700"
            : project.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : project.status === "CLOSED"
                ? "bg-gray-200 text-gray-700"
                : "bg-blue-100 text-blue-700"
        }`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-4" />

                  {/* Budget + Payment */}
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-blue-600">
                      ${project.budget}
                    </p>

                    {project.paymentStatus && (
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full
          ${
            project.paymentStatus === "PAID"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
                      >
                        {project.paymentStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Section */}
                <div className="mt-6 space-y-2">
                  {/* Expert Button */}
                  {Role === "expert" && project.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => completeProject(project._id)}
                      className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition shadow-sm hover:shadow"
                    >
                      Mark as Completed
                    </button>
                  )}

                  {/* Business Actions */}
                  {Role === "business" && project.status === "COMPLETED" && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      <button
                        onClick={() => {
                          setClosingProject(false);
                          setReviewProjectId(project._id);
                        }}
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        ⭐ Review
                      </button>

                      {project.paymentStatus === "PENDING" && (
                        <div className="flex-1 min-w-[120px]">
                          <PaymentOptions project={project} />
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setClosingProject(true);
                          setReviewProjectId(project._id);
                        }}
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Close
                      </button>
                    </div>
                  )}

                  {/* View Details */}
                  <Link
                    href={`/dashboard/projects/${project._id}`}
                    className="mt-3 block w-full text-center py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* REVIEW MODAL */}
        {reviewProjectId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Leave a Review
              </h2>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Rating
              </label>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} ⭐
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Comment
              </label>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setReviewProjectId(null);
                    setClosingProject(false);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={submitReview}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
