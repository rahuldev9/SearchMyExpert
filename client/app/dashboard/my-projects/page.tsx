"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";
import Cookies from "js-cookie";

export default function MyProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewProjectId, setReviewProjectId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [closingProject, setClosingProject] = useState(false);

  const role = Cookies.get("role");

  useEffect(() => {
    async function fetchProjects() {
      try {
        let res;

        if (role === "business") {
          res = await API.get("/projects/my-projects");
        } else {
          res = await API.get("/projects/expert-projects");
        }

        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [role]);

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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-xl"
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>

            <p className="text-gray-300 mt-2">{project.description}</p>

            <p className="text-blue-400 mt-2">Budget: ${project.budget}</p>

            <p className="text-purple-400 mt-1">Status: {project.status}</p>

            {/* Expert Button */}
            {role === "expert" && project.status === "IN_PROGRESS" && (
              <button
                onClick={() => completeProject(project._id)}
                className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Mark as Completed
              </button>
            )}

            {/* Business Buttons */}
            {role === "business" && project.status === "COMPLETED" && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => {
                    setClosingProject(false);
                    setReviewProjectId(project._id);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Leave Review
                </button>

                <button
                  onClick={() => {
                    setClosingProject(true);
                    setReviewProjectId(project._id);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Close Project
                </button>
              </div>
            )}

            <Link
              href={`/dashboard/projects/${project._id}`}
              className="inline-block mt-4 text-blue-400 hover:text-blue-300"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>

      {/* REVIEW MODAL */}
      {reviewProjectId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg w-[400px] border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>

            <label className="block mb-2">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2 bg-gray-800 rounded mb-4"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>

            <label className="block mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded mb-4"
              placeholder="Write your review..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setReviewProjectId(null);
                  setClosingProject(false);
                }}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                className="px-4 py-2 bg-blue-600 rounded"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
