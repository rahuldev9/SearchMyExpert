"use client";

import { useParams } from "next/navigation";
import ProjectChat from "../components/ProjectChat";

export default function ChatPage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center ">
      <div className="w-full">
        <ProjectChat projectId={params.projectId as string} />
      </div>
    </div>
  );
}
