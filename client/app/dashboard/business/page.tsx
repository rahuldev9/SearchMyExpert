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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-10 space-y-8 animate-pulse">
          {/* Welcome Skeleton */}
          <div className="h-24 bg-gray-200 rounded-xl"></div>

          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-28 bg-gray-200 rounded-xl"></div>
            <div className="h-28 bg-gray-200 rounded-xl"></div>
            <div className="h-28 bg-gray-200 rounded-xl"></div>
          </div>

          {/* AI + Todo Skeleton */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-40 bg-gray-200 rounded-xl"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Recent Activity Skeleton */}
          <div className="h-40 bg-gray-200 rounded-xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 space-y-8">
        <WelcomeCard name={user?.name || ""} />
        <QuickActions role={user?.role} />
        <StatsCards />
        <div className="grid lg:grid-cols-2 gap-6">
          <MatchAI />
          <TodoList />
        </div>
        {/* <RecentActivity /> */}
      </div>
    </DashboardLayout>
  );
}
