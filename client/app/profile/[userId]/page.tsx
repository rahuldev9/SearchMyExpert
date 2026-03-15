"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import Navbar from "@/components/Navbar";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  coverPic?: string;
  role?: "business" | "expert";
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  followers?: any[];
  following?: any[];
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  rating?: number;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/auth/profile/${userId}`);
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="m-4 animate-pulse">
          <div className="w-full h-60 md:h-72 bg-gray-300 rounded-lg"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300"></div>

            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
              <div className="h-4 w-72 bg-gray-300 rounded"></div>

              <div className="flex gap-6">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="h-10 w-28 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

  /* ================= USER NOT FOUND ================= */

  if (!user)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-10">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            User Not Found
          </h2>

          <p className="text-gray-600 mb-6">
            The profile you are looking for doesn't exist.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );

  /* ================= PROFILE ================= */

  return (
    <>
      <Navbar />

      <div className="m-4">
        {/* COVER */}
        <div className="relative w-full h-60 md:h-72 bg-gray-200 rounded-lg overflow-hidden">
          {user.coverPic ? (
            <img src={user.coverPic} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Cover
            </div>
          )}

          {/* AVATAR ON TOP OF COVER */}
          <div className="absolute bottom-6 left-6 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-xl font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        {/* PROFILE INFO */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <h1 className="text-2xl font-bold">{user.name}</h1>

          <p className="text-gray-600 mt-1">{user.bio}</p>

          <div className="flex gap-6 mt-3 text-sm">
            <span>
              <b>{user.followers?.length || 0}</b> Followers
            </span>

            <span>
              <b>{user.following?.length || 0}</b> Following
            </span>

            <span>
              <b>{user.totalProjects || 0}</b> Projects
            </span>
          </div>
        </div>

        {/* PROFILE INFO */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
          <h1 className="text-2xl font-bold">{user.name}</h1>

          <p className="text-gray-600 mt-1">{user.bio}</p>

          <div className="flex gap-6 mt-3 text-sm">
            <span>
              <b>{user.followers?.length || 0}</b> Followers
            </span>

            <span>
              <b>{user.following?.length || 0}</b> Following
            </span>

            <span>
              <b>{user.totalProjects || 0}</b> Projects
            </span>
          </div>
        </div>
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 px-4">
          <Stat title="Projects" value={user.totalProjects} />
          <Stat title="Active" value={user.activeProjects} />
          <Stat title="Completed" value={user.completedProjects} />
          <Stat title="Rating" value={user.rating || 0} />
        </div>
      </div>
    </>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-lg font-bold">{value || 0}</p>
    </div>
  );
}
