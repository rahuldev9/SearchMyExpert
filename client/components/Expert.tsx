"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function Experts() {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const fetchExperts = async () => {
      const res = await api.get("/users/experts");
      setExperts(res.data);
    };

    fetchExperts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Automation Experts</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((expert: any) => (
          <Link key={expert._id} href={`/experts/${expert._id}`}>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {expert.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold">{expert.name}</h3>

                  <p className="text-sm text-gray-500">
                    ⭐ {expert.rating || "New"}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-gray-600 text-sm">{expert.email}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
