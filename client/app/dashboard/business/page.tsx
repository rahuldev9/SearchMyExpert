"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/contexts/AuthDetails";
import Link from "next/link";
import {
  FolderPlus,
  Search,
  MessageSquare,
  ClipboardList,
  Folder,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { setCurrentUser } from "@/lib/auth";
import NotificationBell from "@/components/NotificationBell";

interface User {
  name: string;
  role?: "business" | "expert";
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();

        setUser(data);

        // Save user to localStorage
        setCurrentUser({
          id: data._id,
          name: data.name,
          email: data.email,
        });
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  const businessActions = [
    {
      name: "Search Experts",
      icon: Search,
      link: "/experts",
    },
    {
      name: "Post Project",
      icon: FolderPlus,
      link: "/projects/new",
    },
    {
      name: "My Projects",
      icon: Folder,
      link: "/projects",
    },
    {
      name: "Messages",
      icon: MessageSquare,
      link: "/messages",
    },
  ];

  const expertActions = [
    {
      name: "View Requests",
      icon: ClipboardList,
      link: "/requests",
    },
    {
      name: "My Projects",
      icon: Folder,
      link: "/projects",
    },
    {
      name: "Messages",
      icon: MessageSquare,
      link: "/messages",
    },
  ];

  const actions = user?.role === "business" ? businessActions : expertActions;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 space-y-8">
        {/* ================= WELCOME ================= */}

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name} 👋</h1>

          <p className="text-gray-500 mt-1">
            Here's what's happening on your dashboard today.
          </p>
          <NotificationBell />
        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.name}
                  href={action.link}
                  className="bg-white border rounded-xl p-4 hover:shadow-md transition flex flex-col items-center text-center gap-2"
                >
                  <Icon className="text-blue-600" size={28} />

                  <span className="text-sm font-medium">{action.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= INSIGHTS ================= */}

        <div>
          <h2 className="text-lg font-semibold mb-4">Insights</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Total Projects</p>
              <p className="text-2xl font-bold mt-1">12</p>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Active Projects</p>
              <p className="text-2xl font-bold mt-1">5</p>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Messages</p>
              <p className="text-2xl font-bold mt-1">8</p>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold mt-1">7</p>
            </div>
          </div>
        </div>

        {/* ================= RECENT ACTIVITY ================= */}

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

          <div className="bg-white border rounded-xl p-4 space-y-4">
            <div className="text-sm text-gray-600">
              ✔ Project "Automation Bot" completed
            </div>

            <div className="text-sm text-gray-600">
              📩 New message from Client
            </div>

            <div className="text-sm text-gray-600">📌 New request received</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
