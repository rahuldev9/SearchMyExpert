"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import MyRequestCard from "@/components/MyRequestCard";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await api.get("/requests/my-requests");

      setRequests(res.data);
    };

    fetchRequests();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Posted Requests</h1>

      {requests.length === 0 && (
        <p className="text-gray-500">You haven't posted any requests yet.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req: any) => (
          <MyRequestCard
            key={req._id}
            title={req.title}
            description={req.description}
            budget={req.budget}
          />
        ))}
      </div>
    </div>
  );
}
