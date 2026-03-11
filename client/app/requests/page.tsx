"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RequestCard from "@/components/RequestCard";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await api.get("/requests");
      setRequests(res.data);
    };

    fetchRequests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Automation Requests</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
