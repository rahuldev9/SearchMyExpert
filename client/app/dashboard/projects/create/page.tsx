"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";

export default function CreateProject() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");

  async function submitProject() {
    try {
      const res = await API.post("/projects/create", {
        title,
        description,
        budget,
        category,
        notificationType: "PROJECT_POSTED",
      });

      const project = res.data.project;

      alert("Project Created Successfully");

      // router.push("/dashboard/projects/my-projects");
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    }
  }
  return (
    <DashboardLayout>
      <div className=" bg-gray-900 p-10 text-white">
        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl p-8 rounded-xl">
          <h1 className="text-2xl font-bold mb-6">Create Project</h1>

          <input
            className="w-full p-3 mb-4 rounded bg-black/40"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-3 mb-4 rounded bg-black/40"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full p-3 mb-4 rounded bg-black/40"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <input
            className="w-full p-3 mb-4 rounded bg-black/40"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <button
            onClick={submitProject}
            className="w-full bg-blue-600 py-3 rounded-lg"
          >
            Post Project
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
