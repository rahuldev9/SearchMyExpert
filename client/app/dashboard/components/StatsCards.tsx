"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/contexts/AuthDetails";

export default function StatsCards() {
  const [stats, setStats] = useState([
    { label: "Total Projects", value: 0 },
    { label: "Active Projects", value: 0 },
    { label: "Completed", value: 0 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = await getUserProfile();

        setStats([
          { label: "Total Projects", value: user.totalProjects || 0 },
          { label: "Active Projects", value: user.activeProjects || 0 },
          { label: "Completed", value: user.completedProjects || 0 },
        ]);
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Insights</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border-none rounded-xl p-4">
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
