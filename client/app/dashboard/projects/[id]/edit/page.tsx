"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function fetchProject() {
      const res = await API.get(`/projects/${id}`);

      const project = res.data;

      setTitle(project.title);
      setDescription(project.description);
      setBudget(project.budget);
      setCategory(project.category);
    }

    fetchProject();
  }, [id]);

  async function updateProject() {
    try {
      await API.put(`/projects/${id}`, {
        title,
        description,
        budget,
        category,
      });

      alert("Project updated");

      router.push(`/dashboard/projects/${id}`);
    } catch (err) {
      alert("You are not allowed to edit this project");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl p-8 rounded-xl">
        <h1 className="text-2xl font-bold mb-6">Edit Project</h1>

        <input
          className="w-full p-3 mb-4 rounded bg-black/40"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-3 mb-4 rounded bg-black/40"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded bg-black/40"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded bg-black/40"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          onClick={updateProject}
          className="w-full bg-blue-600 py-3 rounded-lg"
        >
          Update Project
        </button>
      </div>
    </div>
  );
}
