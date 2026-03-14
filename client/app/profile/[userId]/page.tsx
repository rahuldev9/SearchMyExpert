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

type User = {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string | null;
  cover?: string | null;
  bio?: string;
  location?: string;
  skills?: string[];
  rating?: number;
  hourlyRate?: number | null;
  website?: string;
  reviews?: Review[];
};

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
  }, [userId]);

  if (loading) return <div className="p-10">Loading profile...</div>;
  if (!user) return <div className="p-10">User not found</div>;

  return (
    <>
      <Navbar />

      <div className=" p-6 space-y-6">
        {/* COVER */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="h-48 bg-gray-200 relative">
            {user.cover && (
              <img src={user.cover} className="w-full h-full object-cover" />
            )}

            {/* AVATAR */}
            <div className="absolute -bottom-10 left-6">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xl font-bold">
                    {user.name?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PROFILE INFO */}
          <div className="pt-14 pb-6 px-6">
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-500">{user.location}</p>
                <p className="text-gray-600 text-sm mt-2">
                  {user.bio || "No bio yet"}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
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

            {/* SKILLS */}
            {user.skills && (
              <div className="flex flex-wrap gap-2 mt-4">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 px-3 py-1 text-sm rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Projects</h2>

          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* REVIEWS */}
        <div className="bg-white shadow rounded-xl p-6 border-none">
          <h2 className="text-lg font-semibold mb-4">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border rounded-lg p-4 border-none"
                >
                  <div className="flex justify-between mb-2">
                    <span>{"⭐".repeat(review.rating)}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
