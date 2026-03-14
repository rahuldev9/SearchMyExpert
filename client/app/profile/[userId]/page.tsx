"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/lib/api";
import Navbar from "@/components/Navbar";
import { getToken, getRole } from "@/lib/auth";
type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type Project = {
  _id: string;
  title: string;
  description: string;
};

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

  companyName?: string;
  companySize?: string;
  industry?: string;

  followers?: any[];
  following?: any[];

  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;

  rating?: number;
  totalReviews?: number;

  isVerified?: boolean;
  isActive?: boolean;

  createdAt?: string;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [canMessage, setCanMessage] = useState(false);
  const [followStatus, setFollowStatus] = useState<
    "follow" | "requested" | "following"
  >("follow");
  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchFollowStatus();
    }
  }, [userId]);

  const fetchFollowStatus = async () => {
    try {
      const token = getToken();

      const res = await API.get(`/auth/follow/status/${userId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.data.status === "requested") {
        setFollowStatus("requested");
      } else if (res.data.status === "following") {
        setFollowStatus("following");
      } else {
        setFollowStatus("follow");
      }

      if (res.data.mutual) {
        setCanMessage(true);
      }
    } catch (err) {
      console.error("Follow status error", err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await API.get(`/auth/profile/${userId}`);

      setUser(res.data.user);
      setProjects(res.data.projects || []);
      setReviews(res.data.user.reviews || []);
    } catch (err) {
      console.error("Profile error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    const token = getToken();
    const role = getRole();

    // block only if BOTH missing
    if (!token && !role) {
      alert("Login required to follow");
      return;
    }

    try {
      const res = await API.post(
        `/auth/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (res.data.status === "requested") {
        setFollowStatus("requested");
      } else if (res.data.status === "following") {
        setFollowStatus("following");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) fetchUser();
    {
      /* ACTION BUTTONS */
    }
  }, [userId]);

  if (loading) return <div className="p-10">Loading profile...</div>;
  if (!user) return <div className="p-10">User not found</div>;

  return (
    <>
      <Navbar />

      <div className="m-4">
        {/* COVER + PROFILE HEADER */}
        <div className="relative">
          {/* COVER IMAGE */}

          <div className="relative w-full h-60 md:h-72 bg-gray-200 overflow-hidden">
            {/* Hidden input */}

            {/* Cover image */}

            <div className="w-full h-full cursor-pointer group">
              {user.coverPic ? (
                <img
                  src={user.coverPic}
                  className="w-full h-full object-cover"
                />
              ) : user?.coverPic ? (
                <img
                  src={
                    user.coverPic.startsWith("data:")
                      ? user.coverPic
                      : user.coverPic.startsWith("http")
                        ? user.coverPic
                        : `${process.env.NEXT_PUBLIC_BACKEND_API}${user.coverPic}`
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Cover
                </div>
              )}
            </div>

            {/* Upload button */}
          </div>

          {/* PROFILE HEADER */}

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-16">
              {/* AVATAR */}

              <div className="flex flex-col items-center sm:items-start gap-3">
                {/* Hidden File Input */}

                {/* Avatar */}

                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg cursor-pointer group">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-full h-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img
                      src={
                        user.avatar.startsWith("data:")
                          ? user.avatar
                          : user.avatar.startsWith("http")
                            ? user.avatar
                            : `${process.env.NEXT_PUBLIC_BACKEND_API}${user.avatar}`
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xl sm:text-2xl font-bold">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* USER INFO */}

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold">{user?.name}</h1>

                <p className="text-gray-600 text-sm sm:text-base">
                  {user?.bio}
                </p>

                {/* STATS */}

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 mt-2 text-sm">
                  <span>
                    <b>{user?.followers?.length || 0}</b> Followers
                  </span>

                  <span>
                    <b>{user?.following?.length || 0}</b> Following
                  </span>

                  <span>
                    <b>{user?.totalProjects || 0}</b> Projects
                  </span>
                </div>

                {user?.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    className="text-blue-600 text-sm block mt-2"
                  >
                    {user.website}
                  </a>
                )}
              </div>
              <div className="flex gap-3 ">
                {followStatus === "follow" && (
                  <button
                    onClick={handleFollow}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Follow
                  </button>
                )}

                {followStatus === "requested" && (
                  <button className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg cursor-not-allowed">
                    Requested
                  </button>
                )}

                {followStatus === "following" && (
                  <button className="bg-green-600 text-white px-5 py-2 rounded-lg">
                    Following
                  </button>
                )}

                {canMessage && (
                  <button className="border px-5 py-2 rounded-lg hover:bg-gray-100">
                    Message
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 px-4">
          <Stat title="Projects" value={user?.totalProjects} />

          <Stat title="Active" value={user?.activeProjects} />

          <Stat title="Completed" value={user?.completedProjects} />

          <Stat title="Rating" value={user?.rating || 0} />
        </div>
      </div>
    </>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>

      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
