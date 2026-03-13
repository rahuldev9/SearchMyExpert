"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const res = await API.get("/chat/projects");
    setProjects(res.data);
  }

  return (
    <div className="p-10 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl mb-6">Chats</h1>

      {projects.map((p) => (
        <div
          key={p._id}
          onClick={() => router.push(`/dashboard/chats/${p._id}`)}
          className="p-4 mb-3 bg-white/10 rounded cursor-pointer"
        >
          {p.title}
        </div>
      ))}
    </div>
  );
}
