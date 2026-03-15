"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";

type Business = {
  _id: string;
  name: string;
  email: string;
  location: string;
  bio: string;
  companyName: string;
  companySize: string;
  industry: string;
  avatar?: string | null;
};

export default function Businesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const User = getCurrentUser();

  const fetchBusinesses = async () => {
    try {
      const res = await API.get("/business/users");
      if (User === res.data._id) {
        router.push("/settings");
        return;
      }
      setBusinesses(res.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter((biz) => {
    const text = search.toLowerCase();

    return (
      biz.name?.toLowerCase().includes(text) ||
      biz.companyName?.toLowerCase().includes(text) ||
      biz.location?.toLowerCase().includes(text) ||
      biz.industry?.toLowerCase().includes(text) ||
      biz.bio?.toLowerCase().includes(text)
    );
  });

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Find Businesses</h1>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by company, industry, location..."
          className="w-full mb-10 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Businesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz._id}
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {biz.avatar ? (
                    <img
                      src={biz.avatar}
                      alt={biz.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    biz.name?.charAt(0)
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{biz.companyName}</h3>
                  <p className="text-sm text-gray-400">{biz.location}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {biz.bio}
              </p>

              {/* Industry */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
                  {biz.industry}
                </span>

                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {biz.companySize}
                </span>
              </div>

              {/* Footer */}
              <button
                onClick={() => router.push(`/profile/${biz._id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
              >
                View Company
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <p className="text-gray-500 mt-10 text-center">
            No businesses found.
          </p>
        )}
      </div>
    </>
  );
}
