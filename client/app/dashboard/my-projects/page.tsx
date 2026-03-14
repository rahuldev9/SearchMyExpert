"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import PayButton from "@/components/PayButton";
import { getUserId } from "@/contexts/AuthDetails";
const userId = getUserId();
export default function MyProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewProjectId, setReviewProjectId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [closingProject, setClosingProject] = useState(false);
  const [Role, setRole] = useState("");

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
      alert("Failed to complete project");
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

      alert(
        closingProject
          ? "Project closed successfully with review"
          : "Review submitted successfully",
      );
    } catch (error) {
      console.error("Review error:", error);
      alert("Failed to submit review");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-gray-600 text-lg">Loading projects...</p>
      </div>
    );
  }

  //return
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Projects</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {project.title}
                </h2>

                <p className="text-gray-600 mt-2 line-clamp-3">
                  {project.description}
                </p>

                <p className="text-blue-600 font-medium mt-3">
                  Budget: ${project.budget}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full
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
                  {project.status}
                </span>

                {/* Expert Button */}
                {Role === "expert" && project.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => completeProject(project._id)}
                    className="mt-4 w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                  >
                    Mark as Completed
                  </button>
                )}
                {/* Business Buttons */}
                {Role === "business" && project.status === "COMPLETED" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setClosingProject(false);
                        setReviewProjectId(project._id);
                      }}
                      className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                      Leave Review
                    </button>
                    {project.status === "COMPLETED" &&
                      project.paymentStatus === "PENDING" && (
                        <PayButton project={project} />
                      )}

                    <button
                      onClick={() => {
                        setClosingProject(true);
                        setReviewProjectId(project._id);
                      }}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                )}

                <Link
                  href={`/dashboard/projects/${project._id}`}
                  className="inline-block mt-4 text-blue-500 hover:text-blue-600 font-medium"
                >
                  View Details →
                </Link>
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
