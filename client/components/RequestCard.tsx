"use client";

import { api } from "@/lib/api";

type Props = {
  id: string;
  title: string;
  description: string;
  budget: number;
};

export default function RequestCard({ id, title, description, budget }: Props) {
  const apply = async () => {
    try {
      await api.post("/applications", {
        requestId: id,
      });

      alert("Application submitted successfully");
    } catch (error) {
      alert("Failed to apply");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-gray-600 mb-4">{description}</p>

      <div className="flex justify-between items-center">
        <span className="font-semibold text-blue-600">${budget}</span>

        <button
          onClick={apply}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
