"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/lib/api";
import Navbar from "@/components/Navbar";

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
  bio?: string;
  location?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number | null;
  rating?: number;
  totalProjects?: number;
  totalReviews?: number;
  completedProjects?: number;
  website?: string;
  companyName?: string;
  industry?: string;
  reviews?: Review[];
};

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/auth/profile/${userId}`);

      const userData = res.data.user;

      setUser(userData);
      setProjects(res.data.projects || []);
      setReviews(userData.reviews || []);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  if (loading) {
    return <div className="p-10">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-10">User not found</div>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* PROFILE CARD */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" />
              ) : (
                <span>{user.name?.charAt(0) || "U"}</span>
              )}
            </div>

            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-gray-500">{user.location || "No location"}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{user.bio || "No bio added yet"}</p>

          {user.website && (
            <p className="text-blue-500 text-sm mb-4">
              Website: {user.website}
            </p>
          )}

          {/* SKILLS */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {user.skills.map((skill, i) => (
                <span key={i} className="text-sm bg-gray-100 px-3 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* STATS */}
          <div className="flex gap-6 text-sm text-gray-600 flex-wrap">
            <span>⭐ {user.rating || 0}</span>
            <span>{user.totalProjects || 0} Projects</span>
            <span>{user.completedProjects || 0} Completed</span>
            <span>{user.totalReviews || 0} Reviews</span>

            {user.hourlyRate && (
              <span className="font-semibold">${user.hourlyRate}/hr</span>
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
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-500 font-medium">
                      {"⭐".repeat(review.rating)}
                    </span>

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
