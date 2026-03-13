"use client";

import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div className="space-y-4">
      {notifications.map((n) => (
        <div
          key={n._id}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg p-4"
        >
          <h4 className="font-medium">{n.title}</h4>

          <p className="text-gray-300 text-sm mt-1">{n.message}</p>
        </div>
      ))}
    </div>
  );
}
