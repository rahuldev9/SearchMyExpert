"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/contexts/AuthDetails";
import DashboardLayout from "@/components/DashboardLayout";
import { setCurrentUser } from "@/lib/auth";

import WelcomeCard from "../components/WelcomeCard";
import QuickActions from "../components/QuickActions";
import StatsCards from "../components/StatsCards";
import MatchAI from "../components/MatchAI";
import TodoList from "../components/TodoList";
import RecentActivity from "../components/RecentActivity";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: "business" | "expert";
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();

        setUser(data);

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

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 space-y-8">
        {/* Welcome */}
        <WelcomeCard name={user?.name || ""} />

        {/* Quick Actions */}
        <QuickActions role={user?.role} />

        {/* Stats */}
        <StatsCards />

        {/* AI + Todo */}
        {user && user?.role === "business" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <MatchAI />
            <TodoList />
          </div>
        )}

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
}
