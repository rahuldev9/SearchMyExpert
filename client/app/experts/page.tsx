"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import ExpertMatcher from "@/components/UserMatcher";
import Navbar from "@/components/Navbar";

type User = {
  _id: string;
  name: string;
  email: string;
  location: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
  avatar?: string | null;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showAI, setShowAI] = useState(false);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await API.get("/expert/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(text) ||
      user.location?.toLowerCase().includes(text) ||
      user.bio?.toLowerCase().includes(text) ||
      user.hourlyRate?.toString().includes(text) ||
      user.rating?.toString().includes(text) ||
      user.skills?.some((skill) => skill.toLowerCase().includes(text))
    );
  });

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Find Automation Experts</h1>

          <button
            onClick={() => setShowAI(!showAI)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition"
          >
            🤖 AI Match
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, skill, rating, location..."
          className="w-full mb-10 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* AI Matcher */}
        {showAI && (
          <div className="mb-14">
            <ExpertMatcher isOpen={showAI} onClose={() => setShowAI(false)} />
          </div>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0)
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span className="text-yellow-500">⭐</span>
                    {user.rating}
                  </div>

                  <p className="text-sm text-gray-400">{user.location}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {user.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {user.skills?.slice(0, 3).map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm text-gray-700 font-medium">
                  ${user.hourlyRate}/hr
                </span>

                <button
                  onClick={() => router.push(`/profile/${user._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <p className="text-gray-500 mt-10 text-center">No experts found.</p>
        )}
      </div>
    </>
  );
}
