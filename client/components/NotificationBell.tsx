"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

export default function NotificationBell() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await API.get("/notifications");

        const notifications = res.data.notifications || res.data;

        const unread = notifications.filter((n: any) => !n.seen).length;

        setCount(unread);
      } catch (error) {
        console.error("Notification fetch error", error);
      }
    }

    fetchNotifications();
  }, []);

  return (
    <div
      onClick={() => router.push("/dashboard/notifications")}
      className="relative cursor-pointer"
    >
      🔔
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
