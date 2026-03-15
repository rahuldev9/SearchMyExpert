"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/* ---------------- Skeleton Loader ---------------- */

function NotificationSkeleton() {
  return (
    <div className="animate-pulse flex gap-4 p-4 border rounded-xl bg-white shadow-sm">
      <div className="w-10 h-10 rounded-full bg-gray-300"></div>

      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>

        <div className="flex gap-2">
          <div className="h-7 w-16 bg-gray-300 rounded"></div>
          <div className="h-7 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page Component ---------------- */

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

  async function deleteNotification(id: string) {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  function openNotification(n: any) {
    markAsRead(n._id);

    if (n.projectId && n.projectId._id) {
      router.push(`/dashboard/projects/${n.projectId._id}`);
    }
  }
  /* ---------------- Loading UI ---------------- */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10 min-h-screen">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-6"></div>

            {[...Array(6)].map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ---------------- Page UI ---------------- */

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 py-10 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    if (n.projectId?._id) {
                      openNotification(n);
                    }
                  }}
                  className={`relative cursor-pointer rounded-xl border p-4 sm:p-5 transition shadow-sm flex gap-4 ${
                    isRead
                      ? "bg-white border-gray-200"
                      : "bg-blue-50 border-blue-300"
                  }`}
                >
                  {!isRead && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-xl"></span>
                  )}

                  {/* Avatar */}
                  {n.senderId?.avatar ? (
                    <img
                      src={n.senderId.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {n.senderId?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {n.title}
                        </h2>

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

                    {/* Actions */}

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {n.type === "FOLLOW_REQUEST" &&
                        n.status === "PENDING" && (
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

                      {n.type === "FOLLOW_REQUEST" &&
                        n.status === "ACCEPTED" && (
                          <span className="text-green-600 text-sm font-medium">
                            Follow request accepted
                          </span>
                        )}

                      {n.type === "FOLLOW_REQUEST" &&
                        n.status === "REJECTED" && (
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
