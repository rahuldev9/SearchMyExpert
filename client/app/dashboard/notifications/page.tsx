"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications || res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await API.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, readBy: [...(n.readBy || []), "me"] } : n,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }
  function openNotification(n: any) {
    markAsRead(n._id);
    if (n.projectId?._id) {
      router.push(`/dashboard/projects/${n.projectId._id}`);
    }
  }

  async function deleteNotification(id: string) {
    try {
      await API.delete(`/notifications/${id}`);

      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading notifications...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900 text-white p-10">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>

        {notifications.length === 0 && (
          <p className="text-gray-400">No notifications yet</p>
        )}

        <div className="space-y-4">
          {notifications.map((n) => {
            const isRead = n.seen;

            return (
              <div
                key={n._id}
                onClick={() => openNotification(n)}
                className={`p-4 rounded-lg border ${
                  isRead
                    ? "bg-white/5 border-white/10"
                    : "bg-blue-900/40 border-blue-500"
                }`}
              >
                <h2 className="font-semibold">{n.title}</h2>

                <p className="text-gray-300">{n.message}</p>

                {n.projectId?.title && (
                  <p className="text-sm text-gray-400 mt-1">
                    Project: {n.projectId.title}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n._id);
                    }}
                    className="px-3 py-1 bg-red-600 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
