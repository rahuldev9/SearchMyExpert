"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";

export default function AppliedRequestsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await API.get("/applications/my-applications");

      setApplications(res.data);
    };

    fetchApplications();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Requests You Applied To</h1>

      {applications.length === 0 && (
        <p className="text-gray-500">
          You haven't applied to any requests yet.
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app: any) => (
          <div
            key={app._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg mb-2">
              {app.requestId.title}
            </h3>

            <p className="text-gray-600 mb-3">{app.requestId.description}</p>

            <p className="text-blue-600 font-semibold">
              ${app.requestId.budget}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
