"use client";

import { useParams } from "next/navigation";
import ProjectChat from "../components/ProjectChat";

export default function ChatPage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <ProjectChat projectId={params.projectId as string} />
    </div>
  );
}
