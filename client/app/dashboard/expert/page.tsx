"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequestCard from "@/components/RequestCard";
import { api } from "@/lib/api";

export default function ExpertDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadRequests = async () => {
      const res = await api.get("/requests");

      setRequests(res.data);
    };

    loadRequests();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Available Automation Projects</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {requests.map((req: any) => (
          <RequestCard
            key={req._id}
            id={req._id}
            title={req.title}
            description={req.description}
            budget={req.budget}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
