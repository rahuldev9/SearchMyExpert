"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
        prev.map((n) => (n._id === id ? { ...n, seen: true } : n)),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function acceptFollow(userId: string, notificationId: string) {
    try {
      await API.post(`/auth/follow/accept/${userId}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, status: "ACCEPTED" } : n,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function rejectFollow(userId: string, notificationId: string) {
    try {
      await API.post(`/auth/follow/reject/${userId}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, status: "REJECTED" } : n,
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
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <p className="text-gray-600 text-lg">Loading notifications...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className=" bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Notifications
          </h1>

          {notifications.length === 0 && (
            <p className="text-gray-500 text-center py-20">
              No notifications yet
            </p>
          )}

          <div className="space-y-4">
            {notifications.map((n) => {
              const isRead = n.seen;

              return (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => openNotification(n)}
                  className={`cursor-pointer rounded-xl border p-5 shadow-sm transition ${
                    isRead
                      ? "bg-white border-gray-200"
                      : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-gray-900">{n.title}</h2>

                      {n.type === "FOLLOW_REQUEST" && (
                        <p className="text-blue-600 text-sm mt-1">
                          {n.senderId?.name} sent you a follow request
                        </p>
                      )}

                      <p className="text-gray-600 mt-1">{n.message}</p>

                      {n.projectId?.title && (
                        <p className="text-sm text-blue-600 mt-2">
                          Project: {n.projectId.title}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {!isRead && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full mt-2"></span>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4 flex-wrap">
                    {n.type === "FOLLOW_REQUEST" && n.status === "PENDING" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acceptFollow(n.senderId?._id, n._id);
                          }}
                          className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md"
                        >
                          Accept
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            rejectFollow(n.senderId?._id, n._id);
                          }}
                          className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {n.type === "FOLLOW_REQUEST" && n.status === "ACCEPTED" && (
                      <span className="text-green-600 text-sm font-medium">
                        Follow request accepted
                      </span>
                    )}

                    {n.type === "FOLLOW_REQUEST" && n.status === "REJECTED" && (
                      <span className="text-gray-500 text-sm font-medium">
                        Follow request rejected
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n._id);
                      }}
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
